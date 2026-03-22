// Facial Recognition & Athlete Matching System
let faceDetector = null;
let isFaceDetecting = false;

// Initialize face detection model
async function initFaceDetection() {
  try {
    if (typeof ml5 === 'undefined') {
      console.error("ml5.js not loaded");
      return;
    }
    // ml5.js의 실제 face detection API 사용
    faceDetector = await ml5.faceApi();
    console.log("Face detection model loaded successfully");
  } catch (error) {
    console.error("Face detection model failed to load:", error);
    alert("얼굴 감지 모델 로드 실패. 페이지를 새로고침해주세요.");
  }
}

// Detect faces in captured image
async function detectFaceInCapture() {
  if (!faceDetector) {
    console.error("Face detector not initialized");
    return null;
  }

  try {
    const canvas = document.getElementById("camera-canvas");
    if (!canvas) {
      console.error("Canvas element not found");
      return null;
    }

    // faceApi.detect() 사용
    const predictions = await faceDetector.detect(canvas);
    
    if (predictions && predictions.length > 0) {
      console.log("Face detected:", predictions[0]);
      return predictions[0];
    } else {
      console.log("No face detected in canvas");
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
    console.error("Missing elements or data for display", {
      resultSection: !!resultSection,
      athlete: !!athlete,
      shoe: !!shoe
    });
    return;
  }

  try {
    // Set athlete information
    const athleteName = document.getElementById("result-athlete-name");
    const athleteNation = document.getElementById("result-athlete-nation");
    const athleteBio = document.getElementById("result-athlete-bio");
    const athleteAchievements = document.getElementById("result-athlete-achievements");
    const athleteImage = document.getElementById("result-athlete-image");

    if (athleteName) athleteName.textContent = athlete.name;
    if (athleteNation) athleteNation.textContent = `🇰🇪 ${athlete.nation}`;
    if (athleteBio) athleteBio.textContent = athlete.bio;
    if (athleteAchievements) athleteAchievements.textContent = athlete.achievements;
    if (athleteImage) {
      athleteImage.src = `../assets/images/athletes/${athlete.image}`;
      athleteImage.alt = athlete.name;
      console.log("Athlete image path:", athleteImage.src);
    }

    // Set shoe information
    const shoeName = document.getElementById("result-shoe-name");
    const shoeBrand = document.getElementById("result-shoe-brand");
    const shoeFeatures = document.getElementById("result-shoe-features");
    const shoePrice = document.getElementById("result-shoe-price");
    const shoeRating = document.getElementById("result-shoe-rating");
    const shoeImage = document.getElementById("result-shoe-image");

    if (shoeName) shoeName.textContent = shoe.name;
    if (shoeBrand) shoeBrand.textContent = `${shoe.brand}`;
    if (shoeFeatures) shoeFeatures.textContent = shoe.features;
    if (shoePrice) shoePrice.textContent = shoe.price;
    if (shoeRating) shoeRating.textContent = shoe.rating;
    if (shoeImage) {
      shoeImage.src = `../assets/images/shoes/${shoe.image}`;
      shoeImage.alt = shoe.name;
      console.log("Shoe image path:", shoeImage.src);
    }

    // Show result section
    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    
    console.log("Match result displayed successfully");
  } catch (error) {
    console.error("Error displaying match result:", error);
  }
}

// Determine gender based on face detection (simplified)
function determineeGender(faceData) {
  // This is a simplified version - in production, use actual ML model
  // For now, we'll alternate or use random selection
  const random = Math.random();
  return random > 0.5 ? "M" : "F";
}

// 테스트 함수 - 결과 표시 테스트
function testDisplayResult() {
  console.log("=== Testing Display Result ===");
  
  if (!window.MFMAthletes || !window.MFMShoes) {
    console.error("Data not loaded");
    return;
  }

  const testAthlete = window.MFMAthletes[0];
  const testShoe = window.MFMShoes[0];
  
  console.log("Test athlete:", testAthlete);
  console.log("Test shoe:", testShoe);
  
  displayMatchResult(testAthlete, testShoe);
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
  
  if (!video || !canvas) {
    console.error("Video or canvas element not found");
    return;
  }

  // 비디오가 준비되었는지 확인
  if (video.readyState !== video.HAVE_ENOUGH_DATA) {
    if (status) {
      status.textContent = "⚠️ 카메라가 준비 중입니다. 잠시 후 다시 시도해주세요.";
    }
    return;
  }
  
  try {
    // 캡처
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    console.log("Canvas captured:", canvas.width, "x", canvas.height);
    
    if (status) {
      status.textContent = "🔍 얼굴을 분석 중입니다...";
    }

    // 얼굴 감지
    const faceDetected = await detectFaceInCapture();
    
    if (!faceDetected) {
      if (status) {
        status.textContent = "❌ 얼굴을 감지하지 못했습니다. 밝은 곳에서 정면을 향해 다시 시도해주세요.";
      }
      return;
    }

    // 성별 판단
    const gender = determineeGender(faceDetected);
    console.log("Detected gender:", gender);
    
    // 선수 매칭
    const matchedAthlete = matchAthlete(gender);
    if (!matchedAthlete) {
      if (status) {
        status.textContent = "매칭 가능한 선수가 없습니다.";
      }
      return;
    }

    console.log("Matched athlete:", matchedAthlete.name);

    // 신발 정보 조회
    const shoe = getShoeInfo(matchedAthlete.shoeId);
    if (!shoe) {
      if (status) {
        status.textContent = "신발 정보를 찾을 수 없습니다.";
      }
      console.error("Shoe not found for ID:", matchedAthlete.shoeId);
      return;
    }

    console.log("Matched shoe:", shoe.name);

    // 결과 표시
    if (status) {
      status.textContent = `✅ 분석 완료! ${matchedAthlete.name}과 닮았습니다.`;
    }
    
    displayMatchResult(matchedAthlete, shoe);
    
  } catch (error) {
    console.error("캡처/분석 오류:", error);
    if (status) {
      status.textContent = "❌ 분석 중 오류가 발생했습니다. 콘솔을 확인해주세요.";
    }
  }
}

// 카메라 버튼 이벤트
function setupCameraButtons() {
  const startBtn = document.getElementById("camera-start");
  const stopBtn = document.getElementById("camera-stop");
  const captureBtn = document.getElementById("camera-capture");
  const resetBtn = document.getElementById("reset-match");
  
  console.log("Button elements check:", {
    startBtn: !!startBtn,
    stopBtn: !!stopBtn,
    captureBtn: !!captureBtn,
    resetBtn: !!resetBtn
  });
  
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      console.log("Start camera button clicked");
      initCamera();
    });
  }
  if (stopBtn) {
    stopBtn.addEventListener("click", () => {
      console.log("Stop camera button clicked");
      stopCamera();
    });
  }
  if (captureBtn) {
    captureBtn.addEventListener("click", () => {
      console.log("Capture button clicked");
      captureAndAnalyze();
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      console.log("Reset button clicked");
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
  console.log("=== Marathon Face Match Initialization ===");
  
  // 데이터 확인
  if (window.MFMAthletes) {
    console.log("✅ Athletes loaded:", window.MFMAthletes.length);
    console.log("Athletes:", window.MFMAthletes.map(a => a.name));
  } else {
    console.warn("❌ Athletes data not found");
  }

  if (window.MFMShoes) {
    console.log("✅ Shoes loaded:", window.MFMShoes.length);
    console.log("Shoes:", window.MFMShoes.map(s => s.name));
  } else {
    console.warn("❌ Shoes data not found");
  }
  
  // 테마 토글 초기화
  initThemeToggle();
  
  // ml5.js 확인
  if (typeof ml5 !== "undefined") {
    console.log("✅ ml5.js loaded");
    initFaceDetection();
  } else {
    console.warn("⚠️ ml5.js not loaded yet - will retry");
    // ml5.js가 비동기로 로드될 때 재시도
    setTimeout(() => {
      if (typeof ml5 !== "undefined") {
        console.log("✅ ml5.js loaded (delayed)");
        initFaceDetection();
      } else {
        console.error("❌ ml5.js failed to load after 2 seconds");
      }
    }, 2000);
  }
  
  // 카메라 버튼 설정
  setupCameraButtons();
  console.log("=== Initialization Complete ===");
});
