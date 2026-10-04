import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import RatingStars from '../../components/RatingStars';
import { getUserStores, submitRating } from '../../services/userService';
import { FiSearch, FiShoppingBag, FiMapPin, FiStar, FiEdit2, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Search & Sort state
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Rating Modal state
  const [ratingModalStore, setRatingModalStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getUserStores({
        search: search || undefined,
        sortBy,
        sortOrder,
        page: pagination.page,
        limit: pagination.limit,
      });

      const { stores: fetchedStores, total, page, limit, totalPages } = response.data.data;
      setStores(fetchedStores);
      setPagination({ total, page, limit, totalPages });
    } catch (err) {
      toast.error('Failed to load stores');
    } finally {
      setIsLoading(false);
    }
  }, [search, sortBy, sortOrder, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleOpenRatingModal = (store) => {
    setRatingModalStore(store);
    setSelectedRating(store.user_rating || 5);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!ratingModalStore) return;

    setIsSubmittingRating(true);
    try {
      await submitRating(ratingModalStore.id, selectedRating);
      toast.success(
        ratingModalStore.user_rating
          ? 'Your rating has been updated!'
          : 'Thank you! Rating submitted successfully.'
      );
      setRatingModalStore(null);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px 60px', width: '100%' }}>
        {/* Banner */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Discover & Rate Stores
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px' }}>
            Browse registered stores in your area and share your honest 1–5 star experience.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ flex: '1 1 320px' }}>
            <Input
              placeholder="Search stores by name or address..."
              icon={FiSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sort by:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
              }}
              style={{
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                fontSize: '14px',
                outline: 'none',
              }}
            >
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="average_rating-desc">Highest Rated</option>
              <option value="average_rating-asc">Lowest Rated</option>
            </select>
          </div>
        </div>

        {/* Store Grid */}
        {isLoading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="glass-panel"
                style={{
                  height: '240px',
                  borderRadius: 'var(--radius-lg)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏪</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
              No stores found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
              Try searching with another keyword or clear the search filter.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '24px',
            }}
          >
            {stores.map((store) => (
              <GlassCard
                key={store.id}
                hoverEffect
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-lg)',
                  position: 'relative',
                }}
              >
                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(255, 107, 53, 0.2) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        flexShrink: 0,
                      }}
                    >
                      <FiShoppingBag size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {store.name}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: 'var(--text-muted)',
                          fontSize: '13px',
                          marginTop: '4px',
                        }}
                      >
                        <FiMapPin size={13} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>
                          {store.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Overall Rating Section */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 14px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Overall Rating
                      </span>
                      <div style={{ marginTop: '2px' }}>
                        <RatingStars rating={parseFloat(store.average_rating || 0)} size={16} />
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {store.total_ratings || 0} reviews
                    </span>
                  </div>

                  {/* User's Submitted Rating Section */}
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: store.user_rating ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${store.user_rating ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: store.user_rating ? '#34d399' : 'var(--text-muted)', fontWeight: 500 }}>
                      {store.user_rating ? 'Your Rating:' : 'Not rated yet'}
                    </span>
                    {store.user_rating ? (
                      <RatingStars rating={store.user_rating} size={15} />
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>—</span>
                    )}
                  </div>
                </div>

                {/* Rating CTA Button */}
                <Button
                  variant={store.user_rating ? 'secondary' : 'primary'}
                  size="md"
                  onClick={() => handleOpenRatingModal(store)}
                  style={{ width: '100%' }}
                >
                  {store.user_rating ? (
                    <>
                      <FiEdit2 size={14} /> Modify Your Rating
                    </>
                  ) : (
                    <>
                      <FiStar size={14} /> Rate This Store
                    </>
                  )}
                </Button>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Pagination bar */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            >
              Previous
            </Button>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            >
              Next
            </Button>
          </div>
        )}
      </main>

      {/* Interactive Rating Modal */}
      <Modal
        isOpen={!!ratingModalStore}
        onClose={() => setRatingModalStore(null)}
        title={ratingModalStore ? `Rate ${ratingModalStore.name}` : 'Rate Store'}
      >
        <form onSubmit={handleSubmitRating} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '12px 0' }}>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Select your rating from 1 (poor) to 5 (excellent):
          </p>

          <div style={{ padding: '16px 24px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-lg)' }}>
            <RatingStars
              rating={selectedRating}
              isInteractive
              size={36}
              onChange={(newRating) => setSelectedRating(newRating)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button type="button" variant="secondary" onClick={() => setRatingModalStore(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmittingRating}>
              {ratingModalStore?.user_rating ? 'Update Rating' : 'Submit Rating'}
            </Button>
          </div>
        </form>
      </Modal>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </>
  );
};

export default UserDashboard;
