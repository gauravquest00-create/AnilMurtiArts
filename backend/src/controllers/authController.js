const User = require('../models/User');
const { sendResponse, sendError } = require('../utils/apiResponse');

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide both email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password');
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = user.getSignedJwtToken();

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      lastLogin: user.lastLogin
    };

    return sendResponse(res, 200, 'Login successful', {
      user: userData,
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return sendResponse(res, 200, 'User profile fetched', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile details
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (phone) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role
    };

    return sendResponse(res, 200, 'Profile updated successfully', userData);
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 400, 'Please provide current and new password');
    }

    if (newPassword.length < 6) {
      return sendError(res, 400, 'New password must be at least 6 characters');
    }

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 400, 'Current password does not match');
    }

    user.password = newPassword;
    await user.save();

    const token = user.getSignedJwtToken();
    return sendResponse(res, 200, 'Password changed successfully', { token });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout (Client token invalidation acknowledgement)
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  return sendResponse(res, 200, 'Logged out successfully');
};

module.exports = {
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
};
