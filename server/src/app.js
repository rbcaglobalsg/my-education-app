// server/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { PORT } = require('./config/config');

const authRouter = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', authRouter);

// 여기서 app.listen() 제거
// app.listen(PORT, () => {
//   console.log(`Backend server running on port ${PORT}`);
// });

module.exports = app; // app만 export
