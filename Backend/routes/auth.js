import express from 'express';
import User from '../models/user.model.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetchuser from '../middleware/fetchuser.js';

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || 'supersecret_icodesave_jwt_token_2026';

// ROUTE 1: Create a user using POST "/api/auth/createUser". No login required
router.post(
  '/createUser',
  [
    body('name', 'Name must be at least 2 characters.').trim().isLength({ min: 2 }),
    body('email', 'Enter a valid email address.').trim().isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters.').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((e) => e.msg).join(', ');
      return res.status(400).json({ success: false, error: errorMsg, errors: errors.array() });
    }

    try {
      const email = req.body.email.toLowerCase().trim();
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'A user with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        name: req.body.name.trim(),
        email,
        password: hashedPassword,
        role: req.body.role ? req.body.role.trim() : 'Developer',
        bio: req.body.bio ? req.body.bio.trim() : 'Passionate about coding!',
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, getJwtSecret(), { expiresIn: '30d' });

      return res.status(201).json({
        success: true,
        authToken,
        authtoken: authToken, // backwards compatibility
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error('Error in /createUser:', error.message);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

// ROUTE 2: Authenticate a user using POST "/api/auth/login". No login required
router.post(
  '/login',
  [
    body('email', 'Enter a valid email address.').trim().isEmail().normalizeEmail(),
    body('password', 'Password cannot be blank.').exists().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((e) => e.msg).join(', ');
      return res.status(400).json({ success: false, error: errorMsg, errors: errors.array() });
    }

    const { password } = req.body;
    const email = req.body.email.toLowerCase().trim();

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, error: 'Invalid email or password' });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ success: false, error: 'Invalid email or password' });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, getJwtSecret(), { expiresIn: '30d' });

      return res.json({
        success: true,
        authToken,
        authtoken: authToken, // backwards compatibility
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error('Error in /login:', error.message);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

// ROUTE 3: Get logged-in user details using GET "/api/auth/getuser". Login required
router.get('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    // Return user with success wrapper and legacy fields
    return res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
      user,
    });
  } catch (error) {
    console.error('Error in /getuser:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ROUTE 4: Update logged-in user profile using PUT "/api/auth/updateuser". Login required
router.put('/updateuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, role, bio, avatar } = req.body;

    const updatedFields = {};
    if (name !== undefined) updatedFields.name = name.trim();
    if (role !== undefined) updatedFields.role = role.trim();
    if (bio !== undefined) updatedFields.bio = bio.trim();
    if (avatar !== undefined) updatedFields.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error in /updateuser:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;
