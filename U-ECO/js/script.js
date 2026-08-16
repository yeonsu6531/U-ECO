/* =========================================================
   Green Campus Map - 동작 스크립트 (Kakao Map 실시간 API)
   =========================================================
   정적 이미지 캡처 대신, 카카오맵을 실시간으로 불러온 뒤
   그 위에 우리 데이터(data.js)로 커스텀 마커를 얹는 방식입니다.
   이렇게 하면 캡처 이미지를 쓸 때 생기는 저작권 문제가 없습니다.
========================================================= */

let map; // 카카오맵 인스턴스 (전역)
let coordModeOn = false;

// map.html에서 카카오 SDK 로드가 끝나면 이 함수가 호출됩니다.
function initMap() {
  const container = document.getElementById("kakaoMap");
  const options = {
    center: new kakao.maps.LatLng(CAMPUS_CENTER.lat, CAMPUS_CENTER.lng),
    level: CAMPUS_LEVEL,
  };
  map = new kakao.maps.Map(container, options);

  // 캠퍼스 범위 밖으로 너무 멀리 나가지 못하게 살짝 막아줌
  const bounds = new kakao.maps.LatLngBounds(
    new kakao.maps.LatLng(CAMPUS_BOUNDS.sw.lat, CAMPUS_BOUNDS.sw.lng),
    new kakao.maps.LatLng(CAMPUS_BOUNDS.ne.lat, CAMPUS_BOUNDS.ne.lng)
  );
  kakao.maps.event.addListener(map, "dragend", () => {
    if (!bounds.contain(map.getCenter())) {
      map.setCenter(new kakao.maps.LatLng(CAMPUS_CENTER.lat, CAMPUS_CENTER.lng));
    }
  });

  renderBuildingPins();
  renderSpecialSpots();
  setupCoordFinder();
}

// ---------- 커스텀 마커(오버레이) 만들기 ----------

function createOverlay({ lat, lng, iconSrc, label, size, onClick }) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "pin";
  el.innerHTML = `
    <img src="${iconSrc}" alt="${label}" style="width:${size || 34}px;height:${size || 34}px;" />
    <span class="pin-label">${label}</span>
  `;
  el.addEventListener("click", onClick);

  const overlay = new kakao.maps.CustomOverlay({
    position: new kakao.maps.LatLng(lat, lng),
    content: el,
    yAnchor: 1, // 아이콘 뾰족한 아래쪽이 실제 좌표를 가리키도록
  });
  overlay.setMap(map);
  return overlay;
}

function renderBuildingPins() {
  CAMPUS_BUILDINGS.forEach((b) => {
    createOverlay({
      lat: b.lat,
      lng: b.lng,
      iconSrc: "assets/icons/map.png",
      label: `${b.number} ${b.name}`,
      onClick: () => openBuildingModal(b),
    });

    if (b.hasTrashBin) {
      // 살짝 옆으로 오프셋을 줘서 겹치지 않게 표시
      createOverlay({
        lat: b.lat + 0.00012,
        lng: b.lng + 0.00012,
        iconSrc: "assets/icons/recycle.png",
        label: "분리배출함 있음",
        size: 28,
        onClick: () => openBuildingModal(b),
      });
    }
  });
}

function renderSpecialSpots() {
  SPECIAL_SPOTS.forEach((s) => {
    const iconSrc = s.type === "anabada" ? "assets/icons/anabada.png" : "assets/icons/pin.png";
    createOverlay({
      lat: s.lat,
      lng: s.lng,
      iconSrc,
      label: s.name,
      size: 30,
      onClick: () => openSpotModal(s),
    });
  });
}

// 내 위치(pin.png) 표시 — 지금은 사용하지 않지만,
// 나중에 Geolocation API를 붙이면 이 함수만 호출하면 됩니다.
function renderMyLocationPin(lat, lng) {
  createOverlay({
    lat,
    lng,
    iconSrc: "assets/icons/pin.png",
    label: "내 위치",
    size: 30,
    onClick: () => {},
  });
}

// ---------- 건물 팝업 ----------

const buildingModal = document.getElementById("buildingModal");
const modalNumber = document.getElementById("modalNumber");
const modalName = document.getElementById("modalName");
const trashSection = document.getElementById("trashSection");
const infoBtn = document.getElementById("infoBtn");
const trashDetail = document.getElementById("trashDetail");

function openBuildingModal(building) {
  modalNumber.textContent = building.number;
  modalName.textContent = building.name;
  trashDetail.classList.add("hidden");
  trashDetail.textContent = building.trashInfo;
  trashSection.classList.toggle("hidden", !building.hasTrashBin);
  buildingModal.classList.remove("hidden");
}

infoBtn.addEventListener("click", () => {
  trashDetail.classList.toggle("hidden");
});

document.getElementById("modalClose").addEventListener("click", () => {
  buildingModal.classList.add("hidden");
});

// ---------- 특수 지점 팝업 (아나바다 등) ----------

const spotModal = document.getElementById("spotModal");
const spotName = document.getElementById("spotName");
const spotDesc = document.getElementById("spotDesc");

function openSpotModal(spot) {
  spotName.textContent = spot.name;
  spotDesc.textContent = spot.description;
  spotModal.classList.remove("hidden");
}

document.getElementById("spotModalClose").addEventListener("click", () => {
  spotModal.classList.add("hidden");
});

// ---------- 좌표 찾기 모드 (건물 좌표를 알아낼 때만 사용) ----------

function setupCoordFinder() {
  const coordModeBtn = document.getElementById("coordModeBtn");
  const coordReadout = document.getElementById("coordReadout");

  coordModeBtn.addEventListener("click", () => {
    coordModeOn = !coordModeOn;
    coordModeBtn.classList.toggle("active", coordModeOn);
    coordReadout.textContent = coordModeOn
      ? "지도를 클릭하면 좌표(lat, lng)가 여기에 표시돼요. data.js에 그대로 복사해 넣으세요."
      : "";
  });

  kakao.maps.event.addListener(map, "click", (mouseEvent) => {
    if (!coordModeOn) return;
    const latlng = mouseEvent.latLng;
    const text = `lat: ${latlng.getLat().toFixed(6)}, lng: ${latlng.getLng().toFixed(6)}`;
    coordReadout.textContent = text;
    console.log(text);
  });
}
