require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Airtable = require('airtable');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

const SALT_ROUNDS = 10;

// Airtable 설정
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const SECRET_KEY = process.env.SECRET_KEY;

app.use(bodyParser.json());
app.use(cors());

// 루트 경로
app.get('/', (req, res) => {
    res.send('Welcome to my education app!');
});

// 회원가입
app.post('/api/signup', async (req, res) => {
    const { name, email, password, role, interests = [], expertise = [] } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Missing required fields (name, email, password, role)' });
    }
    if (role !== 'learn' && role !== 'teach') {
        return res.status(400).json({ error: 'Role must be either learn or teach' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const interestsStr = (interests || []).join(', ');
        const expertiseStr = (expertise || []).join(', ');

        const userData = {
            Name: name,
            Email: email,
            Password: hashedPassword,
            Role: role
        };

        if (role === 'learn') {
            userData.Interests = interestsStr;
        } else if (role === 'teach') {
            userData.Expertise = expertiseStr;
        }

        base('Users').create(userData, (err, record) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to save user' });
            }
            res.json({ message: 'User registered successfully!', recordId: record.getId() });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 로그인
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }

    base('Users')
        .select({ filterByFormula: `{Email} = '${email}'` })
        .firstPage(async (err, records) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Server error' });
            }

            if (records.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = records[0].fields;
            const match = await bcrypt.compare(password, user.Password);
            if (!match) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: records[0].id, email: user.Email, role: user.Role }, SECRET_KEY, {
                expiresIn: '1h',
            });
            res.json({ message: 'Login successful', token });
        });
});

// 사용자 정보 조회
app.get('/api/userinfo', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        base('Users').find(decoded.id, (err, record) => {
            if (err || !record) return res.status(404).json({ error: 'User not found' });

            const user = record.fields;
            res.json({
                name: user.Name || '',
                email: user.Email || '',
                role: user.Role || '',
                Interests: user.Interests || '',
                Expertise: user.Expertise || ''
            });
        });
    });
});

// 사용자 정보 업데이트
app.put('/api/userinfo', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const { name, interests, expertise } = req.body;

        base('Users').update(decoded.id, {
            Name: name,
            Interests: (interests || []).join(', '),
            Expertise: (expertise || []).join(', ')
        }, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update user info' });
            }
            res.json({ message: 'User info updated successfully!' });
        });
    });
});

// 검색
app.get('/api/search', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const { interests, expertise } = req.query;

        let formula = '';
        if (interests) {
            formula = `FIND('${interests.toLowerCase()}', LOWER({Interests})) > 0`;
        } else if (expertise) {
            formula = `FIND('${expertise.toLowerCase()}', LOWER({Expertise})) > 0`;
        } else {
            return res.status(400).json({ error: 'No search parameter provided' });
        }

        base('Users')
            .select({ filterByFormula: formula })
            .firstPage((err, records) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Server error' });
                }

                const results = records.map(r => {
                    const f = r.fields;
                    return {
                        id: r.id,
                        name: f.Name || '',
                        email: f.Email || '',
                        role: f.Role || '',
                        interests: f.Interests || '',
                        expertise: f.Expertise || ''
                    };
                });

                res.json({ results });
            });
    });
});

// 세션 예약
app.post('/api/schedule', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const { partnerId, date, time } = req.body;
        if (!partnerId || !date || !time) {
            return res.status(400).json({ error: 'Missing required fields (partnerId, date, time)' });
        }

        base('Sessions').create({
            UserId: decoded.id,
            PartnerId: partnerId,
            Date: date,
            Time: time,
            Status: 'Scheduled'
        }, (err, record) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to create session' });
            }
            res.json({ message: 'Session scheduled successfully!', sessionId: record.getId() });
        });
    });
});

app.get('/api/schedule', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const formula = `OR({UserId} = '${decoded.id}', {PartnerId} = '${decoded.id}')`;

        base('Sessions')
            .select({ filterByFormula: formula })
            .firstPage((err, records) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Server error' });
                }

                const results = records.map(r => {
                    const f = r.fields;
                    return {
                        id: r.id,
                        userId: f.UserId,
                        partnerId: f.PartnerId,
                        date: f.Date,
                        time: f.Time,
                        status: f.Status
                    };
                });

                res.json({ sessions: results });
            });
    });
});

// 강사 가용시간 관리
app.post('/api/teacher/availability', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const { dayOfWeek, time, duration, price } = req.body;
        if (!dayOfWeek || !time || !duration || !price) {
            return res.status(400).json({ error: 'Missing required fields (dayOfWeek, time, duration, price)' });
        }

        base('TeacherAvailability').create({
            TeacherId: decoded.id,
            DayOfWeek: dayOfWeek,
            Time: time,
            Duration: duration.toString(),
            Price: price.toString(),
            Status: 'Open'
        }, (err, record) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to add availability' });
            }
            res.json({ message: 'Availability added successfully!', slotId: record.getId() });
        });
    });
});

app.get('/api/teacher/availability', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const formula = `{TeacherId} = '${decoded.id}'`;
        base('TeacherAvailability')
            .select({ filterByFormula: formula })
            .firstPage((err, records) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Server error' });
                }

                const results = records.map(r => {
                    const f = r.fields;
                    return {
                        id: r.id,
                        dayOfWeek: f.DayOfWeek,
                        time: f.Time,
                        duration: f.Duration,
                        price: f.Price,
                        status: f.Status
                    };
                });

                res.json({ slots: results });
            });
    });
});

app.delete('/api/teacher/availability/:slotId', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const slotId = req.params.slotId;
        base('TeacherAvailability').find(slotId, (err, record) => {
            if (err || !record) {
                return res.status(404).json({ error: 'Slot not found' });
            }

            if (record.get('TeacherId') !== decoded.id) {
                return res.status(403).json({ error: 'Not your availability slot' });
            }

            base('TeacherAvailability').destroy(slotId, (err2) => {
                if (err2) {
                    console.error(err2);
                    return res.status(500).json({ error: 'Failed to delete slot' });
                }
                res.json({ message: 'Slot deleted successfully' });
            });
        });
    });
});

// 새로 추가하는 /api/availability GET 라우트
app.get('/api/availability', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, async (err) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const { dayOfWeek } = req.query;
        if (!dayOfWeek) return res.status(400).json({ error: 'Missing dayOfWeek' });

        try {
            const records = await base('TeacherAvailability').select({
                filterByFormula: `{DayOfWeek} = '${dayOfWeek}'`
            }).all();

            const slots = records.map(r => ({
                id: r.id,
                teacherId: r.get('TeacherId'),
                dayOfWeek: r.get('DayOfWeek'),
                time: r.get('Time'),
                duration: r.get('Duration'),
                price: r.get('Price'),
                status: r.get('Status')
            }));

            res.json({ slots });
        } catch (error) {
            console.error('Error fetching availability:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
