# AI 영어 학습 웹 서비스 - 프로젝트 계획서

## 프로젝트 개요

이 프로젝트는 AI를 활용해서 영어를 공부할 수 있는 웹 서비스를 만드는 것이다. 단순히 단어장을 보여주는 수준이 아니라, AI가 직접 단어와 문장을 생성하고, 채팅으로 영어 대화 연습도 가능하게 한다. 사용자가 틀린 문법은 AI가 교정해주고, 오답은 따로 모아서 복습할 수 있다.

프로젝트 이름은 EngLearn이고, 8주에 걸쳐서 기능을 하나씩 추가해 나간다. 1주차에 기본 틀을 잡고, 매주 하나의 큰 기능을 완성하는 방식으로 진행한다. 프로젝트의 기본적인 코딩은 AI를 활용하여 진행하고, 보안 점검 및 취약점 분석 등은 개인이 직접 수행한다.

### 기술 스택

백엔드는 Spring Boot 3.5에 Java 17을 사용한다. 데이터베이스는 MySQL 8.0이고 Docker Compose로 띄워서 다른 사람이 clone 받아도 바로 실행할 수 있게 했다. 프론트엔드는 React 18과 Vite를 사용하고, API 통신은 axios, 라우팅은 react-router-dom을 쓴다. AI 기능은 OpenAI API를 연동하고, 발음 재생은 브라우저 내장 Web Speech API를 활용한다.

### 프로젝트 구조

```
En_web/
├── docker-compose.yml
├── init.sql
├── backend/    Spring Boot 서버
├── frontend/   React 앱
└── docs/       설계 문서
```

---

## 1주차: 프로젝트 세팅 및 회원 시스템 (완료)

1주차에서는 프로젝트의 뼈대를 잡았다. Docker Compose로 MySQL을 띄우고, Spring Boot 프로젝트를 생성해서 DB와 연결했다. 프론트엔드는 Vite로 React 프로젝트를 만들고 axios를 설정했다.

회원 시스템은 회원가입과 로그인을 구현했다. 이메일과 비밀번호, 닉네임을 받아서 가입하고, 로그인하면 memberId를 받아서 localStorage에 저장하는 방식이다. 이메일 중복 확인 버튼도 만들어서 가입 전에 미리 체크할 수 있다.

프론트엔드에서는 로그인 페이지, 회원가입 페이지, 메인 페이지를 만들었다. 비밀번호 표시/숨기기 토글, 회원가입 조건 안내도 추가했다. 로그인하지 않으면 메인 페이지에 접근할 수 없게 PrivateRoute 처리를 했다.

추가로 앞으로 만들 기능들의 페이지 레이아웃을 미리 잡아놨다. 단어, 문장, AI 대화, 롤플레이, 퀴즈, 통계 각각의 페이지를 가짜 데이터로 디자인해서 전체적인 UI 흐름을 확인할 수 있다. 내 정보 수정 페이지와 404 페이지도 만들었다.

### 추가된 테이블
- member: 회원 정보 (이메일, 비밀번호, 닉네임, 레벨, 포인트 등)

### 만든 API
- POST /api/auth/signup — 회원가입
- POST /api/auth/login — 로그인
- GET /api/auth/check-email — 이메일 중복 확인
- GET /api/members/me — 내 정보 조회

### 만든 페이지
- /login, /signup, /, /profile, /word, /sentence, /chat, /roleplay, /quiz, /stats, 404

---

## 2주차: 테마별 단어/문장 학습 + 발음 재생

2주차에서는 실제 학습 기능의 시작이다. OpenAI API를 백엔드에 연동하고, 사용자가 테마(토익, 여행, 논문 등)를 선택하면 AI가 해당 테마의 단어와 예문을 생성해준다. 문장 학습도 마찬가지로 기초, 문법, 고급 카테고리 중 선택하면 AI가 문장을 만들어준다.

