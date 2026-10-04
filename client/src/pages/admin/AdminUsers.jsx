import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import RatingStars from '../../components/RatingStars';
import { getAdminUsers, getAdminUserDetails, createUser } from '../../services/adminService';
import { FiSearch, FiUserPlus, FiInfo, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Add User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAdminUsers({
        search: search || undefined,
        role: roleFilter || undefined,
        sortBy,
        sortOrder,
        page: pagination.page,
        limit: pagination.limit,
      });

      const { users: fetchedUsers, total, page, limit, totalPages } = response.data.data;
      setUsers(fetchedUsers);
      setPagination({ total, page, limit, totalPages });
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [search, roleFilter, sortBy, sortOrder, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
  };

  const handleViewDetails = async (userId) => {
    setIsDetailModalOpen(true);
    setIsLoadingDetails(true);
    try {
      const response = await getAdminUserDetails(userId);
      setSelectedUser(response.data.data.user);
    } catch (err) {
      toast.error('Failed to fetch user details');
      setIsDetailModalOpen(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const validateNewUser = () => {
    const errors = {};
    if (!newUser.name || newUser.name.trim().length < 20 || newUser.name.trim().length > 60) {
      errors.name = 'Name must be 20 to 60 characters';
    }
    if (!newUser.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = 'Valid email is required';
    }
    if (!newUser.address || newUser.address.length > 400) {
      errors.address = 'Address is required (max 400 characters)';
    }
    if (!newUser.password) {
      errors.password = 'Password is required';
    } else if (newUser.password.length < 8 || newUser.password.length > 16) {
      errors.password = 'Password must be 8 to 16 characters';
    } else if (!/[A-Z]/.test(newUser.password)) {
      errors.password = 'Must contain at least one uppercase letter';
    } else if (!/[^A-Za-z0-9]/.test(newUser.password)) {
      errors.password = 'Must contain at least one special character';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!validateNewUser()) return;

    setIsSubmitting(true);
    try {
      await createUser(newUser);
      toast.success('User created successfully!');
      setIsAddModalOpen(false);
      setNewUser({ name: '', email: '', address: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create user';
      toast.error(msg);
      setFormErrors((prev) => ({ ...prev, email: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)', label: 'Admin' };
      case 'store_owner':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)', label: 'Store Owner' };
      default:
        return { bg: 'rgba(99, 102, 241, 0.15)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.3)', label: 'Normal User' };
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (val) => <strong>{val}</strong>,
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
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (role) => {
        const badge = roleBadgeStyle(role);
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 700,
              background: badge.bg,
              color: badge.text,
              border: `1px solid ${badge.border}`,
            }}
          >
            {badge.label}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Details',
      sortable: false,
      render: (_, row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleViewDetails(row.id)}
          title="View User Details"
        >
          <FiInfo size={14} /> View
        </Button>
      ),
    },
  ];

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px 60px', width: '100%' }}>
        {/* Header & Controls */}
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
              Users Management
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Browse, filter, and inspect registered users across all roles.
            </p>
          </div>

          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <FiUserPlus size={16} /> Add New User
          </Button>
        </div>

        {/* Filter Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ flex: '1 1 300px' }}>
            <Input
              placeholder="Search by name, email, or address..."
              icon={FiSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiFilter size={14} /> Role:
            </span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
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
              <option value="">All Roles</option>
              <option value="user">Normal User</option>
              <option value="admin">System Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <Table
          columns={columns}
          data={users}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          emptyMessage="No users matched your search criteria."
          pagination={pagination}
          onPageChange={(newPage) => setPagination((p) => ({ ...p, page: newPage }))}
        />
      </main>

      {/* Add User Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New User">
        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input
            label="Full Name"
            placeholder="20 to 60 characters"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            error={formErrors.name}
            helperText={`${newUser.name.length}/60`}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="user@example.com"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            error={formErrors.email}
            required
          />

          <Input
            label="Address"
            as="textarea"
            rows={2}
            placeholder="Street address (max 400 chars)"
            value={newUser.address}
            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
            error={formErrors.address}
            helperText={`${newUser.address.length}/400`}
            required
          />

          <Input
            label="Temporary Password"
            type="password"
            placeholder="8-16 chars, 1 uppercase, 1 special char"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            error={formErrors.password}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Assigned Role
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
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
              <option value="user">Normal User</option>
              <option value="admin">System Administrator</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* User Details Modal (Includes Store Rating if Store Owner) */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="User Account Details"
      >
        {isLoadingDetails || !selectedUser ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading user profile...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '22px',
                  fontWeight: 800,
                }}
              >
                {selectedUser.name?.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedUser.name}
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {selectedUser.email}
                </span>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '13px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Role</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                  {selectedUser.role?.replace('_', ' ')}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Registered On</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </span>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Address</span>
                <span style={{ color: 'var(--text-primary)' }}>{selectedUser.address}</span>
              </div>
            </div>

            {/* If the user is a Store Owner, show their store & store rating! */}
            {selectedUser.role === 'store_owner' && (
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Owned Store & Performance
                </span>

                {selectedUser.store_id ? (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {selectedUser.store_name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Store Rating:</span>
                      <RatingStars rating={parseFloat(selectedUser.store_rating || 0)} size={18} />
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    No store assigned yet to this owner.
                  </p>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminUsers;
