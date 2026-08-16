/* =========================================================
   Green Campus Map - 데이터 설정 파일
   =========================================================
   이 파일 하나만 수정하면 지도에 표시되는 모든 정보가 바뀝니다.
   좌표(lat, lng)는 실제 위도/경도입니다.

   좌표를 알아내는 방법 (아주 쉬움):
   1. map.html을 열고 우측 상단 "좌표 찾기 모드" 버튼을 켭니다.
   2. 지도에서 원하는 건물 위치를 클릭하면
      화면 아래와 콘솔(F12)에 lat, lng 값이 바로 찍힙니다.
   3. 그 값을 그대로 아래 각 건물 항목에 복사해 넣으면 됩니다.

   (참고: 카카오맵 웹사이트에서 건물을 우클릭해도
    "여기 좌표 복사" 메뉴로 바로 좌표를 얻을 수 있습니다.)
========================================================= */

const CAMPUS_BUILDINGS = [
  {
    id: "bldg-01",
    name: "행정본관",
    number: "26호관",
    lat: 35.5447,
    lng: 129.2564,
    hasTrashBin: true,
    trashInfo: "1층 로비 옆 / 3층 엘리베이터 앞 분리배출함(플라스틱·캔·종이 구분)",
  },
  {
    id: "bldg-02",
    name: "아산도서관 신관",
    number: "40호관",
    lat: 35.5453,
    lng: 129.2558,
    hasTrashBin: true,
    trashInfo: "1층 출입구 우측 / 지하 1층 휴게공간 분리배출함",
  },
  {
    id: "bldg-03",
    name: "학생회관",
    number: "09호관",
    lat: 35.5462,
    lng: 129.2570,
    hasTrashBin: true,
    trashInfo: "1층 식당 입구 앞 분리배출함, 종이컵 전용함 별도 비치",
  },
  {
    id: "bldg-04",
    name: "전기컴퓨터공학관",
    number: "07호관",
    lat: 35.5459,
    lng: 129.2548,
    hasTrashBin: false,
    trashInfo: "",
  },
];

// 쓰레기통이 있는 건물만 자동으로 recycle 핀이 찍힙니다 (hasTrashBin: true 기준)

const SPECIAL_SPOTS = [
  {
    id: "anabada-01",
    type: "anabada",
    name: "아나바다 행사장",
    lat: 35.5451,
    lng: 129.2561, // 도서관 신관 ~ 본관 사이
    description: "도서관 신관 ~ 본관 사이 광장",
  },
];

/* 내 위치(pin) 기능은 이번 버전에서 사용하지 않습니다.
   나중에 켜고 싶으면 script.js의 renderMyLocationPin(lat, lng) 함수를
   navigator.geolocation.getCurrentPosition() 결과로 호출하면 바로 동작합니다. */
