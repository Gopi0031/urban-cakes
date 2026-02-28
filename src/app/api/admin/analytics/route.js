import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import Customer from '@/lib/models/Customer';
import { subDays, format } from 'date-fns';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const startDate = subDays(new Date(), days);
    
    // Total Revenue
    const orders = await Order.find({
      createdAt: { $gte: startDate },
      orderStatus: { $ne: 'cancelled' },
    });
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Previous period comparison
    const previousStartDate = subDays(startDate, days);
    const previousOrders = await Order.find({
      createdAt: { $gte: previousStartDate, $lt: startDate },
      orderStatus: { $ne: 'cancelled' },
    });
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;
    
    // Customers
    const totalCustomers = await Customer.countDocuments();
    const newCustomers = await Customer.countDocuments({
      createdAt: { $gte: startDate },
    });
    
    // Products
    const totalProducts = await Product.countDocuments({ active: true });
    const lowStockProducts = await Product.countDocuments({
      active: true,
      quantity: { $lt: 10 },
    });
    
    // Daily Revenue for Chart
    const dailyRevenue = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayOrders = await Order.find({
        createdAt: { $gte: dayStart, $lte: dayEnd },
        orderStatus: { $ne: 'cancelled' },
      });
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      
      dailyRevenue.push({
        date: format(dayStart, 'MMM dd'),
        revenue: dayRevenue,
      });
    }
    
    // Category Performance
    const categoryStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: { $ne: 'cancelled' },
        },
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
    ]);
    
    const totalCategoryRevenue = categoryStats.reduce((sum, cat) => sum + cat.revenue, 0);
    const categoryPerformance = categoryStats.map(cat => ({
      name: cat._id,
      revenue: cat.revenue,
      orders: cat.orders,
      percentage: totalCategoryRevenue > 0 ? ((cat.revenue / totalCategoryRevenue) * 100).toFixed(1) : 0,
    }));
    
    // Top Products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: { $ne: 'cancelled' },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          soldCount: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 1,
          name: '$product.name',
          image: '$product.image',
          rating: '$product.rating',
          soldCount: 1,
          revenue: 1,
        },
      },
    ]);
    
    // Order Status Distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);
    
    return NextResponse.json({
      success: true,
      analytics: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        revenueGrowth: revenueGrowth.toFixed(1),
        totalCustomers,
        newCustomers,
        totalProducts,
        lowStockProducts,
        dailyRevenue,
        categoryPerformance,
        topProducts,
        orderStatusDistribution,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}