// server/src/services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const { findUserByEmail, createUser } = require('./airtableService');

async function registerUser({ name, email, password, role }) {
  const userRecord = await findUserByEmail(email);
  if (userRecord) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ Name: name, Email: email, Password: hashedPassword, Role: role });
  return newUser;
}

async function loginUser({ email, password }) {
  const userRecord = await findUserByEmail(email);
  if (!userRecord) return null;

  const user = userRecord.fields;
  const match = await bcrypt.compare(password, user.Password);
  if (!match) return null;

  const token = jwt.sign({ id: userRecord.id, email: user.Email, role: user.Role }, JWT_SECRET, { expiresIn: '1h' });
  return { token, user };
}

module.exports = { registerUser, loginUser };
