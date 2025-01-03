// server.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const usersRoutes = require('./routes/usersRoutes');
const lettersRoutes = require('./routes/lettersRoutes');

// 환경 변수 설정
require('dotenv').config();

const app = express();

// MongoDB 연결
connectDB();

// CORS 설정
app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json());

// 그룹 라우트 설정
app.use('/', usersRoutes);
app.use('/', lettersRoutes);

// 정적 파일 서빙 (프론트엔드와 함께 배포할 때 필요)
if (process.env.NODE_ENV === 'production') {
  // 예: React 앱을 배포할 때 'build' 폴더를 서빙
  app.use(express.static('public'));
}

// 기본 라우트 (서버가 잘 작동하는지 확인하는 용도)
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));