생성된 단어와 문장은 DB에 저장되고, 한번 학습한 내용은 study_history 테이블에 기록해서 다음에 중복으로 나오지 않게 한다. 발음 재생은 브라우저의 Web Speech API를 사용해서 별도 라이브러리 없이 구현한다. 단어나 문장 옆에 🔊 버튼을 누르면 발음이 나온다.

1주차에 만들어놨던 WordPage와 SentencePage의 가짜 데이터를 실제 API 호출로 교체하는 작업이 중심이다.

### 추가될 테이블
- word: 단어 (테마, 영어, 한국어, 예문)
- sentence: 문장 (카테고리, 영어, 한국어)
- study_history: 학습 이력 (무슨 단어를 언제 공부했는지)

### 만들 API
- POST /api/words/generate — 테마 지정해서 AI에게 단어 생성 요청
- GET /api/words — 내가 공부한 단어 목록
- POST /api/sentences/generate — 카테고리 지정해서 문장 생성 요청
- GET /api/sentences — 내가 공부한 문장 목록
- POST /api/study-history — 학습 기록 저장
- GET /api/study-history — 학습 이력 조회

### 프론트 작업
- WordPage에서 테마 선택 후 단어 생성 버튼 → API 호출 → 결과 표시
- SentencePage에서 카테고리 선택 후 문장 생성
- 발음 버튼 클릭 시 Web Speech API로 읽기
- 학습 완료 처리

---

## 3주차: AI 대화 (자유 대화 + 문법 교정)

3주차에서는 AI와 자유롭게 영어 대화를 나누는 채팅 기능을 만든다. 사용자가 영어로 메시지를 보내면 AI가 영어로 대답하고, 사용자가 작성한 문장에 문법이나 표현 오류가 있으면 교정해서 같이 보여준다.

대화는 conversation 테이블에 저장되고, 각 메시지는 conversation_message 테이블에 순서대로 들어간다. 나중에 대화 목록에서 과거 대화를 다시 열어볼 수 있다.

AI의 응답은 답변 부분과 교정 부분을 분리해서 받는다. 프론트에서는 일반 답변은 회색 말풍선으로, 교정 내용은 주황색 말풍선으로 구분해서 보여준다. 1주차에서 ChatPage에 이미 이 UI를 디자인해 놓았기 때문에 API만 연결하면 된다.

### 추가될 테이블
- conversation: 대화 (회원별, 유형 구분)
- conversation_message: 대화 메시지 (역할, 내용, 교정)

### 만들 API
- POST /api/conversations — 새 대화 시작
- GET /api/conversations — 내 대화 목록
- GET /api/conversations/{id} — 특정 대화의 메시지 전체 조회
- POST /api/conversations/{id}/messages — 메시지 보내기 (AI 응답 포함)

### 프론트 작업
- ChatPage에 실제 API 연결
- 대화 목록 페이지 추가 (/chat에서 목록 → /chat/:id에서 대화)
- 메시지 전송 시 로딩 상태 표시
- 교정 메시지 주황색 말풍선으로 표시

---

## 4주차: 상황별 롤플레이

4주차에서는 특정 상황을 정해놓고 AI와 역할극으로 영어를 연습하는 기능을 만든다. 카페 주문, 공항 체크인, 면접, 호텔, 쇼핑, 길 묻기 같은 시나리오를 제공한다. 사용자가 시나리오를 선택하면 AI가 해당 상황의 역할(점원, 직원 등)로 먼저 말을 건다. 사용자가 답하면 대화가 이어지는 방식이다.

기술적으로는 3주차에서 만든 conversation 테이블을 재사용한다. type 컬럼으로 "free"(자유 대화)와 "roleplay"(롤플레이)를 구분하고, scenario 컬럼에 어떤 시나리오인지 저장한다. AI에게 보내는 시스템 프롬프트만 시나리오에 맞게 바꿔주면 된다.

이미 RoleplayPage에 시나리오 선택 카드와 대화 UI가 만들어져 있으므로, 백엔드 API 연동이 핵심이다.

### 테이블 변경
- conversation 테이블의 type, scenario 컬럼 활용 (새 테이블 없음)

