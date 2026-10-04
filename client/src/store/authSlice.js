import { createSlice } from '@reduxjs/toolkit';

// Safely restore auth state from localStorage
let parsedUser = null;
try {
  const savedUser = localStorage.getItem('user');
  if (savedUser && savedUser !== 'undefined') {
    parsedUser = JSON.parse(savedUser);
  }
} catch (e) {
  localStorage.removeItem('user');
}

const savedToken = localStorage.getItem('accessToken');

const initialState = {
  user: parsedUser,
  accessToken: savedToken || null,
  isAuthenticated: !!(savedToken && parsedUser && parsedUser.role),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
