// controllers/usersController.js

const User = require('../models/users');
const jwt = require('jsonwebtoken');

// 회원가입
exports.signup = async (req, res) => {
    const { userId, password, userEmail } = req.body;

    // 입력값 검증
    if (!userId || !password || !userEmail) {
        return res.status(400).json({ message: "잘못된 요청입니다." });
    }

    try {
        // 아이디 중복 체크
        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
        }

        // 새 사용자 생성
        const newUser = new User({
            userId,
            userEmail,
            password, // 비밀번호 해싱 제거
        });

        await newUser.save();
        res.status(201).json({ message: "회원가입이 성공적으로 완료되었습니다." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// 아이디 중복 확인
exports.idCheck = async (req, res) => {
    const { userId } = req.body;

    // 입력값 검증
    if (!userId) {
        return res.status(400).json({ message: "잘못된 요청입니다." });
    }

    try {
        // 아이디 중복 체크
        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
        }

        res.status(200).json({ message: "사용가능한 아이디입니다." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// 로그인
exports.login = async (req, res) => {
    const { userId, password } = req.body;

    // 입력값 검증
    if (!userId || !password) {
        return res.status(400).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }

    try {
        // 사용자 확인
        const user = await User.findOne({ userId });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
        }

        // JWT 생성
        const accessToken = jwt.sign(
            { userNumber: user.userNumber, userId: user.userId },
            process.env.JWT_SECRET || "default_secret", // 환경 변수로 관리
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            accessToken, 
            message: "로그인 성공" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// 로그아웃
exports.logout = async (req, res) => {
    const authHeader = req.headers['authorization'];

    // Authorization 헤더 검증
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 토큰 검증
        jwt.verify(token, process.env.JWT_SECRET || "default_secret");

        // 로그아웃 처리 (예: 클라이언트 측에서 토큰을 삭제하거나 블랙리스트로 관리)
        // 여기서는 토큰 무효화 처리 생략 (단순 성공 응답)
        res.status(200).json({ message: "로그아웃 성공" });
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
        }
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};