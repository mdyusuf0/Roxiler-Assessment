import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import RatingStars from '../../components/RatingStars';
import { getAdminStores, createStore, getAdminUsers } from '../../services/adminService';
import { FiSearch, FiPlusCircle, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Add Store Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storeOwners, setStoreOwners] = useState([]);

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAdminStores({
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

  // Load store owners for assignment in Add Store modal
  useEffect(() => {
    if (isAddModalOpen) {
      getAdminUsers({ role: 'store_owner', limit: 100 })
        .then((res) => setStoreOwners(res.data.data.users))
        .catch(() => {});
    }
  }, [isAddModalOpen]);

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
  };

  const validateNewStore = () => {
    const errors = {};
    if (!newStore.name || newStore.name.trim().length < 20 || newStore.name.trim().length > 60) {
      errors.name = 'Store name must be 20 to 60 characters';
    }
    if (!newStore.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStore.email)) {
      errors.email = 'Valid store email is required';
    }
    if (!newStore.address || newStore.address.length > 400) {
      errors.address = 'Store address is required (max 400 characters)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    if (!validateNewStore()) return;

    setIsSubmitting(true);
    try {
      await createStore({
        name: newStore.name,
        email: newStore.email,
        address: newStore.address,
        ownerId: newStore.ownerId ? parseInt(newStore.ownerId, 10) : null,
      });
      toast.success('Store registered successfully!');
      setIsAddModalOpen(false);
      setNewStore({ name: '', email: '', address: '', ownerId: '' });
      fetchStores();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create store';
      toast.error(msg);
      setFormErrors((prev) => ({ ...prev, email: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Store Name',
      sortable: true,
      render: (val) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(255, 107, 53, 0.15)',
              color: '#ff6b35',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FiShoppingBag size={16} />
          </div>
          <strong>{val}</strong>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (val) => <span style={{ color: 'var(--text-secondary)' }}>{val}</span>,
    },
    {
      key: 'address',
      label: 'Address',
      sortable: true,
      render: (val) => (
        <span style={{ maxWidth: '280px', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'average_rating',
      label: 'Rating',
      sortable: true,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RatingStars rating={parseFloat(val || 0)} size={16} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            ({row.total_ratings || 0})
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px 60px', width: '100%' }}>
        {/* Header & Action */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Stores Directory
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Review registered stores, ratings, and owners.
            </p>
          </div>

          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <FiPlusCircle size={16} /> Add New Store
          </Button>
        </div>

        {/* Filter Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            marginBottom: '24px',
          }}
        >
          <Input
            placeholder="Search stores by name, email, or address..."
            icon={FiSearch}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Stores Table */}
        <Table
          columns={columns}
          data={stores}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          emptyMessage="No stores found matching your query."
          pagination={pagination}
          onPageChange={(newPage) => setPagination((p) => ({ ...p, page: newPage }))}
        />
      </main>

      {/* Add Store Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Store">
        <form onSubmit={handleCreateStore} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input
            label="Store Name"
            placeholder="20 to 60 characters"
            value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
            error={formErrors.name}
            helperText={`${newStore.name.length}/60`}
            required
          />

          <Input
            label="Store Contact Email"
            type="email"
            placeholder="store@example.com"
            value={newStore.email}
            onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
            error={formErrors.email}
            required
          />

          <Input
            label="Store Address"
            as="textarea"
            rows={2}
            placeholder="Physical store address (max 400 chars)"
            value={newStore.address}
            onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
            error={formErrors.address}
            helperText={`${newStore.address.length}/400`}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Assign Store Owner (Optional)
            </label>
            <select
              value={newStore.ownerId}
              onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
              style={{
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                fontSize: '14px',
                outline: 'none',
              }}
            >
              <option value="">No owner assigned</option>
              {storeOwners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Register Store
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AdminStores;
