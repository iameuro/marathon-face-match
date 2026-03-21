// 다크모드 토글 기능
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme") || "dark-mode";
  
  // 저장된 테마 적용
  document.body.className = savedTheme;
  updateThemeToggleIcon(savedTheme);
  
  // 토글 버튼 이벤트
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.className;
      const newTheme = currentTheme === "dark-mode" ? "light-mode" : "dark-mode";
      
      document.body.className = newTheme;
      localStorage.setItem("theme", newTheme);
      updateThemeToggleIcon(newTheme);
    });
  }
}

function updateThemeToggleIcon(theme) {
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.textContent = theme === "dark-mode" ? "☀️" : "🌙";
  }
}

// 카메라 기능
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: "user" } 
    });
    const video = document.getElementById("camera-video");
    if (video) {
      video.srcObject = stream;
      console.log("카메라 접근 성공");
    }
  } catch (error) {
    console.error("카메라 접근 실패:", error);
    alert("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
  }
}

// 카메라 중지
function stopCamera() {
  const video = document.getElementById("camera-video");
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    console.log("카메라 중지됨");
  }
}

// 카메라 스냅샷 캡처
function captureSnapshot() {
  const video = document.getElementById("camera-video");
  const canvas = document.getElementById("camera-canvas");
  
  if (!video || !canvas) return;
  
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  
  console.log("스냅샷 캡처됨");
  return canvas.toDataURL("image/jpeg");
}

// 카메라 버튼 이벤트
function setupCameraButtons() {
  const startBtn = document.getElementById("camera-start");
  const stopBtn = document.getElementById("camera-stop");
  const captureBtn = document.getElementById("camera-capture");
  
  if (startBtn) {
    startBtn.addEventListener("click", initCamera);
  }
  if (stopBtn) {
    stopBtn.addEventListener("click", stopCamera);
  }
  if (captureBtn) {
    captureBtn.addEventListener("click", () => {
      const snapshot = captureSnapshot();
      console.log("스냅샷 URL:", snapshot);
    });
  }
}

// DOM 로드 완료 시 실행
document.addEventListener("DOMContentLoaded", () => {
  console.log("Marathon Face Match scaffold ready");
  if (window.MFMAthletes) {
    console.log("Athletes loaded:", window.MFMAthletes.length);
  }
  
  // 테마 토글 초기화
  initThemeToggle();
  
  // 카메라 버튼 설정
  setupCameraButtons();
});
