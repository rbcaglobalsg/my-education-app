// server/src/routes/schedule.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { base } = require('../services/airtableService');

// 기존 POST /api/schedule는 이미 구현되어 있다고 가정

// GET /api/schedule
// 현재 사용자의 예약 목록 조회
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // 토큰에서 추출한 현재 사용자 ID
    const formula = `OR({UserId} = '${userId}', {PartnerId} = '${userId}')`;

    const records = await base('Sessions')
      .select({ filterByFormula: formula })
      .firstPage();

    const sessions = records.map(r => ({
      id: r.id,
      userId: r.get('UserId'),
      partnerId: r.get('PartnerId'),
      date: r.get('Date'),
      time: r.get('Time'),
      status: r.get('Status')
    }));

    return res.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
