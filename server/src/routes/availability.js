// server/src/routes/availability.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Airtable = require('airtable');
const { SECRET_KEY } = require('../config/config');

// 인증 미들웨어
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// GET /api/availability
router.get('/availability', authenticate, async (req, res) => {
  const { dayOfWeek } = req.query;
  if (!dayOfWeek) return res.status(400).json({ error: 'Missing dayOfWeek' });

  try {
    const records = await base('TeacherAvailability').select({
      filterByFormula: `{DayOfWeek} = '${dayOfWeek}'`
    }).all();

    const teacherIds = records.map(r => r.get('TeacherId'));
    const uniqueTeacherIds = [...new Set(teacherIds)];

    const teachers = [];
    for (const tId of uniqueTeacherIds) {
      try {
        const userRec = await base('Users').find(tId);
        teachers.push({
          id: userRec.id,
          name: userRec.get('Name') || '',
          email: userRec.get('Email') || '',
          role: userRec.get('Role') || '',
          interests: userRec.get('Interests') || '',
          expertise: userRec.get('Expertise') || ''
        });
      } catch (e) {
        console.log('User not found:', tId);
      }
    }

    const slots = records.map(r => ({
      id: r.id,
      teacherId: r.get('TeacherId'),
      dayOfWeek: r.get('DayOfWeek'),
      time: r.get('Time'),
      duration: r.get('Duration'),
      price: r.get('Price'),
      status: r.get('Status')
    }));

    res.json({ slots, teachers });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
