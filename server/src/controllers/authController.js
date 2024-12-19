// server/src/controllers/authController.js
const { registerUser, loginUser } = require('../services/authService');

exports.signupController = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newUser = await registerUser({ name, email, password, role });
    res.json({ message: 'User registered successfully!', recordId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save user' });
  }
};

exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const result = await loginUser({ email, password });
    if (!result) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ message: 'Login successful', token: result.token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