### 만들 API
- GET /api/roleplay/scenarios — 시나리오 목록
- POST /api/roleplay/start — 시나리오 선택 후 롤플레이 시작 (AI 첫 메시지 생성)
- POST /api/roleplay/{id}/messages — 롤플레이 중 메시지 전송

### 프론트 작업
- RoleplayPage 시나리오 카드에서 API로 시작
- 대화 UI에 실제 AI 응답 표시
- 시나리오별 시스템 프롬프트 구성

---

## 5주차: 퀴즈 + 오답노트 + 에빙하우스 복습

5주차에서는 학습한 단어와 문장을 퀴즈로 테스트하는 기능을 만든다. 퀴즈 유형은 한글을 보고 영어를 맞추는 것과 영어를 보고 한글을 맞추는 것 두 가지가 있다. 문장의 경우 빈칸 채우기 형태로 출제한다. 이전에 학습한 단어/문장 중에서 무작위로 뽑아서 4지선다로 만든다.

틀린 문제는 wrong_answer 테이블에 저장되고, 오답노트 페이지에서 모아볼 수 있다. 에빙하우스 망각곡선을 적용해서 복습 시스템도 구현한다. 처음 배운 단어는 1일 뒤 복습, 그다음 3일, 7일, 14일, 30일 간격으로 복습 알림이 뜬다. 복습 시 틀리면 다시 1일 뒤부터 시작한다.

study_history 테이블의 next_review_date와 review_stage 컬럼을 활용해서 복습 스케줄을 관리한다.

### 추가될 테이블
- quiz_result: 퀴즈 결과 (유형, 점수, 총 문제 수)
- wrong_answer: 오답 (문제, 정답, 사용자 답)

### 만들 API
- POST /api/quiz/generate — 퀴즈 생성 (학습한 단어에서 출제)
- POST /api/quiz/submit — 퀴즈 제출 및 채점
- GET /api/wrong-answers — 오답 목록
- GET /api/review/due — 오늘 복습해야 할 단어 목록

### 프론트 작업
- QuizPage에 실제 퀴즈 로직 연결
- 오답노트 페이지 (/wrong-answers)
- 복습 페이지 (/review) — 오늘 복습 대상 단어 표시
- 메인에 "복습 필요: N개" 표시

---

## 6주차: 포인트/레벨 + 스트릭 + 학습 통계

6주차에서는 학습 동기부여를 위한 포인트 시스템과 통계 대시보드를 만든다. 단어를 공부하면 10포인트, 퀴즈 정답은 20포인트, AI 대화 1회에 30포인트 같은 식으로 활동별 포인트를 적립한다. 포인트가 쌓이면 레벨이 올라간다. (100포인트 = Lv.2, 300포인트 = Lv.3 같은 식)

매일 연속으로 학습하면 스트릭이 쌓인다. member 테이블의 streak_days와 last_study_date를 활용해서 연속 학습 일수를 관리한다. 하루라도 빠지면 0으로 초기화된다.

학습 통계 대시보드에서는 오늘 공부한 단어 수, 문장 수, 퀴즈 수를 보여주고, 주간 학습량을 막대 그래프로 표시한다. StatsPage에 이미 UI를 만들어놨으므로 실제 데이터를 연결한다.

### 추가될 테이블
- point_history: 포인트 적립 내역 (금액, 사유)

### 만들 API
- POST /api/points/add — 포인트 적립
- GET /api/stats — 학습 통계 (일간/주간)
- GET /api/stats/streak — 스트릭 정보

### 프론트 작업
- StatsPage에 실제 통계 데이터 연결
- 메인 페이지 레벨/포인트/스트릭 실시간 반영
- 포인트 적립 시 알림 표시

---

## 7주차: 프로필 이미지 업로드 + 관리자 페이지

7주차에서는 사용자가 프로필 이미지를 업로드할 수 있게 하고, 관리자 페이지를 만든다.

