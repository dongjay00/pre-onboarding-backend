# [위코드 x 원티드] 백엔드 프리온보딩 선발 과제

> **게시판 CRUD API**
>
> - 유저 생성, 인가, 인증 기능 구현
> - Read Pagination 기능 구현
> - DB는 in-memory database로 구현
> - Unit Test 구현





## 기술 스택

- **언어** :  `JavaScript`

- **프레임워크** : `Express.js`

- **DB** : `sqlite3`

- **버전** 

  - `node` : 14.16.1
  - `npm` : 6.14.12
  - `express` : 4.17.1

  - `sqlite3` : 5.0.2
  - `sequelize` : 6.7.0

- **주요 라이브러리**
  - `helmet` - 다양한 HTTP header를 설정하여 서버의 정보 보안을 돕는 미들웨어
  - `cors` - CORS(Cross-Origin Resource Sharing) 처리를 위한 미들웨어
  - `morgan` - 로그(log)를 관리하기 위한 서드파티 미들웨어
  - `nodemon` - 폴더의 파일 변경이 감지되면 Node.js 프로그램을 자동으로 다시 시작하게 해주는 도구
  - `dotenv` - `.env` 파일에서 환경 변수를 로딩하기 위한 라이브러리





## 실행 방법

- `git clone` 후, `npm install`

- root에 `.env` 파일을 생성하고, 필요한 값들을 입력한다. (`.env.sample` 파일 참고)

  ```sh
  // 예시
  PORT = 3000
  DATABASE = example
  DB_USERNAME = root
  DB_PASSWORD = root1234!!
  DB_HOST = localhost
  JWT_SECRET_KEY = wecode
  AES_SECRET_KEY = wanted
  ```

  - **default PORT 번호는 3000**

- 다음 명령어 목록을 참고하여 실행한다.

  ```sh
  npm start // 서버 구동
  npm run start:dev // 개발용 서버 구동
  npm test // 테스트 시작
  npm test:watch // 테스트 대상 파일 감시 옵션 추가
  ```

  - `http://localhost:{포트번호}`





## DB 설계

- **Users**

  | field    | type    |             |
  | :------- | :------ | ----------- |
  | id       | Integer | primary key |
  | username | String  |             |
  | password | String  |             |
  | email    | String  |             |

- **Articles**

  | field   | type    |                 |
  | ------- | ------- | --------------- |
  | id      | Integer | primary key     |
  | title   | String  |                 |
  | content | Text    |                 |
  | UserId  | Integer | Users의 id 참조 |





## Api 명세

> POST와 PUT의 `Content-Type`은 `application/json`

### Auth api

- **회원가입**

  ```sh
  // request
  - URL
  post("/api/auth/register")
  
  - Body(JSON)
  {
      "username": "유저명",
      "email": "이메일",
      "password": "패스워드"
  }
  ```

  ```sh
  // 성공 response (201)
  {
      "newUser": {
          "id": 정수 id값,
          "username": "유저명",
          "email": "이메일"
      },
      "message": "Success!"
  }
  ```

  ```sh
  // 실패 response 1 (400)
  {
      "err": {
          "name": "SequelizeUniqueConstraintError",
          ...
      },
      "message": "Bad request!"
  }
  ```

  ```sh
  // 실패 response 2 (422)
  {
      "result": "failed",
      "data": {
          "{빈 값 넣은 속성}": "{빈 값 넣은 속성} is required!"
      }
  }
  ```



- **로그인**

  ```sh
  // request
  - URL
  post("/api/auth/login")
  
  - Body(JSON)
  {
      "username": "유저명",
      "password": "패스워드"
  }
  ```

  ```sh
  // 성공 response (200)
  {
      "user": {
          "id": 정수 id값,
          "username": "유저명",
          "email": "이메일"
      },
      "accessToken": "인증토큰",
      "message": "Success!"
  }
  ```

  ```sh
  // 실패 response 1 (401)
  {
      "message": "There is no user named {유저명}"
  }
  ```

  ```sh
  // 실패 response 2 (401)
  {
      "message": "Password is wrong!"
  }
  ```

  ```sh
  // 실패 response 3 (400)
  {
      "err": {
          ...
      },
      "message": "Bad request!"
  }
  ```



### Articles api

- **글 작성**

  ```sh
  // request
  - URL
  post("/api/articles")
  
  - Headers
  {
      token: "유저의 인증토큰"
  }
  
  - Body(JSON)
  {
      "title": "글 제목",
      "content": "글 내용"
  }
  ```

  ```sh
  // 성공 response (200)
  {
      "newArticle": {
          "id": 정수 id값(게시글),
          "title": "글 제목",
          "content": "글 내용",
          "UserId": 정수 id값(글쓴이)
      },
      "message": "Success!"
  }
  ```

  ```sh
  // 실패 response 1 (422)
  {
      "result": "failed",
      "data": {
          "{빈 값 넣은 속성}": "{빈 값 넣은 속성} is required!"
      }
  }
  ```

  ```sh
  // 실패 response 2 (403)
  {
      "message": "Token is not valid!"
  }
  ```

  ```sh
  // 실패 response 3 (401)
  {
      "message": "You are not authenticated!"
  }
  ```

  ```sh
  // 실패 response 4 (400)
  {
      "err": {
          ...
      },
      "message": "Bad request!"
  }
  ```



