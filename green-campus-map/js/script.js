/* =========================================================
   Green Campus Map - 동작 스크립트
   건물/지점을 data.js에서 읽어와 지도 위에 핀으로 그리고,
   클릭하면 팝업을 띄웁니다.
========================================================= */

const pinLayer = document.getElementById("pinLayer");
const mapWrap = document.getElementById("mapWrap");

// ---------- 핀 그리기 ----------

function createPinEl({ x, y, iconSrc, label, extraClass, onClick }) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `pin ${extraClass || ""}`.trim();
  btn.style.left = `${x}%`;
  btn.style.top = `${y}%`;
  btn.innerHTML = `
    <img src="${iconSrc}" alt="${label}" />
    <span class="pin-label">${label}</span>
  `;
  btn.addEventListener("click", onClick);
  return btn;
}

function renderBuildingPins() {
  CAMPUS_BUILDINGS.forEach((b) => {
    // 건물 자체를 나타내는 지도 핀
    pinLayer.appendChild(
      createPinEl({
        x: b.x,
        y: b.y,
        iconSrc: "assets/icons/map.png",
        label: `${b.number} ${b.name}`,
        extraClass: "pin-building",
        onClick: () => openBuildingModal(b),
      })
    );

    // 쓰레기통이 있는 건물은 recycle 핀을 살짝 옆에 추가로 표시
    if (b.hasTrashBin) {
      pinLayer.appendChild(
        createPinEl({
          x: b.x + 2.2,
          y: b.y - 1.5,
          iconSrc: "assets/icons/recycle.png",
          label: "분리배출함 있음",
          extraClass: "pin-recycle",
          onClick: () => openBuildingModal(b),
        })
      );
    }
  });
}

function renderSpecialSpots() {
  SPECIAL_SPOTS.forEach((s) => {
    const iconSrc =
      s.type === "anabada" ? "assets/icons/anabada.png" : "assets/icons/pin.png";
    pinLayer.appendChild(
      createPinEl({
        x: s.x,
        y: s.y,
        iconSrc,
        label: s.name,
        extraClass: `pin-${s.type}`,
        onClick: () => openSpotModal(s),
      })
    );
  });
}

// 내 위치(pin.png) 표시 자리 — 지금은 사용하지 않지만,
// 나중에 Geolocation API 붙일 때 이 함수만 채우면 됩니다.
function renderMyLocationPin(x, y) {
  pinLayer.appendChild(
    createPinEl({
      x,
      y,
      iconSrc: "assets/icons/pin.png",
      label: "내 위치",
      extraClass: "pin-mylocation",
      onClick: () => {},
    })
  );
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

const coordModeBtn = document.getElementById("coordModeBtn");
const coordReadout = document.getElementById("coordReadout");
let coordModeOn = false;

coordModeBtn.addEventListener("click", () => {
  coordModeOn = !coordModeOn;
  coordModeBtn.classList.toggle("active", coordModeOn);
  coordReadout.textContent = coordModeOn
    ? "지도를 클릭하면 좌표(%)가 여기에 표시돼요. data.js에 그대로 복사해 넣으세요."
    : "";
});

mapWrap.addEventListener("click", (e) => {
  if (!coordModeOn) return;
  // 핀 버튼을 클릭한 거면 좌표 찍기를 하지 않음
  if (e.target.closest(".pin")) return;

  const rect = mapWrap.getBoundingClientRect();
  const x = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
  const y = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
  const text = `x: ${x}, y: ${y}`;
  coordReadout.textContent = text;
  console.log(text);
});

// ---------- 초기 렌더 ----------

renderBuildingPins();
renderSpecialSpots();
