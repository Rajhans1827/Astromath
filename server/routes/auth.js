import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  getUserByEmail,
  createUser,
  verifyUser,
  saveOTP,
  getLatestOTP,
  deleteOTP
} from '../db.js';
import { generateOTP, sendOtpEmail } from '../mail.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'astromath_cosmic_secret_key_2026';

// Helper: Generate JWT Token
const createToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// 1. User Signup (Requires Email OTP verification)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: 'All fields (Name, Email, Mobile, Password) are required' });
    }

    const existingUser = getUserByEmail(email.toLowerCase().trim());
    if (existingUser && existingUser.is_verified) {
      return res.status(400).json({ message: 'An account with this email already exists. Please log in.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (!existingUser) {
      createUser(name.trim(), email.toLowerCase().trim(), mobile.trim(), passwordHash);
    }

    // Generate 6-digit OTP (Valid for 10 minutes)
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    saveOTP(email.toLowerCase().trim(), otpCode, expiresAt);

    // Send OTP via Nodemailer
    await sendOtpEmail(email.toLowerCase().trim(), otpCode, name);

    return res.status(200).json({
      message: 'OTP sent to your email successfully. Please verify to activate your account.',
      email: email.toLowerCase().trim(),
    });
  } catch (err) {
    console.error('Signup Error:', err);
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
});

// 2. Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const record = getLatestOTP(email.toLowerCase().trim());
    if (!record) {
      return res.status(400).json({ message: 'No active OTP found. Please request a new code.' });
    }

    // Check expiration
    if (new Date() > new Date(record.expires_at)) {
      deleteOTP(email.toLowerCase().trim());
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check code
    if (record.otp_code !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP code. Please check and try again.' });
    }

    // Mark user verified
    verifyUser(email.toLowerCase().trim());
    deleteOTP(email.toLowerCase().trim());

    const user = getUserByEmail(email.toLowerCase().trim());
    const token = createToken(user);

    return res.status(200).json({
      message: 'Account verified successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    return res.status(500).json({ message: 'Internal server error during OTP verification' });
  }
});

// 3. Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = getUserByEmail(email.toLowerCase().trim());
    const name = user ? user.name : 'Cosmic Traveler';

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    saveOTP(email.toLowerCase().trim(), otpCode, expiresAt);

    await sendOtpEmail(email.toLowerCase().trim(), otpCode, name);

    return res.status(200).json({ message: 'New OTP sent to your email.' });
  } catch (err) {
    console.error('Resend OTP Error:', err);
    return res.status(500).json({ message: 'Failed to resend OTP' });
  }
});

// 4. User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Require OTP verification before allowing login
    if (!user.is_verified) {
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      saveOTP(user.email, otpCode, expiresAt);
      await sendOtpEmail(user.email, otpCode, user.name);

      return res.status(403).json({
        needsVerification: true,
        message: 'Account not verified. A new verification OTP has been sent to your email.',
        email: user.email,
      });
    }

    const token = createToken(user);
    return res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
});

export default router;
