# Green Campus Map

Leaflet + OpenStreetMap을 사용합니다. **API 키가 필요 없습니다.**
카카오/구글맵에서 겪었던 앱 활성화, 도메인 등록, 결제수단 등록 같은 절차가 전혀 없고,
코드 그대로 GitHub Pages에 올리면 바로 작동합니다.

## 폴더 구조

```
(레포 최상위)/
├── index.html          메인 화면 (지도 열기 버튼)
├── map.html             실제 지도 화면 (Leaflet 지도)
├── css/style.css        전체 디자인
├── js/config.js         캠퍼스 중심 좌표, 확대 정도, 이동 제한 범위
├── js/data.js            건물/쓰레기통/아나바다 위치 정보 (여기만 수정하면 됨)
├── js/script.js          지도 동작 스크립트 (건드릴 필요 거의 없음)
└── assets/icons/          map, info, pin, recycle, anabada 아이콘
```

## 내가(팀) 해야 할 일

### 1. 건물 좌표 찍기
1. `map.html`을 열고(GitHub Pages 배포 후) 우측 상단 **"좌표 찾기 모드"** 버튼을 누릅니다.
2. 지도에서 건물 위치를 클릭하면 화면 아래에 `lat: 35.5447, lng: 129.2564` 같은 좌표가 뜹니다.
3. 이 값을 `js/data.js`의 해당 건물 항목에 그대로 넣으면 됩니다.

> 지금 `js/data.js`에 들어있는 좌표는 대략적인 추정치입니다. 위 방법으로 실제 위치를 다시
> 찍어서 정확한 좌표로 교체해주세요.

### 2. `js/data.js`에 건물 정보 채워 넣기
```js
{
  id: "bldg-01",
  name: "행정본관",           // 화면에 보일 건물 이름
  number: "26호관",            // 호관 번호
  lat: 35.5447,                 // 좌표 찾기 모드에서 확인한 값
  lng: 129.2564,
  hasTrashBin: true,            // 이 건물에 분리배출함이 있으면 true
  trashInfo: "1층 로비 옆 / 3층 엘리베이터 앞", // info 아이콘 눌렀을 때 보일 설명
},
```
- `hasTrashBin: true`인 건물은 지도에 recycle 아이콘이 자동으로 옆에 같이 표시됩니다.
- 건물명·호관번호·층별정보는 학교 공식 캠퍼스맵 페이지(ulsan.ac.kr → 캠퍼스맵)의
  건물 목록·층별안내 텍스트를 그대로 참고해서 채우면 됩니다.

### 3. 아나바다 등 특수 지점 확인
`SPECIAL_SPOTS`에 아나바다 행사장이 "도서관 신관~본관 사이"로 미리 넣어져 있습니다.
좌표 찾기 모드로 정확한 위치를 다시 찍어서 lat/lng 값만 맞게 조정하면 됩니다.

### 4. (선택) 지도 확대 정도·이동 범위 조정
`js/config.js`에서:
- `CAMPUS_ZOOM`: 숫자가 클수록 확대됨 (15~18 정도가 캠퍼스 규모에 적당)
- `CAMPUS_BOUNDS`: 지도를 이 범위 밖으로 드래그해서 못 나가게 막는 사각형 경계

## GitHub Pages로 배포하는 방법

1. 이 폴더 안의 파일 전부를 **레포 최상위**에 업로드
   (폴더째 올리지 말고, `index.html`/`map.html`/`css`/`js`/`assets`가 레포 바로 아래
   보이도록 — 즉 `저장소이름/index.html`이지 `저장소이름/green-campus-map/index.html`이
   아니어야 함)
2. 레포의 **Settings → Pages** 이동
3. **Branch**를 `main`, 폴더는 `/ (root)`로 설정 후 저장
4. `https://아이디.github.io/저장소이름/` 주소로 접속하면 바로 확인 가능
   (API 키 관련 설정이 없으므로 이 단계 이후 별도 대기 없이 바로 작동합니다)

## 팀원과 같이 작업하기
- GitHub 레포 Settings → Collaborators에 팀원 계정 추가
- 주로 `js/data.js`(건물 정보)만 수정하면 되므로 충돌이 거의 없습니다

## 나중에 확장하고 싶다면 (지금은 구현 안 함)
- **내 위치(pin.png) 표시**: `js/script.js`의 `renderMyLocationPin(lat, lng)` 함수가
  이미 준비되어 있습니다. `navigator.geolocation.getCurrentPosition()`으로 받은 좌표를
  그대로 넣어 호출하면 바로 동작합니다.
- 지도 스타일(색감, 라벨 밀도 등)을 더 세밀하게 바꾸고 싶다면 타일 서버를 다른 무료
  OSM 기반 스타일(예: CartoDB Positron)로 교체할 수 있습니다. `js/script.js`의
  `L.tileLayer(...)` 안 URL만 바꾸면 됩니다.
