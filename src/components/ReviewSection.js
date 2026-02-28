'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/reviews?productId=${productId}`);
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('customerToken');
    if (!token) {
      toast.error('Please login to write a review');
      return;
    }

    try {
      const { data } = await axios.post(
        '/api/reviews',
        {
          productId,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success('Review submitted! 🎉');
        setReviews([data.review, ...reviews]);
        setFormData({ rating: 5, title: '', comment: '' });
        setShowForm(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit review');
    }
  };

  const renderStars = (rating, size = 20, interactive = false, onRate = null) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            style={{
              background: 'none',
              border: 'none',
              cursor: interactive ? 'pointer' : 'default',
              padding: 0,
            }}
            disabled={!interactive}
          >
            <Star
              size={size}
              fill={star <= rating ? '#f59e0b' : 'none'}
              stroke={star <= rating ? '#f59e0b' : '#d1d5db'}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={{ marginTop: '40px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
            Customer Reviews
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={24} fill="#f59e0b" stroke="#f59e0b" />
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                {averageRating}
              </span>
            </div>
            <span style={{ color: '#666', fontSize: '14px' }}>
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="card" style={{
          padding: '24px',
          marginBottom: '24px',
          animation: 'slideInDown 0.3s ease-out',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            Write Your Review
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label className="form-label">Rating *</label>
              {renderStars(formData.rating, 28, true, (rating) => 
                setFormData({ ...formData, rating })
              )}
            </div>

            <div>
              <label className="form-label">Review Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Great product!"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Your Review *</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                className="form-input"
                rows={4}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '2px dashed #e5e7eb',
        }}>
          <Star size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '16px', color: '#666' }}>
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {reviews.map((review, index) => (
            <div
              key={review._id}
              className="card"
              style={{
                padding: '20px',
                animation: `slideInUp 0.4s ease-out ${index * 0.05}s backwards`,
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                  }}>
                    {review.customerId?.avatar ? (
                      <img
                        src={review.customerId.avatar}
                        alt={review.customerId.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      review.customerId?.name?.charAt(0).toUpperCase() || <User size={24} />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                      {review.customerId?.name || 'Anonymous'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {review.verified && (
                  <span style={{
                    background: '#d1fae5',
                    color: '#065f46',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}>
                    ✓ Verified Purchase
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '12px' }}>
                {renderStars(review.rating, 18)}
              </div>

              {review.title && (
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                }}>
                  {review.title}
                </h4>
              )}

              <p style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.6',
                marginBottom: '12px',
              }}>
                {review.comment}
              </p>

              {review.response && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '12px',
                }}>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#166534',
                    marginBottom: '4px',
                  }}>
                    🍰 Urban Bakes Response:
                  </p>
                  <p style={{ fontSize: '13px', color: '#14532d' }}>
                    {review.response.text}
                  </p>
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e5e7eb',
              }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    fontSize: '13px',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  <ThumbsUp size={14} />
                  Helpful ({review.helpful || 0})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}