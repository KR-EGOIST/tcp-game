# Node.js 로 개발한 TCP 서버
---
### 디렉토리 구조 미리보기
```
.
├── assets
│   ├── item.json
│   ├── item_unlock.json
│   └── stage.json
├── clients
├── package-lock.json
├── package.json
├── readme.md
└── src
    ├── classes            // 인스턴스 class 들을 정의
    │   ├── managers
    │   └── models
    ├── config             // 환경변수, DB 설정등을 선언
    ├── constants          // 상수 관리
    ├── db                 // db 로직 관리
    │   ├── game
    │   ├── migrations
    │   ├── seeders
    │   ├── sql
    │   └── user
    ├── events             // socket 이벤트
    ├── handlers           // 핸들러 관리
    │   ├── game
    │   └── user
    ├── init               // 서버 초기화
    ├── protobuf           // 패킷 구조
    │   ├── notification
    │   ├── request
    │   └── response
    ├── session             // 세션 관리
    └── utils               // 그 외 필요한 함수들 선언
        ├── db
        ├── error
        ├── notification
        ├── parser
        └── response
```
---
### 사용한 라이브러리들
```
npm install dotenv lodash long mysql2 protobufjs uuid
npm install -D nodemon prettier
```
---
### 패킷 구조 + 프로토버프

**바이트 배열의 구조**
|필드 명|타입|설명|크기|
|-------|----|----|-----|
|totalLength|int|메세지의 전체 길이|4 Byte|
|packetType|int|패킷의 타입|1 Byte|
|protobuf|protobuf|프로토콜 버퍼 구조체|가변|

**프로토 버프 구조**
- **common**
  - 아래의 구조로 클라이언트 요청을 할 것이며 `payload`에 각 핸들러에 맞는 데이터가 들어가게됩니다.
    
    |필드 명|타입|설명|
    |-------|----|----|
    |handlerId|uint32|핸들러 ID (4바이트)|
    |userId|string|유저 ID (UUID)|
    |clientVersion|string|클라이언트 버전 (문자열)|
    |sequence|uint32|유저의 호출 수 (42억)|
    |payload|bytes|실제 데이터|

```
syntax = "proto3";

package common;

// 공통 패킷 구조
message Packet {
  uint32 handlerId = 1;      // 핸들러 ID (4바이트)
  string userId = 2;         // 유저 ID (UUID)
  string clientVersion = 3;  // 클라이언트 버전 (문자열)
  uint32 sequence = 4;       // 유저의 호출 수 (42억)
  bytes payload = 5;         // 실제 데이터
}
```

- **Response**
  - 클라이언트 요청에 대해서는 아래의 구조로 반환해주게 됩니다.

    |필드 명|타입|설명|
    |-------|----|----|
    |handlerId|uint32|핸들러 ID|
    |responseCode|uint32|응답 코드 (성공: 0, 실패: 에러 코드)|
    |timestamp|int64|메시지 생성 타임스탬프 (Unix 타임스탬프)|
    |data|bytes|실제 응답 데이터 (선택적 필드)|
    |sequence|uint32|시퀀스 값|

```
syntax = "proto3";

package response;

// 공통 응답 메시지 구조
message Response {
  uint32 handlerId = 1;      // 핸들러 ID
  uint32 responseCode = 2;   // 응답 코드 (성공: 0, 실패: 에러 코드)
  int64 timestamp = 3;       // 메시지 생성 타임스탬프 (Unix 타임스탬프)
  bytes data = 4;            // 실제 응답 데이터 (선택적 필드)
  uint32 sequence = 5;       // 시퀀스 값
}
```
