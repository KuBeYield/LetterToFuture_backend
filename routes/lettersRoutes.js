// routes/lettersRoutes.js

const express = require('express');
const router = express.Router();
const lettersController = require('../controllers/lettersController');

// 메인 화면 라우트
router.get('/main', lettersController.getMainData);

// 편지 작성하기
router.post('/letters/write', lettersController.writeLetter);

// 편지 목록 조회하기
router.get('/letters/archive', lettersController.getArchive);

// 편지 상세 조회하기
router.get('/letters/archive/:letterNumber', lettersController.getLetterDetails);

module.exports = router;