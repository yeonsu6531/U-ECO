/* =========================================================
   Green Campus Map - 동작 스크립트 (Leaflet + OpenStreetMap)
   =========================================================
   API 키 없이 바로 동작합니다.
========================================================= */

let map; // Leaflet 지도 인스턴스

function initMap() {
  const bounds = L.latLngBounds(
    [CAMPUS_BOUNDS.sw.lat, CAMPUS_BOUNDS.sw.lng],
    [CAMPUS_BOUNDS.ne.lat, CAMPUS_BOUNDS.ne.lng]
  );

  map = L.map("leafletMap", {
    center: [CAMPUS_CENTER.lat, CAMPUS_CENTER.lng],
    zoom: CAMPUS_ZOOM,
    maxBounds: bounds,
    maxBoundsViscosity: 0.6, // 경계 밖으로 드래그하면 살짝 저항감을 주며 되돌림
    minZoom: 15,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  renderBuildingPins();
  renderSpecialSpots();
  setupCoordFinder();
}

// ---------- 커스텀 마커 만들기 ----------

function makeDivIcon(iconSrc, size) {
  const s = size || 34;
  return L.divIcon({
    html: `<img src="${iconSrc}" style="width:${s}px;height:${s}px;display:block;" />`,
    className: "leaflet-custom-pin",
    iconSize: [s, s],
    iconAnchor: [s / 2, s], // 아이콘 하단 중앙이 실제 좌표를 가리키도록
  });
}

function addMarker({ lat, lng, iconSrc, label, size, onClick }) {
  const marker = L.marker([lat, lng], { icon: makeDivIcon(iconSrc, size) }).addTo(map);
  marker.bindTooltip(label, { direction: "top", offset: [0, -(size || 34)] });
  marker.on("click", onClick);
  return marker;
}

function renderBuildingPins() {
  CAMPUS_BUILDINGS.forEach((b) => {
    addMarker({
      lat: b.lat,
      lng: b.lng,
      iconSrc: "assets/icons/recycle.png",
      label: `${b.number} ${b.name}`,
      onClick: () => openBuildingModal(b),
    });
  });
}

function renderSpecialSpots() {
  SPECIAL_SPOTS.forEach((s) => {
    const iconSrc = s.type === "anabada" ? "assets/icons/anabada.png" : "assets/icons/pin.png";
    addMarker({
      lat: s.lat,
      lng: s.lng,
      iconSrc,
      label: s.name,
      size: 30,
      onClick: () => openSpotModal(s),
    });
  });
}

// 내 위치(pin.png) 표시 — 나중에 Geolocation API 붙일 때 이 함수만 호출하면 됩니다.
function renderMyLocationPin(lat, lng) {
  addMarker({
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

// ---------- 좌표 찾기 모드 ----------

function setupCoordFinder() {
  const coordModeBtn = document.getElementById("coordModeBtn");
  const coordReadout = document.getElementById("coordReadout");
  let coordModeOn = false;

  coordModeBtn.addEventListener("click", () => {
    coordModeOn = !coordModeOn;
    coordModeBtn.classList.toggle("active", coordModeOn);
    coordReadout.textContent = coordModeOn
      ? "지도를 클릭하면 좌표(lat, lng)가 여기에 표시돼요. data.js에 그대로 복사해 넣으세요."
      : "";
  });

  map.on("click", (e) => {
    if (!coordModeOn) return;
    const text = `lat: ${e.latlng.lat.toFixed(6)}, lng: ${e.latlng.lng.toFixed(6)}`;
    coordReadout.textContent = text;
    console.log(text);
  });
}

// ---------- 시작 ----------
initMap();