프로필 이미지는 파일을 서버에 업로드하고 경로를 member 테이블의 profile_image 컬럼에 저장한다. 프로필 수정 페이지에서 이미지를 선택하면 바로 업로드되고, 메인 페이지와 헤더에 이미지가 표시된다. 닉네임 변경과 비밀번호 변경 기능도 이 주차에서 실제로 동작하게 만든다. (1주차에서 UI만 만들어놨었다.)

관리자 페이지에서는 전체 회원 목록을 볼 수 있고, 각 회원의 학습 데이터(공부한 단어 수, 퀴즈 점수 등)를 조회할 수 있다. 관리자 페이지는 /admin 경로에 만들고, 특정 이메일(admin@englearn.com 등)로 로그인한 사용자만 접근 가능하게 한다.

### 테이블 변경
- member 테이블에 profile_image 컬럼 추가

### 만들 API
- POST /api/members/me/image — 프로필 이미지 업로드
- PUT /api/members/me — 닉네임/비밀번호 변경
- GET /api/admin/members — 전체 회원 목록 (관리자용)
- GET /api/admin/stats — 전체 학습 통계 (관리자용)

### 프론트 작업
- ProfilePage에 이미지 업로드 기능 추가
- 닉네임/비밀번호 변경을 실제 API와 연결
- 관리자 대시보드 페이지 (/admin) 추가
- 헤더에 프로필 이미지 표시

---

## 8주차: 검색 + 데이터 내보내기 + 마무리

마지막 주차에서는 학습한 단어와 문장을 검색하는 기능과 학습 데이터를 CSV로 내보내는 기능을 만든다.

검색은 단어의 영어/한국어, 문장의 영어/한국어를 키워드로 검색할 수 있게 한다. 검색 결과는 단어와 문장을 구분해서 보여준다. 내보내기는 학습한 단어, 문장, 퀴즈 결과를 CSV 파일로 다운로드할 수 있게 한다. 엑셀이나 구글 시트에서 열어서 확인할 수 있다.

그 외에 전체적인 UI를 정리하고, 버그를 수정하고, README를 최종 업데이트한다. 프론트엔드에서 일관성 없는 부분을 통일하고, 로딩 상태나 에러 처리가 빠진 곳을 보완한다.

### 만들 API
- GET /api/search?q=keyword — 단어/문장 통합 검색
- GET /api/export/csv — 학습 데이터 CSV 내보내기

### 프론트 작업
- 검색 페이지 (/search) — 키워드 입력, 결과 표시
- 내보내기 버튼 (통계 페이지 또는 메인에 배치)
- 전체 UI 일관성 정리
- 메인 페이지 대시보드 최종 완성

---

## 데이터베이스 설계

### 테이블 추가 일정

각 주차에서 필요한 테이블은 그 주차에 추가한다. JPA의 ddl-auto=update 설정 덕분에 엔티티 클래스를 만들면 테이블이 자동으로 생성된다.

| 주차 | 추가 테이블 |
|---|---|
| 1 | member |
| 2 | word, sentence, study_history |
| 3 | conversation, conversation_message |
| 5 | quiz_result, wrong_answer |
| 6 | point_history |

### 전체 테이블 관계

모든 테이블은 member를 기준으로 연결된다. 회원 한 명이 여러 단어, 문장, 대화, 퀴즈 결과를 가질 수 있다. 대화(conversation)는 여러 메시지(conversation_message)를 가진다.

```
member (1) ──── (N) word
member (1) ──── (N) sentence
member (1) ──── (N) study_history
member (1) ──── (N) conversation
conversation (1) ──── (N) conversation_message
member (1) ──── (N) quiz_result
member (1) ──── (N) wrong_answer
member (1) ──── (N) point_history
```

### 주요 테이블 상세

