# Letter To Future - Backend API

This project is a backend API for the **Letter To Future** application, built using **Node.js**, **Express**, and deployed on **Render**.

이 프로젝트는 **Letter To Future**를 위한 백엔드 API이며, **Node.js**, **Express**를 사용하여 만들어졌고 **Render**를 통해 배포되었습니다.

## Features

### 1. **User Management**
- **Sign Up**
  - **POST** `/api/users/signup`
  - Allows new users to register with a unique ID and password.
  - 아이디(중복 금지), 비밀번호, 이메일을 입력하고 회원가입한다.

- **ID Check**
  - **POST** `/api/users/signup/idCheck`
  - Checks if a user ID is available for registration.
  - 아이디 중복 확인

- **Login**
  - **POST** `/api/users/login`
  - Authenticates users and provides a JWT token upon successful login.

- **Logout**
  - **POST** `/api/users/logout`
  - Invalidates the JWT token and logs the user out.

### 2. **Main Screen**
- **Main**
  - **GET** `/api/main`
  - Shows a notification (`alarm`) if there are unread letters and the count of unread letters (`unread`).
  - 읽지 않은 편지가 있는 경우, 알람을 표시한다.

### 3. **Letters**
- **Write Letter**
  - **POST** `/api/letters/write`
  - Allows users to write a letter to another user or themselves. The letter is scheduled to be delivered on a specified date (`sendAt`).
  - 다른 유저의 아이디를 입력하고, 특정일을 선택하여 편지를 보낼 수 있다.

- **View Letters Archive**
  - **GET** `/api/letters/archive`
  - Retrieves a list of letters that the user has received, sorted by creation date in descending order.
  - 받은 편지 목록을 확인할 수 있다. (날짜 내림차순)

- **View Letter Details**
  - **GET** `/api/letters/archive/{letterNumber}`
  - Fetches detailed information about a specific letter. If the letter is unread, it marks the letter as read.

## Technology Stack
- **Node.js**: JavaScript runtime for backend development.
- **Express**: Web framework for building RESTful APIs.
- **Render**: Cloud platform for deploying the application.
- **MongoDB Atlas**: Database for storing user and letter information.
- **JWT**: Token-based authentication.

## API Endpoints

### User Management
| Endpoint               | Method | Description                     |
|------------------------|--------|---------------------------------|
| `/api/users/signup`    | POST   | Register a new user.            |
| `/api/users/signup/idCheck` | POST   | Check ID availability.          |
| `/api/users/login`     | POST   | Login and retrieve JWT token.   |
| `/api/users/logout`    | POST   | Logout and invalidate JWT token.|

### Main Screen
| Endpoint    | Method | Description                           |
|-------------|--------|---------------------------------------|
| `/api/main` | GET    | Retrieve unread letters and alarm.   |

### Letters
| Endpoint                        | Method | Description                              |
|---------------------------------|--------|------------------------------------------|
| `/api/letters/write`            | POST   | Write and schedule a new letter.        |
| `/api/letters/archive`          | GET    | Retrieve a list of received letters.    |
| `/api/letters/archive/{letterNumber}` | GET    | View details of a specific letter.      |

## Author
Developed by codingleo1979.