- **글 목록 확인** - page를 옵션으로 추가할 수 있다

  ```sh
  // request
  - URL
  get("/api/articles")
  
  - Query (Option)
  '?page={페이지 number}'
  ```

  ```sh
  // 성공 response (200) - page 옵션을 추가한 경우, 해당 page의 글들만 배열 속에 반환된다.
  {
      "articles": [
          {
              "id": 정수 id값(게시글),
          	"title": "글 제목",
          	"content": "글 내용",
          	"UserId": 정수 id값(글쓴이)
          },
  		...
      ],
      "message": "Success!"
  }
  ```

  ```sh
  // 실패 response 1 (404) - page 옵션을 주었을 때만 나타나는 response이다.
  {
      "message": "Page Not Found!"
  }
  ```

  ```sh
  // 실패 response 2 (400)
  {
      "err": {
          ...
      },
      "message": "Bad request!"
  }
  ```



- **글 확인**

  ```sh
  // request
  - URL
  get("/api/articles/{정수 id값(게시글)}")
  ```

  ```sh
  // 성공 response (200)
  {
      "article": {
          "id": 정수 id값(게시글),
         	"title": "글 제목",
         	"content": "글 내용",
          "UserId": 정수 id값(글쓴이)
      },
      "message": "Success!"
  }
  ```

  ```sh
  // 실패 response 1 (404)
  {
      "message": "Article Not Found!"
  }
  ```

  ```sh
  // 실패 response 2 (400)
  {
      "err": {
          ...
      },
      "message": "Bad request!"
  }
  ```

  

- **글 수정**

  ```sh
  // request
  - URL
  put("/api/articles/{정수 id값(게시글)}")
  
  - Headers
  {
      token: "유저의 인증토큰"
  }
  
  - Body(JSON)
  {
      "title": "글 제목",
      "content": "글 내용",
      "UserId": 정수 id값(글쓴이)
  }
  ```

  ```sh
  // 성공 response (200)
  {
      "updatedArticle": [
          1
      ],
      "message": "Success!"
  }
  ```

  ```sh
  // 실패 response 1 (422)
  {
      "result": "failed",
      "data": {
          "{빈 값 넣은 속성}": "{빈 값 넣은 속성} is required!"
      }
  }
  ```

  ```sh
  // 실패 response 2 (403)
  {
      "message": "Token is not valid!"
  }
  ```

  ```sh
  // 실패 response 3 (401)
  {
      "message": "You are not authenticated!"
  }
  ```

  ```sh
  // 실패 response 4 (403)
  {
      "message": "You are not allowed to do that!"
  }
  ```

  ```sh
  // 실패 response 5 (400)
  {
      "err": {
          ...
      },
      "message": "Bad request!"
  }
  ```



- **글 삭제**

  ```sh
  // request
  - URL
  delete("/api/articles/{정수 id값(게시글)}")
  
  - Headers
  {
      token: "유저의 인증토큰"
  }
  
  - Body(JSON)
  {
      "UserId": 정수 id값(글쓴이)
  }
  ```

  ```sh
  // 성공 response (200)
  {
      "id": 정수 id값(게시글),
      "message": "Success!"
  }
  ```

  ```sh
  // 실패 response 1 (404)
  {
      "message": "Article Not Found!"
  }
  ```

  ```sh
  // 실패 response 2 (403)
  {
      "message": "Token is not valid!"
  }
  ```

  ```sh
  // 실패 response 3 (401)
  {
      "message": "You are not authenticated!"
  }
  ```

  ```sh
  // 실패 response 4 (403)
  {
      "message": "You are not allowed to do that!"
  }
  ```

  ```sh
  // 실패 response 5 (400)
  {
      "err": {
          ...
      },
      "message": "Bad request!"
  }
  ```

  



## 구현한 방법과 이유

- **ORM**
  - DB는 in-memory database로 구현하라는 제약사항이 있었다. 이에 `Sqlite3`를 DB로 선택했고, 직접 쿼리를 작성하지 않고도 객체의 메서드를 활용하는 것처럼 로직을 작성할 수 있는 **ORM**을 활용했다.
  - Node.js의 대표적 ORM인 `Sequelize`를 활용하였다.



- **DB 설계**
  - Users 테이블과 Articles 테이블 두 가지가 필요
  - Users와 Articles의 관계는 `1:N`



