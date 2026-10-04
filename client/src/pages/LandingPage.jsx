import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import RatingStars from '../components/RatingStars';
import {
  FiArrowRight,
  FiStar,
  FiShoppingBag,
  FiUsers,
  FiShield,
  FiSearch,
  FiTrendingUp,
  FiCheckCircle,
  FiSmile,
  FiAward,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [playgroundRating, setPlaygroundRating] = useState(5);

  const getPlaygroundMessage = (r) => {
    switch (r) {
      case 1:
        return 'Needs serious improvement. Honest feedback helps businesses learn!';
      case 2:
        return 'Below expectations. Let the store know what can be better.';
      case 3:
        return 'Average experience. Decent service with room for growth.';
      case 4:
        return 'Very good! Great service and pleasant customer care.';
      case 5:
      default:
        return '⭐ Exceptional! Outstanding customer service and quality.';
    }
  };

  const stats = [
    { number: '1,250+', label: 'Registered Stores', icon: FiShoppingBag, color: '#ff6b35' },
    { number: '85,000+', label: 'Verified Ratings', icon: FiStar, color: '#facc15' },
    { number: '4.85 / 5', label: 'Average Trust Score', icon: FiAward, color: '#6366f1' },
    { number: '100%', label: 'Anti-Spam Guarantee', icon: FiShield, color: '#10b981' },
  ];

  const featuredStores = [
    {
      name: 'TechMart Electronics Store',
      category: 'Consumer Electronics & Gadgets',
      address: '742 Evergreen Terrace, Sector 4, Silicon Hub',
      rating: 4.8,
      reviews: 342,
      badge: 'Top Rated Tech',
    },
    {
      name: 'Fresh Grocers Supermarket',
      category: 'Organic Produce & Daily Essentials',
      address: '120 Market Street, Green Valley Shopping Center',
      rating: 4.6,
      reviews: 518,
      badge: 'Community Choice',
    },
    {
      name: 'Artisan Roast Coffee & Bakery',
      category: 'Specialty Coffee & Baked Goods',
      address: '88 Baker Avenue, Old Town Heritage Quarter',
      rating: 4.9,
      reviews: 890,
      badge: 'Staff Pick',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Jenkins',
      role: 'Regular Shopper',
      quote:
        'StoreRate eliminated the fake review noise. Knowing that each user can only rate a store once gives me real confidence when choosing where to shop locally.',
      avatar: 'SJ',
      rating: 5,
    },
    {
      name: 'Marcus Vance',
      role: 'Store Owner, TechMart',
      quote:
        'As a retailer, the store owner dashboard gave me instant visibility into customer ratings without having to sift through anonymous trolls. Pure gold.',
      avatar: 'MV',
      rating: 5,
    },
    {
      name: 'Elena Rostova',
      role: 'Community Reviewer',
      quote:
        'The interactive mascots on the login screen made me smile, and being able to modify my rating whenever a store improves is a game-changer.',
      avatar: 'ER',
      rating: 5,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── 1. GLASS HEADER NAVIGATION ── */}
      <header
        className="glass-panel"
        style={{
          position: 'sticky',
          top: '16px',
          zIndex: 100,
          margin: '16px 24px',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Logo size="md" />

        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a href="#features" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Features
          </a>
          <a href="#how-it-works" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            How It Works
          </a>
          <a href="#featured" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Top Stores
          </a>
          <a href="#testimonials" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Reviews
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/login">
            <Button variant="secondary" size="sm">
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm">
              Get Started <FiArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </header>

      {/* ── 2. HERO SECTION ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 80px', width: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: 'var(--primary)',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
            }}
          >
            <FiStar size={14} /> The #1 Verified Store Rating Platform
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(36px, 5.5vw, 62px)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '22px',
            }}
          >
            Transparent Ratings.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6726fe 0%, #ff6b35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Authentic Feedback.
            </span>{' '}
            Empowered Stores.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '680px',
              margin: '0 auto 36px',
            }}
          >
            Discover top-rated local retailers, read genuine 1-to-5 star evaluations, and share your honest shopping experience with a single-rating anti-spam guarantee.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/signup">
              <Button variant="primary" size="lg" style={{ borderRadius: 'var(--radius-full)' }}>
                Start Rating Stores Free <FiArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/user">
              <Button variant="secondary" size="lg" style={{ borderRadius: 'var(--radius-full)' }}>
                <FiSearch size={16} /> Explore Directory
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero Interactive Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ marginTop: '56px', position: 'relative' }}
        >
          <GlassCard
            style={{
              maxWidth: '880px',
              margin: '0 auto',
              padding: '36px 44px',
              borderRadius: '32px',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.95)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Live Store Evaluation Preview
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  Artisan Roast Coffee & Bakery
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  88 Baker Avenue, Old Town Heritage Quarter
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>
                    4.9
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>890 verified ratings</span>
                </div>
                <RatingStars rating={5} size={24} showValue={false} />
              </div>
            </div>

            <div
              style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiCheckCircle color="#10b981" /> Verified Single-Rating PostgreSQL Constraint
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiSmile color="#ff6b35" /> Interactive Empathy Mascots on Login
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiTrendingUp color="#6366f1" /> Instant Store Owner Dashboard Metrics
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* ── 3. METRICS STATS STRIP ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px', padding: '0 24px', width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <GlassCard
                key={s.label}
                hoverEffect
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: s.color,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={26} />
                </div>
                <div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                    {s.number}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>
                    {s.label}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* ── 4. INTERACTIVE RATING PLAYGROUND ── */}
      <section
        id="playground"
        style={{
          maxWidth: '1200px',
          margin: '0 auto 90px',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <GlassCard
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 244, 248, 0.9) 100%)',
            padding: '48px 40px',
            textAlign: 'center',
            borderRadius: '32px',
            border: '1px solid rgba(255, 255, 255, 0.95)',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Interactive Demo
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 12px' }}>
            Experience Live Star Rating
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '540px', margin: '0 auto 28px' }}>
            Hover and click any star below to test the instant interactive rating response:
          </p>

          <div
            style={{
              display: 'inline-block',
              padding: '16px 28px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              marginBottom: '20px',
            }}
          >
            <RatingStars
              rating={playgroundRating}
              isInteractive
              size={42}
              showValue={false}
              onChange={(newRating) => setPlaygroundRating(newRating)}
            />
          </div>

          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', minHeight: '26px' }}>
            {getPlaygroundMessage(playgroundRating)}
          </div>
        </GlassCard>
      </section>

      {/* ── 5. HOW IT WORKS ── */}
      <section
        id="how-it-works"
        style={{
          maxWidth: '1200px',
          margin: '0 auto 100px',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Seamless Workflow
          </span>
          <h2 style={{ fontSize: '34px', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 12px' }}>
            How StoreRate Operates
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
            Three simple steps designed to build genuine consumer transparency.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          <GlassCard hoverEffect style={{ padding: '36px 30px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 800,
                marginBottom: '20px',
              }}
            >
              01
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Search & Browse
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Browse verified retail stores with instant filtering by name and physical address. Review aggregate scores and customer counts.
            </p>
          </GlassCard>

          <GlassCard hoverEffect style={{ padding: '36px 30px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255, 107, 53, 0.15)',
                color: '#ff6b35',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 800,
                marginBottom: '20px',
              }}
            >
              02
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Submit Or Modify Rating
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Rate anywhere from 1 to 5 stars. If your experience changes after repeat visits, modify your existing rating anytime via seamless upserts.
            </p>
          </GlassCard>

          <GlassCard hoverEffect style={{ padding: '36px 30px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#facc15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 800,
                marginBottom: '20px',
              }}
            >
              03
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Store Owner Transparency
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Store owners access live analytics on their average rating and inspect sortable rater feedback to continuously elevate service quality.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* ── 6. FEATURED STORES SPOTLIGHT ── */}
      <section
        id="featured"
        style={{
          maxWidth: '1200px',
          margin: '0 auto 100px',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Featured Directory
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Top Rated Community Stores
            </h2>
          </div>
          <Link to="/user">
            <Button variant="ghost" size="sm">
              View All Stores <FiArrowRight size={14} />
            </Button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {featuredStores.map((store) => (
            <GlassCard key={store.name} hoverEffect style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--primary)',
                    display: 'inline-block',
                    marginBottom: '12px',
                  }}
                >
                  {store.badge}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {store.name}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {store.category}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  📍 {store.address}
                </div>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <RatingStars rating={store.rating} size={17} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {store.reviews} reviews
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ── */}
      <section
        id="testimonials"
        style={{
          maxWidth: '1200px',
          margin: '0 auto 100px',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Trusted By The Community
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 12px' }}>
            What Shoppers & Retailers Say
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {testimonials.map((t) => (
            <GlassCard key={t.name} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '30px' }}>
              <div>
                <RatingStars rating={t.rating} size={15} showValue={false} />
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, marginTop: '16px', fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6726fe 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.role}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── 8. CALL TO ACTION BANNER ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 90px', padding: '0 24px', width: '100%' }}>
        <GlassCard
          style={{
            background: 'linear-gradient(135deg, rgba(103, 38, 254, 0.12) 0%, rgba(255, 107, 53, 0.12) 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '32px',
            padding: '60px 40px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Ready to Discover & Rate Your Favorite Stores?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Join thousands of shoppers making local retail better every day with honest feedback.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup">
              <Button variant="primary" size="lg" style={{ borderRadius: 'var(--radius-full)' }}>
                Create Free Account <FiArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" style={{ borderRadius: 'var(--radius-full)' }}>
                Sign In to Your Dashboard
              </Button>
            </Link>
          </div>
        </GlassCard>
      </section>

      {/* ── 9. FOOTER ── */}
      <Footer />
    </div>
  );
};

export default LandingPage;
