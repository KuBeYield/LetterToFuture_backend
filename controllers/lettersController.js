// controllers/lettersController.js

const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Letter = require('../models/letters');

// 메인 화면
exports.getMainData = async (req, res) => {
    const authHeader = req.headers['authorization'];

    // 인증 헤더 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "인증이 필요합니다." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 토큰 검증 및 사용자 정보 추출
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        const recipientNumber = decoded.userNumber;

        // 안 읽은 편지 개수 조회
        const unreadLettersCount = await Letter.countDocuments({
            recipientNumber,
            isReadable: true,
            isChecked: false,
        });

        // 응답 데이터 구성
        const response = {
            alarm: unreadLettersCount > 0,
            unread: unreadLettersCount,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "인증이 필요합니다." });
        }
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// 편지 작성하기
exports.writeLetter = async (req, res) => {
    const authHeader = req.headers['authorization'];

    // 인증 헤더 검증
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "인증이 필요합니다." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 토큰 검증 및 사용자 정보 추출
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        const senderNumber = decoded.userNumber;

        const { recipientId, title, content, sendAt } = req.body;

        // 입력값 검증
        if (!recipientId || !title || !content || !sendAt) {
            return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
        }

        // 수신자 확인
        const recipient = await User.findOne({ userId: recipientId });
        if (!recipient) {
            return res.status(404).json({ message: "수신자를 찾을 수 없습니다." });
        }

        // `sendAt`과 `createdAt`을 년-월-일 형식으로 변환
        const formattedSendAt = new Date(sendAt).toISOString().split('T')[0];
        const formattedCreatedAt = new Date().toISOString().split('T')[0];

        // 편지 생성
        const newLetter = new Letter({
            senderNumber,
            recipientNumber: recipient.userNumber,
            title,
            content,
            sendAt: formattedSendAt,
            createdAt: formattedCreatedAt
        });

        await newLetter.save();

        res.status(201).json({
            title: newLetter.title,
            content: newLetter.content,
            createdAt: newLetter.createdAt,
            sendAt: newLetter.sendAt
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "인증이 필요합니다." });
        }
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// 편지 목록 조회하기
exports.getArchive = async (req, res) => {
    const authHeader = req.headers['authorization'];

    // 인증 헤더 검증
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "인증이 필요합니다." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 토큰 검증 및 사용자 정보 추출
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        const recipientNumber = decoded.userNumber;

        // 수신자이고 isReadable이 true인 편지 조회
        const letters = await Letter.find({
            recipientNumber,
            isReadable: true
        }).sort({ createdAt: -1 });

        // 응답 데이터 가공
        const formattedLetters = await Promise.all(
            letters.map(async (letter) => {
                const sender = await User.findOne({ userNumber: letter.senderNumber });
                return {
                    letterNumber: letter.letterNumber,
                    senderId: sender ? sender.userId : "알 수 없음",
                    createdAt: letter.createdAt.toISOString().split('T')[0],
                    sendAt: letter.sendAt.toISOString().split('T')[0],
                    title: letter.title,
                    content: letter.content,
                    isChecked: letter.isChecked
                };
            })
        );

        res.status(200).json({ letters: formattedLetters });
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "인증이 필요합니다." });
        }
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// 편지 상세 조회하기
exports.getLetterDetails = async (req, res) => {
    const authHeader = req.headers['authorization'];

    // 인증 헤더 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "인증이 필요합니다." });
    }

    const token = authHeader.split(' ')[1];
    const { letterNumber } = req.params;

    try {
        // 토큰 검증 및 사용자 정보 추출
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        const recipientNumber = decoded.userNumber;

        // 편지 조회
        const letter = await Letter.findOne({
            letterNumber,
            recipientNumber,
            isReadable: true,
        });

        if (!letter) {
            return res.status(404).json({ message: "존재하지 않는 편지입니다." });
        }

        // 발신자 정보 조회
        const sender = await User.findOne({ userNumber: letter.senderNumber });

        // isChecked가 false라면 true로 업데이트
        if (!letter.isChecked) {
            letter.isChecked = true;
            await letter.save();
        }

        // 응답 데이터 가공
        const response = {
            letterNumber: letter.letterNumber,
            senderId: sender ? sender.userId : "알 수 없음",
            createdAt: letter.createdAt.toISOString().split('T')[0],
            sendAt: letter.sendAt.toISOString().split('T')[0],
            title: letter.title,
            content: letter.content,
            isChecked: letter.isChecked,
        };
        
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "인증이 필요합니다." });
        }
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};