- **로그인, 회원가입**
  - 회원가입 시엔 `username`, `email`, `password`를 입력받고, 로그인 시엔 `username`, `password`를 입력받는 방식으로 구현했다.
  - `password`는 노출되어선 안되는 정보이므로 다음과 같이 처리해주었다.
    - `password` 암호화/복호화 작업
      - 대칭키 알고리즘을 활용하는 AES 방식을 채택했다. (`crypto-js` 라이브러리 활용)
      - 회원가입 시 암호화, 로그인 시 복호화 작업
    - Response 시, password는 제외하고 반환했다. (Auth api 참고)
  - 로그인 과정에서 accessToken을 생성하여 반환한다.



- **인가, 인증 기능**

  - CRUD 중 C는 인증 기능이 필요하고, U와 D는 인증 + 인가의 과정이 필요하다.
  - 세션으로 구현하기 위해선 따로 세션 DB가 필요하기 때문에, 이번 과제에 적합하지 않다고 판단했다.
  - 이에 **JWT**를 활용하여 인증, 인가 과정을 구현했다. (`jsonwebtoken` 라이브러리 활용)

  - `verifyToken.js` 내에서 다음과 같은 검증 과정을 거친다.
    - **토큰이 없다면?**
    - **토큰이 있지만, 유효한 토큰이 아니라면?**
    - **유효한 토큰이긴 한데, 권한이 없는 유저라면?**



- **게시글 CRUD**
  - `create`, `findAll`, `findOne`, `update`, `destroy` 같은 sequelize의 메소드를 활용하여 구현



- **Pagination**

  - 원하는 page값을 query 옵션으로 넣어주는 방식으로 구현했다.

  - sequelize의 `limit`와 `offset` 속성을 활용하여, 조회할 레코드 개수를 설정할 수 있다.

    ```javascript
    const page = req.query.page;
    const limit = 5;
    let offset = 0;
    if (page > 1) offset = limit * (page - 1);
    
    // page 옵션이 있는 경우와 없는 경우를 나누었다.
    const articles = page
      ? await models.Articles.findAll({ offset, limit })
      : await models.Articles.findAll();
    ```



- **Validation**
  - 최소한 필드에 **빈 값을 넣는 행위**는 막아야 겠다는 생각에 `validation.js` 모듈을 생성했다.
  - 회원가입, 로그인, 글 생성, 글 수정 api에 validation 과정을 추가했다.
  - 만약 더 검증할 내용이 생긴다면, `validation.js` 모듈 내에 함수를 더 추가해주면 된다.



- **구조 리팩토링**

  - 상태와 로직을 수정하지 않고 **파일, 폴더**를 역할과 책임 그리고 이해하기 쉬운 형태로 재정렬했다.

    - router와 controller를 분리하는 과정을 거쳤다. 
    - 원래 validation 파트는 controller 내에 포함되어 있었으나, 공통으로 사용되는 부분이 많아 따로 `functions` 폴더 내로 이동시켰다.
    - DB 연결부와 서버 구동부를 따로 분리하여 `bin` 폴더로 이동시켰다.

  - 그 결과 다음과 같은 폴더 구조로 재탄생했다.

    ```sh
    root
    ├─ .env
    │	...
    ├─ data								// DB
    │	└─ database.sqlite				
    ├─ test								// 테스트 파일
    │	├─ articles.spec.js		
    │	└─ auth.spec.js
    └─ src
       ├─ bin
       │   ├─ sync-db.js				// DB 연결부
       │   └─ www.js					// 서버 구동부
       ├─ functions
       │   └─ validation.js				// validation 모듈
       ├─ models       					// DB 모델
       │   ├─ Articles.js     
       │   ├─ Users.js
       │   └─ index.js
       ├─ routes      
       │   ├─ articles
       │   │   ├─ articles.ctrl.js
       │   │   └─ index.js
       │   ├─ auth
       │   │   ├─ auth.ctrl.js
       │   │   └─ index.js
       │   └─ verifyToken.js
       └─ index.js                    
    
    
    ```

    

- **테스트 구현**
  - 활용 프레임워크 및 라이브러리
    - `mocha` - Node.js 프로그램을 위한 JavaScript 테스트 프레임 워크
    - `supertest` - HTTP assertion을 쉽게 만들어주는 라이브러리
    - `should` - 테스트 코드를 검증할 때 사용하는 써드파티 라이브러리
      - `assert` 라는 Node.js 공식 모듈이 있으나, mocha에서 써드파티 라이브러리를 사용할 것을 권장하고 있다.
  - 테스트 성공 시엔, 반환된 객체의 property나 배열의 길이 등을 검증하는 방식으로 구현했다.
  - 테스트 실패 시엔, 예상된 HTTP 응답 코드가 맞는지 체크하는 방식으로 구현했다.