# [1.1.0-dev.1](https://git.rldn.xyz/scfs.miraepass/front/compare/v1.0.3...v1.1.0-dev.1) (2026-05-03)


### Features

* 대시보드 접근을 위한 /admin 프록시 구성 ([8d9933a](https://git.rldn.xyz/scfs.miraepass/front/commit/8d9933a15b6b16850f835b3678b0762c9dda2031))

## [1.0.3](https://git.rldn.xyz/scfs.miraepass/front/compare/v1.0.2...v1.0.3) (2026-05-02)


### Bug Fixes

* **deploy:** `if [[ "$NEW_VERSION" != *"-dev"* ]]; then` 파트 에러 해결 ([78229ba](https://git.rldn.xyz/scfs.miraepass/front/commit/78229ba64f311c9f5a630e169c466789ce04ba82))

## [1.0.2](https://git.rldn.xyz/scfs.miraepass/front/compare/v1.0.1...v1.0.2) (2026-05-02)


### Bug Fixes

* **ci/cd:** 릴리즈가 되었음에도 도커 빌드가 안되는 현상 해결2 [skip ci] ([159ccfc](https://git.rldn.xyz/scfs.miraepass/front/commit/159ccfcdfe148fe5035f74e731354459d66d93cf))

## [1.0.1](https://git.rldn.xyz/scfs.miraepass/front/compare/v1.0.0...v1.0.1) (2026-05-02)


### Bug Fixes

* **ci/cd:** 릴리즈가 되었음에도 도커 빌드가 안되는 현상 해결 ([fc6b7a0](https://git.rldn.xyz/scfs.miraepass/front/commit/fc6b7a02b9225d65dd4bf79b52612f626825f2cc))

# 1.0.0 (2026-05-02)


### Bug Fixes

* CI/CD 모듈 못찾는 현상 해결 ([3791cbd](https://git.rldn.xyz/scfs.miraepass/front/commit/3791cbdf90d34b2921af5149827513b9c00d6a0a))
* iOS에서 정상적으로 PWA앱이 작동하지 않는 문제 해결을 위한 config ([b50dd91](https://git.rldn.xyz/scfs.miraepass/front/commit/b50dd91eb519fb5e68c4b1e82fe1c769d46480ab))
* **Login:** 로그인 트랜지션중 보이지 않는데에도 선택이 되는 현상 해결 ([c6bf8fe](https://git.rldn.xyz/scfs.miraepass/front/commit/c6bf8fecca23fb223d46a7f3cdeb5ebf14c5d8bb))
* node 버전 문제 해결 ([698fbd3](https://git.rldn.xyz/scfs.miraepass/front/commit/698fbd37b60fe3031fd2e782b2037cd42f837a87))
* **StudentHome:** 다크모드에서 기록 UI가 색이 변하지 않는 문제 해결 ([7ef33d6](https://git.rldn.xyz/scfs.miraepass/front/commit/7ef33d65e6113e0205835b3796e62b23ef9f803b))
* 가끔 PWA 설치 확인상태에서 앱으로 들어갔을때 꼬이는 문제 해결 ([bf18ca6](https://git.rldn.xyz/scfs.miraepass/front/commit/bf18ca603874b62767ad0d840cd18e48286193fa))
* 교사 지급시 내용들이 h-full 되지 않던 문제 해결 ([265d322](https://git.rldn.xyz/scfs.miraepass/front/commit/265d322b739ba47ecaba56bae4c579c6dfaa00c4))
* 교사 지급시 내용들이 h-full 되지 않던 문제 해결 2 ([ab00e51](https://git.rldn.xyz/scfs.miraepass/front/commit/ab00e519e50a10d7787581e000fda37a98c5e2a2))
* 기록 종류가 적용되지 않는 문제 해결 ([f014a9b](https://git.rldn.xyz/scfs.miraepass/front/commit/f014a9bdfd2992aebe101752da81d0c3e164c091))
* 모바일 PWA에서 학생 UI가 꼬이는 문제 해결 ([a501621](https://git.rldn.xyz/scfs.miraepass/front/commit/a50162195b3ebc3b4a8aae69a451c61cb3810fa3))
* 모바일에서 포인트 숫자 이상하게 나오는 형상및 상단 설정 hover 안되는거 해결 ([f259686](https://git.rldn.xyz/scfs.miraepass/front/commit/f259686b9a00e090ecf8218db6e267eacda33b1f))
* 무한적으로 지랄라는 현상 해결 ([ae14b02](https://git.rldn.xyz/scfs.miraepass/front/commit/ae14b024d3ab17a858d596f3a5541f6ffa9f594d))
* 정상적으로 fetch가 되지 않던 문제 해결 ([2632813](https://git.rldn.xyz/scfs.miraepass/front/commit/2632813f008cc31bb7f5c6df6a74619e3b82a6eb))
* 최초 로그인시 비밀번호 확인이 되지 않았음에도 넘어가지는 문제 해결 ([bff909f](https://git.rldn.xyz/scfs.miraepass/front/commit/bff909ff94a42c2211f37a1ed4f47cc8258a0ae3))
* 포인트 기록 시간대가 이상한 문제 해결 ([9770e42](https://git.rldn.xyz/scfs.miraepass/front/commit/9770e42b5b019a13eef8d4a19371c60a3cbae95b))
* 포인트 기록이 불러와지지 않는 문제 해결 ([11767b3](https://git.rldn.xyz/scfs.miraepass/front/commit/11767b3d1386665e621a5b8b168a13ed1f206624))


### Features

* @nuxt/fonts 모듈 추가와 Pretendard 폰트 로드 설정 ([4ae5ac4](https://git.rldn.xyz/scfs.miraepass/front/commit/4ae5ac4538da0bbaac69e81763b707622dda1313))
* **0.4.1:** 포인트 기록 무한스크롤과 등장 애니메이션 ([c64d75d](https://git.rldn.xyz/scfs.miraepass/front/commit/c64d75d6b96ae4b2dc8660c9e9eed510491cc864))
* **0.4.4:** 앱 설치 가이드 처리 ([88bb085](https://git.rldn.xyz/scfs.miraepass/front/commit/88bb0859719562d0c1f9ca929927308640c75d20))
* API SDK ([1b29ae3](https://git.rldn.xyz/scfs.miraepass/front/commit/1b29ae3093ee222b08542a8dbd32d18631795e40))
* API 사용을 위한 fetch composables ([4683ab2](https://git.rldn.xyz/scfs.miraepass/front/commit/4683ab25268b024549c16c975052ac340380d0de))
* API를 내부 프록시으로 처리하도록 변경 ([2d3f89b](https://git.rldn.xyz/scfs.miraepass/front/commit/2d3f89bc9dd3f842170745b87ef595cd3bd7d463))
* ios 스플래시 처리및 정리 ([3724386](https://git.rldn.xyz/scfs.miraepass/front/commit/37243860f93764a87fbd121aeb02ff5c0590e34f))
* Login 페이지 학생/교사 선택파트 까지 ([76b80ec](https://git.rldn.xyz/scfs.miraepass/front/commit/76b80ec5a0530acac790dc854b80ac5ed4fe3eb2))
* PWA 개발 환경 구성 ([8ba6369](https://git.rldn.xyz/scfs.miraepass/front/commit/8ba63692738df649f26e09621992b576d4aa7fa2))
* 각 로그인 페이지 돌아가는 UI 추가 ([3c36c8b](https://git.rldn.xyz/scfs.miraepass/front/commit/3c36c8bbcf3a37d132bac1d34fd1a1d7427cb2b1))
* 각 로그인 화면 키보드 이동 작동 처리 (by. gemini) ([870babd](https://git.rldn.xyz/scfs.miraepass/front/commit/870babd4fd873b9f8fe9afa7b9c1eeeef4f238db))
* 교사 로그인 완료 ([dace675](https://git.rldn.xyz/scfs.miraepass/front/commit/dace67552344e602dc8981f93be41c1ddfe03d70))
* 로그아웃 기능 추가 ([bfd996f](https://git.rldn.xyz/scfs.miraepass/front/commit/bfd996f50585c5fb9d8f93a7259e316ec752eeb9))
* 로그인 검증 미들웨어 로직 재구성 ([8d7d093](https://git.rldn.xyz/scfs.miraepass/front/commit/8d7d0933a7c9f586fb9387a14108c2846d80e7d7))
* 로그인 검증 미들웨어 및 기타 등등 ([39c848c](https://git.rldn.xyz/scfs.miraepass/front/commit/39c848c3f98c43ea3228f64b3ef8ef1705deeb77))
* 로그인 메뉴 서비스 추가 ([9aa94de](https://git.rldn.xyz/scfs.miraepass/front/commit/9aa94de4e9ed7a73c56affc50080b59e46274cd7))
* 로딩 처리를 위한 로직 추가 ([dfe39be](https://git.rldn.xyz/scfs.miraepass/front/commit/dfe39be32b897ed2e5e10dae58273a2c27cd7561))
* 모바일 기기 제한 추가 ([15bcd85](https://git.rldn.xyz/scfs.miraepass/front/commit/15bcd85780534c72a3638deda96d21bea124f22b))
* 모바일 손가락 확대 막기 ([e819378](https://git.rldn.xyz/scfs.miraepass/front/commit/e819378315ca5ee1b9c29cb112fb4a154737603d))
* 빌드 시간, 클라이언트 버전 표기 ([cda7a96](https://git.rldn.xyz/scfs.miraepass/front/commit/cda7a967793df19631d801c603dde3ed91c58ef8))
* 서비스 로그인 구현 ([cc6fa6a](https://git.rldn.xyz/scfs.miraepass/front/commit/cc6fa6af349746cc212830b1bb1604daa0b2c5b6))
* 설정에 백엔드 서버 버전 표시 추가 ([e4abaf7](https://git.rldn.xyz/scfs.miraepass/front/commit/e4abaf7531b449b77ed33f9c99a028463d430b08))
* 찾기 실패한 학번 핸들링 ([0f87c0c](https://git.rldn.xyz/scfs.miraepass/front/commit/0f87c0c12d643afd015f9d6d4f0430f8b12f0226))
* ㅋ ([75e98a9](https://git.rldn.xyz/scfs.miraepass/front/commit/75e98a9d8896e7c70728dda3fc1726d7c0b292f4))
* 태블릿 기기 접근 허용 ([776c0b8](https://git.rldn.xyz/scfs.miraepass/front/commit/776c0b88a08180bf5e4dc10e47cc2ac9830362c5))
* 페이지 Layout 분리 작업 ([1d508ff](https://git.rldn.xyz/scfs.miraepass/front/commit/1d508ffd2076007599a6120503d6d87f87c5deed))
* 포인트 기록 아이콘 적용 ([410be1a](https://git.rldn.xyz/scfs.miraepass/front/commit/410be1a6505adff70b648297a6116af93ef7da49))
* 필요한 에셋과 PWA 구성 ([50c65da](https://git.rldn.xyz/scfs.miraepass/front/commit/50c65dab1f1da9882cfff2c784d4c3a28a54f6b2))
* 학번 입력 PinInput UI 도입 ([f33997a](https://git.rldn.xyz/scfs.miraepass/front/commit/f33997a2d52cd3695b4548a230d327c7222a9fac))
* 학생 로그인 UI 완료 ([39eece3](https://git.rldn.xyz/scfs.miraepass/front/commit/39eece3e32c22059f2787a075c709d0742c8a87f))
* 학생 로그인 완료 ([5b5447b](https://git.rldn.xyz/scfs.miraepass/front/commit/5b5447bdf03b588790b41576345e58fc2da8fd74))
* 학생 포인트 기록 UI ([7b736d3](https://git.rldn.xyz/scfs.miraepass/front/commit/7b736d35b74a140e5c037c9a8e7e272882b2638d))
* 학생 포인트 확인 ([059dc0e](https://git.rldn.xyz/scfs.miraepass/front/commit/059dc0e0659199a85b4e2ba3588444ba141dfad5))