**member** — 회원 정보를 저장한다. 1주차에 만들었고, 7주차에서 profile_image 컬럼이 추가된다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | 자동 증가 |
| email | VARCHAR(100) UNIQUE | 로그인용 이메일 |
| password | VARCHAR(255) | 비밀번호 |
| nickname | VARCHAR(50) | 닉네임 |
| level | INT | 현재 레벨 (기본 1) |
| total_points | INT | 누적 포인트 (기본 0) |
| streak_days | INT | 연속 학습 일수 (기본 0) |
| last_study_date | DATE | 마지막 학습일 |
| profile_image | VARCHAR(500) | 프로필 이미지 경로 (7주차 추가) |
| created_at | DATETIME | 가입일 |

**word** — AI가 생성한 단어를 저장한다. 테마별로 분류된다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | 자동 증가 |
| member_id | BIGINT FK | 어떤 회원의 단어인지 |
| theme | VARCHAR(50) | 테마 (토익, 여행 등) |
| english | VARCHAR(200) | 영어 단어 |
| korean | VARCHAR(200) | 한국어 뜻 |
| example | TEXT | 예문 |
| created_at | DATETIME | 생성일 |

**conversation** — 대화 세션을 저장한다. type으로 자유 대화와 롤플레이를 구분한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | 자동 증가 |
| member_id | BIGINT FK | 회원 |
| type | VARCHAR(20) | free 또는 roleplay |
| scenario | VARCHAR(50) | 롤플레이 시나리오명 |
| created_at | DATETIME | 생성일 |

**conversation_message** — 대화의 각 메시지를 저장한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | 자동 증가 |
| conversation_id | BIGINT FK | 어떤 대화에 속하는지 |
| role | VARCHAR(10) | user 또는 ai |
| content | TEXT | 메시지 내용 |
| correction | TEXT | 교정 내용 (있을 때만) |
| created_at | DATETIME | 전송 시간 |

**study_history** — 학습 이력과 복습 스케줄을 관리한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | 자동 증가 |
| member_id | BIGINT FK | 회원 |
| content_type | VARCHAR(20) | word 또는 sentence |
| content_id | BIGINT | 해당 단어/문장의 ID |
| studied_at | DATETIME | 학습한 시점 |
| next_review_date | DATE | 다음 복습 예정일 |
| review_stage | INT | 복습 단계 (0~5) |

**quiz_result** — 퀴즈 결과를 저장한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | 자동 증가 |
| member_id | BIGINT FK | 회원 |
| quiz_type | VARCHAR(20) | ko_to_en, en_to_ko, fill_blank |
| score | INT | 맞힌 개수 |
| total | INT | 전체 문제 수 |
| created_at | DATETIME | 풀은 시점 |

**wrong_answer** — 틀린 문제를 저장한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | 자동 증가 |
| member_id | BIGINT FK | 회원 |
| question | TEXT | 문제 |
| correct_answer | TEXT | 정답 |
| user_answer | TEXT | 사용자가 고른 답 |
| created_at | DATETIME | 시점 |

**point_history** — 포인트 적립 내역을 기록한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | 자동 증가 |
| member_id | BIGINT FK | 회원 |
| amount | INT | 적립 포인트 |
| reason | VARCHAR(100) | 사유 (단어 학습, 퀴즈 등) |
| created_at | DATETIME | 적립 시점 |

---

## API 설계

### 인증 관련

| Method | Path | 설명 |
|---|---|---|
| POST | /api/auth/signup | 이메일, 비밀번호, 닉네임으로 회원가입 |
| POST | /api/auth/login | 이메일/비밀번호로 로그인, memberId 반환 |
| GET | /api/auth/check-email | 이메일 중복 여부 확인 |
| GET | /api/members/me | 로그인한 회원의 정보 조회 |
| PUT | /api/members/me | 닉네임, 비밀번호 변경 |
| POST | /api/members/me/image | 프로필 이미지 업로드 |

### 학습 관련

| Method | Path | 설명 |
|---|---|---|
| POST | /api/words/generate | 테마와 개수 지정, AI가 단어 생성 |
| GET | /api/words | 학습한 단어 목록 조회 |
| POST | /api/sentences/generate | 카테고리 지정, AI가 문장 생성 |
| GET | /api/sentences | 학습한 문장 목록 조회 |
| POST | /api/study-history | 학습 완료 기록 |
| GET | /api/study-history | 학습 이력 조회 |

