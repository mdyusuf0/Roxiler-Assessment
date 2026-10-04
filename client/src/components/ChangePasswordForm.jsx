import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { changePassword } from '../services/authService';
import toast from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';

const ChangePasswordForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
        newErrors.newPassword = 'Password must be 8-16 characters';
      } else if (!/[A-Z]/.test(formData.newPassword)) {
        newErrors.newPassword = 'Must contain at least one uppercase letter';
      } else if (!/[^A-Za-z0-9]/.test(formData.newPassword)) {
        newErrors.newPassword = 'Must contain at least one special character';
      }
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success('Password updated successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password';
      toast.error(msg);
      setErrors((prev) => ({ ...prev, currentPassword: msg }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input
        label="Current Password"
        type={showCurrent ? 'text' : 'password'}
        icon={FiLock}
        showPasswordToggle
        isPasswordVisible={showCurrent}
        onPasswordToggle={() => setShowCurrent(!showCurrent)}
        value={formData.currentPassword}
        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
        error={errors.currentPassword}
        placeholder="Enter your current password"
        required
      />

      <Input
        label="New Password"
        type={showNew ? 'text' : 'password'}
        icon={FiLock}
        showPasswordToggle
        isPasswordVisible={showNew}
        onPasswordToggle={() => setShowNew(!showNew)}
        value={formData.newPassword}
        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
        error={errors.newPassword}
        helperText="8-16 chars, 1 uppercase, 1 special char"
        placeholder="Enter your new password"
        required
      />

      <Input
        label="Confirm New Password"
        type="password"
        icon={FiLock}
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        error={errors.confirmPassword}
        placeholder="Re-enter your new password"
        required
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Update Password
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
