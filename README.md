# MIRAE PASS FRONT
---
미래 패스 서비스의 프론트 시스템

## 🔒 개발 환경설정
---
```bash
# Git clone
git clone https://git.rldn.xyz/scfs.miraepass/front.git
cd front

# 필요 라이브러리 설치및 환경 구성
yarn install

# 환경변수 설정
cp example.env .env
vi .env

# 개발 환경 실행
yarn dev
```

## ✨ 명령어 및 개발 가이드
---
`http://localhost:8000/openapi.json`는 백엔드 서버의 openapi.json 파일입니다. 사용시 수정필요.
### SDK 생성
```bash
npx @hey-api/openapi-ts -i http://localhost:8000/openapi.json -o app/sdk -c @hey-api/client-ofetch
```

### 버전 지정
버전의 경우 [package.json]()에 작성하며. 유의적 버전 규칙을 따릅니다.
```
Major.Minor.Patch
- Major (1.x.x): 기존 기능과 호환되지 않는 큰 변화가 있을 때 (예: UI 전면 개편)
- Minor (x.1.x): 새로운 기능이 추가되었지만, 기존 기능은 그대로 잘 작동할 때
- Patch (x.x.1): 단순한 버그 수정이나 성능 개선이 있었을 때
```
## 📦 프로젝트 구조
---
```
...
```


## 🛠 기술 스택
---
- Framework: Nuxt.js
- CSS Framework: TailwindCSS
- Nuxt Modules: @nuxt/fonts
- Package Management: Yarn