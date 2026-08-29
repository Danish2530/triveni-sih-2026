const jwt = require('jsonwebtoken');
const User = require('../models/User');
const University = require('../models/University');
const Industry = require('../models/Industry');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'triveni_sih_2026_super_secret_jwt_key_26043', {
    expiresIn: '30d'
  });
};

// @desc Register a new user
// @route POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, organization, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'citizen',
      organization: organization || '',
      phone: phone || ''
    });

    // Auto-create University or Industry profile if relevant role
    if (user.role === 'university') {
      await University.create({
        name: organization || name,
        location: 'Ranchi, Jharkhand',
        user: user._id,
        contactEmail: email,
        departments: ['Computer Science', 'Electronics & Communication', 'Civil Engineering'],
        expertise: ['IoT', 'Artificial Intelligence', 'Water Management', 'Smart Infrastructure'],
        researchAreas: ['Smart Cities', 'Environmental Systems', 'Renewable Energy']
      });
    } else if (user.role === 'industry') {
      await Industry.create({
        name: organization || name,
        industryType: 'Technology & Hardware Solutions',
        location: 'Ranchi, Jharkhand',
        user: user._id,
        contactEmail: email,
        contactPerson: name,
        expertise: ['IoT Hardware', 'Solar Technology', 'Cloud Computing', 'Mentorship']
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc Auth user & get token
// @route POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};
