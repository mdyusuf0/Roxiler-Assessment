import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import Table from '../../components/Table';
import RatingStars from '../../components/RatingStars';
import { getOwnerDashboard, getOwnerRatings } from '../../services/storeOwnerService';
import { FiShoppingBag, FiStar, FiUsers, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [isLoadingRatings, setIsLoadingRatings] = useState(true);

  // Sorting state for raters table
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch store overview
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getOwnerDashboard();
        setStoreInfo(response.data.data.store);
      } catch (err) {
        toast.error('Failed to load store overview');
      } finally {
        setIsLoadingStore(false);
      }
    };
    fetchDashboard();
  }, []);

  // Fetch raters list
  const fetchRatings = useCallback(async () => {
    setIsLoadingRatings(true);
    try {
      const response = await getOwnerRatings({
        sortBy,
        sortOrder,
        page: pagination.page,
        limit: pagination.limit,
      });

      const { ratings: fetchedRatings, total, page, limit, totalPages } = response.data.data;
      setRatings(fetchedRatings);
      setPagination({ total, page, limit, totalPages });
    } catch (err) {
      toast.error('Failed to load store ratings');
    } finally {
      setIsLoadingRatings(false);
    }
  }, [sortBy, sortOrder, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('desc');
    }
  };

  const columns = [
    {
      key: 'user_name',
      label: 'Customer Name',
      sortable: true,
      render: (val) => <strong>{val}</strong>,
    },
    {
      key: 'user_email',
      label: 'Email',
      sortable: false,
      render: (val) => <span style={{ color: 'var(--text-secondary)' }}>{val}</span>,
    },
    {
      key: 'rating',
      label: 'Rating Submitted',
      sortable: true,
      render: (val) => <RatingStars rating={val} size={16} />,
    },
    {
      key: 'created_at',
      label: 'Submitted Date',
      sortable: true,
      render: (val) => (
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          {new Date(val).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px 60px', width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Store Owner Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px' }}>
            Monitor customer ratings and feedback for your store.
          </p>
        </div>

        {/* Store Overview Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {/* Store Name Card */}
          <GlassCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(255, 107, 53, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff6b35',
                }}
              >
                <FiShoppingBag size={24} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Store Name
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {isLoadingStore ? 'Loading...' : storeInfo?.name || '—'}
                </h3>
              </div>
            </div>
          </GlassCard>

          {/* Average Rating Card */}
          <GlassCard style={{ border: '1px solid rgba(250, 204, 21, 0.3)', background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.12) 0%, rgba(250, 204, 21, 0.02) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Average Store Rating
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0 4px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {isLoadingStore ? '—' : (storeInfo?.averageRating || 0).toFixed(1)}
                  </span>
                  <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/ 5.0</span>
                </div>
                <RatingStars rating={storeInfo?.averageRating || 0} size={18} showValue={false} />
              </div>

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'rgba(250, 204, 21, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#facc15',
                }}
              >
                <FiStar size={24} />
              </div>
            </div>
          </GlassCard>

          {/* Total Ratings Card */}
          <GlassCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Total Customer Reviews
                </span>
                <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 4px' }}>
                  {isLoadingStore ? '—' : storeInfo?.totalRatings || 0}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Users submitted ratings
                </span>
              </div>

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                }}
              >
                <FiUsers size={24} />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Section Title */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Users Who Rated Your Store
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            List of customers and their submitted ratings.
          </p>
        </div>

        {/* Raters Table */}
        <Table
          columns={columns}
          data={ratings}
          isLoading={isLoadingRatings}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          emptyMessage="No customer ratings submitted yet for your store."
          pagination={pagination}
          onPageChange={(newPage) => setPagination((p) => ({ ...p, page: newPage }))}
        />
      </main>
    </>
  );
};

export default OwnerDashboard;
