// server/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { PORT } = require('./config/config');

const authRouter = require('./routes/auth');
const paymentRouter = require('./routes/payment');
const availabilityRouter = require('./routes/availability'); // 추가한 부분

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', authRouter);
app.use('/api/payment', paymentRouter);
app.use('/api', availabilityRouter); // availability 라우터 등록

module.exports = app;
