import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { getAdminDashboard } from '../../services/adminService';
import { FiUsers, FiShoppingBag, FiStar, FiArrowRight, FiPlusCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    total_users: 0,
    total_stores: 0,
    total_ratings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await getAdminDashboard();
        setCounts(response.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard metrics', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: counts.total_users,
      icon: FiUsers,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)',
      link: '/admin/users',
      linkText: 'Manage Users',
    },
    {
      title: 'Total Stores',
      value: counts.total_stores,
      icon: FiShoppingBag,
      color: '#ff6b35',
      gradient: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 107, 53, 0.05) 100%)',
      link: '/admin/stores',
      linkText: 'Manage Stores',
    },
    {
      title: 'Submitted Ratings',
      value: counts.total_ratings,
      icon: FiStar,
      color: '#facc15',
      gradient: 'linear-gradient(135deg, rgba(250, 204, 21, 0.2) 0%, rgba(250, 204, 21, 0.05) 100%)',
      link: '/admin/stores',
      linkText: 'View Store Ratings',
    },
  ];

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px 60px', width: '100%' }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            System Administrator Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px' }}>
            Platform metrics overview, store directories, and role management.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <GlassCard
                key={stat.title}
                hoverEffect
                style={{
                  background: stat.gradient,
                  border: `1px solid ${stat.color}33`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {stat.title}
                    </span>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      style={{ fontSize: '38px', fontWeight: 900, color: 'var(--text-primary)', margin: '12px 0 8px' }}
                    >
                      {isLoading ? '—' : stat.value}
                    </motion.div>
                  </div>

                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: `${stat.color}22`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                      border: `1px solid ${stat.color}44`,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                </div>

                <Link
                  to={stat.link}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: stat.color,
                    marginTop: '8px',
                  }}
                >
                  {stat.linkText} <FiArrowRight size={14} />
                </Link>
              </GlassCard>
            );
          })}
        </div>

        {/* Quick Action Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          <GlassCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                }}
              >
                <FiUsers size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  User Management
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Filter by role, search, add new admin/users, view store owner ratings.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <Link to="/admin/users">
                <Button variant="primary">
                  View All Users
                </Button>
              </Link>
            </div>
          </GlassCard>

          <GlassCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(255, 107, 53, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff6b35',
                }}
              >
                <FiShoppingBag size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Store Directory
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Register new stores, assign store owners, monitor average ratings.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <Link to="/admin/stores">
                <Button variant="primary" style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ea580c 100%)' }}>
                  View All Stores
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
