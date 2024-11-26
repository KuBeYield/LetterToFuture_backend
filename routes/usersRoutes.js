// routes/usersRoutes.js

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// 회원가입
router.post('/users/signup', usersController.signup);

// 아이디 중복 확인
router.post('/users/signup/idCheck', usersController.idCheck);

// 로그인
router.post('/users/login', usersController.login);

// 로그아웃
router.post('/users/logout', usersController.logout);

module.exports = router;