### AI 대화

| Method | Path | 설명 |
|---|---|---|
| POST | /api/conversations | 새 대화 시작 |
| GET | /api/conversations | 대화 목록 |
| GET | /api/conversations/{id} | 대화 내 메시지 전체 조회 |
| POST | /api/conversations/{id}/messages | 메시지 전송, AI 응답+교정 반환 |

### 롤플레이

| Method | Path | 설명 |
|---|---|---|
| GET | /api/roleplay/scenarios | 시나리오 목록 |
| POST | /api/roleplay/start | 시나리오 선택, AI 첫 메시지 생성 |
| POST | /api/roleplay/{id}/messages | 롤플레이 메시지 전송 |

### 퀴즈/복습

| Method | Path | 설명 |
|---|---|---|
| POST | /api/quiz/generate | 학습 단어 기반 퀴즈 출제 |
| POST | /api/quiz/submit | 퀴즈 제출, 채점, 오답 저장 |
| GET | /api/wrong-answers | 오답 목록 |
| GET | /api/review/due | 오늘 복습 대상 |

### 포인트/통계

| Method | Path | 설명 |
|---|---|---|
| POST | /api/points/add | 포인트 적립 |
| GET | /api/stats | 일간/주간 학습 통계 |
| GET | /api/stats/streak | 연속 학습 일수 |

### 관리자

| Method | Path | 설명 |
|---|---|---|
| GET | /api/admin/members | 전체 회원 목록 |
| GET | /api/admin/stats | 전체 서비스 통계 |

### 검색/내보내기

| Method | Path | 설명 |
|---|---|---|
| GET | /api/search | 단어/문장 통합 검색 |
| GET | /api/export/csv | 학습 데이터 CSV 다운로드 |

---

## 페이지 구성

전체 페이지 목록과 각 페이지가 어느 주차에 구현되는지 정리했다.

| 경로 | 이름 | 구현 주차 | 설명 |
|---|---|---|---|
| /login | 로그인 | 1 | 이메일/비밀번호 입력 |
| /signup | 회원가입 | 1 | 이메일 중복확인, 비밀번호 규칙 |
| / | 메인 | 1 | 레벨/포인트/스트릭, 메뉴 카드 |
| /profile | 내 정보 | 1, 7 | 닉네임/비밀번호 변경, 이미지 업로드 |
| /word | 단어 학습 | 2 | 테마 선택, 단어 카드, 발음 |
| /sentence | 문장 학습 | 2 | 카테고리 선택, 문장 리스트, 발음 |
| /chat | AI 대화 목록 | 3 | 과거 대화 목록, 새 대화 시작 |
| /chat/:id | 대화 상세 | 3 | 채팅 UI, 교정 표시 |
| /roleplay | 롤플레이 | 4 | 시나리오 카드 선택 |
| /roleplay/:id | 롤플레이 진행 | 4 | 역할극 채팅 |
| /quiz | 퀴즈 | 5 | 4지선다, 빈칸 채우기 |
| /wrong-answers | 오답노트 | 5 | 틀린 문제 모아보기 |
| /review | 복습 | 5 | 오늘 복습 대상 |
| /stats | 통계 | 6 | 일간/주간 학습량, 그래프 |
| /admin | 관리자 | 7 | 회원/통계 조회 |
| /search | 검색 | 8 | 단어/문장 키워드 검색 |
| * | 404 | 1 | 존재하지 않는 경로 |

---

## 개발 환경

### 필요한 것
- Java 17
- Node.js 20 이상
- Docker, Docker Compose
- OpenAI API Key (2주차부터)

### 실행 방법
```
docker compose up -d
cd backend && ./gradlew bootRun
cd frontend && npm install && npm run dev
```

### 포트
- MySQL: 3306
- Spring Boot: 8080
- React (Vite): 5173
