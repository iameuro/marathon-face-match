// Facial Recognition & Athlete Matching System
let faceDetector = null;
let isFaceDetecting = false;

// Initialize face detection model
async function initFaceDetection() {
  try {
    faceDetector = await ml5.faceDetect('front-face', { returnTensors: false });
    console.log("Face detection model loaded");
  } catch (error) {
    console.error("Face detection model failed to load:", error);
  }
}

// Detect faces in captured image
async function detectFaceInCapture(imageData) {
  if (!faceDetector) {
    console.error("Face detector not initialized");
    return null;
  }

  try {
    const canvas = document.getElementById("camera-canvas");
    const predictions = await faceDetector.estimateFaces(canvas);
    
    if (predictions && predictions.length > 0) {
      console.log("Face detected:", predictions[0]);
      return predictions[0];
    } else {
      console.log("No face detected");
      return null;
    }
  } catch (error) {
    console.error("Face detection error:", error);
    return null;
  }
}

// Athlete matching logic based on gender (random for now, can be enhanced with ML)
function matchAthlete(gender) {
  const athletes = window.MFMAthletes;
  
  if (!athletes) {
    console.error("Athletes data not loaded");
    return null;
  }

  // Filter athletes by gender
  const maleAthletes = athletes.filter(a => a.gender === "M");
  const femaleAthletes = athletes.filter(a => a.gender === "F");
  
  const targetAthletes = gender === "M" ? maleAthletes : femaleAthletes;
  
  if (targetAthletes.length === 0) {
    console.error("No athletes found for gender:", gender);
    return null;
  }

  // Random selection (can be enhanced with facial feature analysis)
  const randomIndex = Math.floor(Math.random() * targetAthletes.length);
  return targetAthletes[randomIndex];
}

// Get shoe information
function getShoeInfo(shoeId) {
  if (!window.MFMShoes) return null;
  return window.MFMShoes.find(shoe => shoe.id === shoeId);
}

// Display match result
function displayMatchResult(athlete, shoe) {
  const resultSection = document.getElementById("match-result");
  
  if (!resultSection || !athlete || !shoe) {
    console.error("Missing elements or data for display");
    return;
  }

  // Set athlete information
  document.getElementById("result-athlete-name").textContent = athlete.name;
  document.getElementById("result-athlete-nation").textContent = `🇰🇪 ${athlete.nation}`;
  document.getElementById("result-athlete-bio").textContent = athlete.bio;
  document.getElementById("result-athlete-achievements").textContent = athlete.achievements;
  document.getElementById("result-athlete-image").src = `../assets/images/athletes/${athlete.image}`;
  document.getElementById("result-athlete-image").alt = athlete.name;

  // Set shoe information
  document.getElementById("result-shoe-name").textContent = shoe.name;
  document.getElementById("result-shoe-brand").textContent = `${shoe.brand}`;
  document.getElementById("result-shoe-features").textContent = shoe.features;
  document.getElementById("result-shoe-price").textContent = shoe.price;
  document.getElementById("result-shoe-rating").textContent = shoe.rating;
  document.getElementById("result-shoe-image").src = `../assets/images/shoes/${shoe.image}`;
  document.getElementById("result-shoe-image").alt = shoe.name;

  // Show result section
  resultSection.style.display = "block";
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Determine gender based on face detection (simplified)
function determineeGender(faceData) {
  // This is a simplified version - in production, use actual ML model
  // For now, we'll alternate or use random selection
  const random = Math.random();
  return random > 0.5 ? "M" : "F";
}

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
      const status = document.getElementById("face-detection-status");
      if (status) {
        status.textContent = "카메라가 준비되었습니다. '스냅샷 캡처 & 분석' 버튼을 클릭하세요.";
      }
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
    const status = document.getElementById("face-detection-status");
    if (status) {
      status.textContent = "카메라가 중지되었습니다.";
    }
  }
}

// 카메라 스냅샷 캡처 및 분석
async function captureAndAnalyze() {
  const video = document.getElementById("camera-video");
  const canvas = document.getElementById("camera-canvas");
  const status = document.getElementById("face-detection-status");
  
  if (!video || !canvas) return;
  
  try {
    // 캡처
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    if (status) {
      status.textContent = "얼굴을 분석 중입니다...";
    }

    // 얼굴 감지
    const faceDetected = await detectFaceInCapture();
    
    if (!faceDetected) {
      if (status) {
        status.textContent = "얼굴을 감지하지 못했습니다. 다시 시도해주세요.";
      }
      alert("얼굴을 감지하지 못했습니다. 밝은 곳에서 정면을 향해 다시 시도해주세요.");
      return;
    }

    // 성별 판단
    const gender = determineeGender(faceDetected);
    
    // 선수 매칭
    const matchedAthlete = matchAthlete(gender);
    if (!matchedAthlete) {
      if (status) {
        status.textContent = "매칭 가능한 선수가 없습니다.";
      }
      return;
    }

    // 신발 정보 조회
    const shoe = getShoeInfo(matchedAthlete.shoeId);
    if (!shoe) {
      if (status) {
        status.textContent = "신발 정보를 찾을 수 없습니다.";
      }
      return;
    }

    // 결과 표시
    if (status) {
      status.textContent = `✅ 분석 완료! ${matchedAthlete.name}과 닮았습니다.`;
    }
    
    displayMatchResult(matchedAthlete, shoe);
    
  } catch (error) {
    console.error("캡처/분석 오류:", error);
    if (status) {
      status.textContent = "분석 중 오류가 발생했습니다.";
    }
  }
}

// 카메라 버튼 이벤트
function setupCameraButtons() {
  const startBtn = document.getElementById("camera-start");
  const stopBtn = document.getElementById("camera-stop");
  const captureBtn = document.getElementById("camera-capture");
  const resetBtn = document.getElementById("reset-match");
  
  if (startBtn) {
    startBtn.addEventListener("click", initCamera);
  }
  if (stopBtn) {
    stopBtn.addEventListener("click", stopCamera);
  }
  if (captureBtn) {
    captureBtn.addEventListener("click", captureAndAnalyze);
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document.getElementById("match-result").style.display = "none";
      const status = document.getElementById("face-detection-status");
      if (status) {
        status.textContent = "";
      }
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
  
  // 얼굴 감지 모델 초기화
  if (typeof ml5 !== "undefined") {
    initFaceDetection();
  } else {
    console.warn("ml5.js not loaded yet");
  }
  
  // 카메라 버튼 설정
  setupCameraButtons();
});
