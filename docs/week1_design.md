# 1주차 설계

## 목표
- 회원가입 / 로그인
- 메인 페이지 + 주차별 UI

## 스택
- 백엔드: Spring Boot 3.5, Java 17, JPA
- DB: MySQL 8.0 (Docker)
- 프론트: React 18, Vite, axios, react-router-dom

## 구조
```
En_web/
├── docker-compose.yml
├── init.sql
├── backend/   # Spring Boot
└── frontend/  # React
```

## 환경
- MySQL: root / 1111, DB englearn
- JPA ddl-auto=update (테이블 자동 생성)
- 백엔드 8080, 프론트 5173

## member 테이블
| 컬럼 | 타입 |
|---|---|
| id | BIGINT PK AUTO_INCREMENT |
| email | VARCHAR(100) UNIQUE |
| password | VARCHAR(255) |
| nickname | VARCHAR(50) |
| level | INT (기본 1) |
| total_points | INT (기본 0) |
| streak_days | INT (기본 0) |
| last_study_date | DATE |
| created_at | DATETIME |

## API
| Method | Path | 용도 |
|---|---|---|
| GET | /api/auth/check-email | 이메일 중복 확인 |
| POST | /api/auth/signup | 회원가입 |
| POST | /api/auth/login | 로그인 |
| GET | /api/members/me | 내 정보 |

## 유효성 검사
- 이메일: 형식 + 비어있지 않음
- 비밀번호: 4~50자
- 닉네임: 2~20자

## 인증
- memberId 기반 (localStorage 저장)
- @CrossOrigin(*) 로 CORS 허용
- 학습용이라 평문 저장

## 페이지
- /login
- /signup
- / (메인)
- /profile
- /word, /sentence, /chat, /roleplay, /quiz, /stats
- * (404)

## 실행
```
docker compose up -d
cd backend && ./gradlew bootRun
cd frontend && npm install && npm run dev
```
