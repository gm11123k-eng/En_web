# AI 영어 학습 웹 서비스

캡스톤 프로젝트 - AI를 활용한 영어 학습 서비스

## 기술 스택

- **Backend**: Spring Boot 3.5, Java 17, JPA
- **Frontend**: React 18, Vite, axios, react-router-dom
- **Database**: MySQL 8.0 (Docker)

## 프로젝트 구조

```
En_web/
├── docker-compose.yml    # MySQL 컨테이너 설정
├── init.sql              # DB 초기화
├── backend/              # Spring Boot 서버
└── frontend/             # React 앱
```

## 실행 방법

### 사전 준비
- Java 17
- Node.js 20+
- Docker, Docker Compose

### 1. MySQL 실행 (Docker)

```bash
docker compose up -d
```

MySQL이 3306 포트에서 실행됩니다. root 비밀번호는 `1111`, DB는 `englearn` 입니다.

### 2. 백엔드 실행

```bash
cd backend
./gradlew bootRun
```

8080 포트에서 실행됩니다. 최초 실행 시 JPA가 `member` 테이블을 자동 생성합니다.

### 3. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

5173 포트에서 실행됩니다. 브라우저에서 http://localhost:5173 접속.

## API

| Method | Path | 설명 |
|--------|------|------|
| GET | /api/auth/check-email | 이메일 중복 확인 |
| POST | /api/auth/signup | 회원가입 |
| POST | /api/auth/login | 로그인 |
| GET | /api/members/me | 내 정보 조회 |

## 주차별 진행

- **1주차** (현재): 프로젝트 세팅, 회원가입/로그인
- 2주차: AI 단어/문장 생성, 발음 재생
- 3주차: AI 대화 (문법 교정)
- 4주차: 상황별 롤플레이
- 5주차: 퀴즈, 오답노트, 복습 시스템
- 6주차: 포인트/레벨, 학습 통계
