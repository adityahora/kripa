const audio = document.getElementById("audio");
const seekBarFilled = document.getElementById("seek-bar-filled");
const timeDisplay = document.getElementById("timeDisplay");
const playPauseBtn = document.getElementById("playPauseBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("previousBtn");
const seekBar = document.getElementById("seekBar");
const flick = document.getElementById("flick");
const message = document.getElementById("message");
const progressBar = document.querySelector(".seek-bar");

// Song data
const songs = [
  "psiloveyou.mp3",
  "japanesedemin.mp3",
  "prettyboy.mp3",
  "overthemoon.mp3",
  "getyou.mp3",
  "gluesong.mp3",
];
let currentSongIndex = 0;

// Helper Functions
const updatePlayPauseButton = (isPlaying) => {
  playPauseBtn.classList.toggle("with-image", isPlaying);
  playPauseBtn.classList.toggle("with-image2", !isPlaying);
  playPauseBtn.classList.toggle("rotate", isPlaying);
};

const loadSong = (index) => {
  audio.src = songs[index];
  audio.load();
  audio.play();
  updatePlayPauseButton(true);
  resetSeekBar();
};

const resetSeekBar = () => {
  seekBarFilled.style.width = "0%";
  timeDisplay.innerText = "00:00";
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

let audioManuallyPaused = false;
let audioSystemPaused = false;

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => {});
    audioManuallyPaused = false;

    // Show UI elements
    prevBtn.classList.remove("hidden");
    nextBtn.classList.remove("hidden");
    flick.classList.add("hidden");
    timeDisplay.classList.remove("hidden");
    seekBar.style.display = "block";
  } else {
    audio.pause();
    audioManuallyPaused = true;
  }
  updatePlayPauseButton(!audio.paused);
});


audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  seekBarFilled.style.width = `${progress}%`;
  timeDisplay.innerText = formatTime(audio.currentTime);
});

seekBar.addEventListener("click", (event) => {
  const clickPosition = (event.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
  audio.currentTime = clickPosition * audio.duration;
});

nextBtn.addEventListener("click", () => changeSong(1));
prevBtn.addEventListener("click", () => changeSong(-1));
audio.addEventListener("ended", () => changeSong(1));

const changeSong = (direction) => {
  currentSongIndex = (currentSongIndex + direction + songs.length) % songs.length;
  loadSong(currentSongIndex);
  document.getElementById(direction === 1 ? "nextBtn" : "previousBtn").classList.add(direction === 1 ? "with-image3" : "with-image4");
};

// Slideshow setup
let slideIndex = 0;
let slideInterval;
let autoplayPaused = true; // Start paused

const slides = document.getElementsByClassName("slide");
const dots = document.getElementsByClassName("dot");

function showSlide(n) {
  for (const slide of slides) {
    const video = slide.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    slide.style.display = "none";
    slide.classList.remove("fade-in");
  }
  for (const dot of dots) dot.classList.remove("active");

  slideIndex = (n + slides.length) % slides.length;
  const currentSlide = slides[slideIndex];
  currentSlide.style.display = "block";
  void currentSlide.offsetWidth;
  currentSlide.classList.add("fade-in");
  dots[slideIndex].classList.add("active");

  const caption = document.getElementById("caption");
  caption.innerText = currentSlide.getAttribute("data-caption") || "";
  caption.classList.add("show");

const currentVideo = currentSlide.querySelector("video");
  if (currentVideo) {
    // Pause audio if playing
    if (!audio.paused) {
      audio.pause();
      updatePlayPauseButton(false);
      audioSystemPaused = true;
    }
    currentVideo.muted = false;
    currentVideo.play().catch(err => console.warn("Video autoplay blocked:", err));
  } else {
    // Resume audio if it was system-paused and user didn't manually pause
    if (audioSystemPaused && !audioManuallyPaused) {
      audio.play().catch(err => console.warn("Audio resume blocked:", err));
      updatePlayPauseButton(true);
      audioSystemPaused = false;
    }
  }

  document.getElementById("pslide").classList.toggle("hidden", slideIndex === 0);
}
  

function changeSlide(n) {
  clearInterval(slideInterval); // Stop autoplay while manually changing
  showSlide(slideIndex + n);
  if (!autoplayPaused) startAutoSlide(); // Restart autoplay if it's active
}

function currentSlide(n) {
  clearInterval(slideInterval);
  showSlide(n - 1);
  if (!autoplayPaused) startAutoSlide();
}

function startAutoSlide() {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => showSlide(slideIndex + 1), 60000);
}

function togglePause() {
  autoplayPaused = !autoplayPaused;
  const pauseButton = document.querySelector('.pause-btn');

  const currentSlide = slides[slideIndex];
  const currentVideo = currentSlide.querySelector("video");

  if (autoplayPaused) {
    clearInterval(slideInterval);
    pauseButton.innerText = '||'; // Play icon

    // Pause the video if present
    if (currentVideo && !currentVideo.paused) {
      currentVideo.pause();
    }
  } else {
    startAutoSlide();
    pauseButton.innerText = '▶'; // Pause icon

    // Resume video playback if present
    if (currentVideo && currentVideo.paused) {
      currentVideo.play().catch(err => {
        console.warn("Video couldn't autoplay on resume:", err);
      });
    }
  }

  pauseButton.style.opacity = '1';
  setTimeout(() => pauseButton.style.opacity = '0', 700);
}

window.onload = function() {
  // Show first slide but do NOT autoplay yet
  showSlide(slideIndex);

  const messageBox = document.getElementById('messageBox');
  const closeButton = document.getElementById('closeButton');

  // Disable scroll before closing the message
  document.body.style.overflow = 'hidden';

  closeButton.addEventListener('click', () => {
    messageBox.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling

    // Autoplay still paused at start, no auto slide here
    // User starts slideshow manually after game ends
  });
};
let dragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// --- Game variables ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const questionBox = document.getElementById("questionBox");
const questionText = document.getElementById("questionText");
const choicesDiv = document.getElementById("choices");
const feedback = document.getElementById("feedback");

let player = { x: 50, y: 300, width: 110, height: 80, speed: 9 };
let hearts = [];
let score = 0;
let frame = 0;
let currentQuestionIndex = 0;
let gamePaused = false;

// Mouse drag start
function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;   // ratio between internal and displayed width
  const scaleY = canvas.height / rect.height; // ratio between internal and displayed height

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  };
}

function getTouchPos(touchEvent) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const touch = touchEvent.touches[0];
  return {
    x: (touch.clientX - rect.left) * scaleX,
    y: (touch.clientY - rect.top) * scaleY
  };
}

// Then use these functions inside your dragging handlers

canvas.addEventListener('mousedown', e => {
  const pos = getMousePos(e);
  if (pos.x >= player.x && pos.x <= player.x + player.width &&
      pos.y >= player.y && pos.y <= player.y + player.height) {
    dragging = true;
  }
});

canvas.addEventListener('mousemove', e => {
  if (dragging) {
    const pos = getMousePos(e);
    player.x = pos.x - player.width / 2;
    player.y = pos.y - player.height / 2;
  }
});

canvas.addEventListener('mouseup', e => {
  dragging = false;
});

canvas.addEventListener('touchstart', e => {
  const pos = getTouchPos(e);
  if (pos.x >= player.x && pos.x <= player.x + player.width &&
      pos.y >= player.y && pos.y <= player.y + player.height) {
    dragging = true;
  }
});

canvas.addEventListener('touchmove', e => {
  if (dragging) {
    e.preventDefault(); // prevent scrolling while dragging
    const pos = getTouchPos(e);
    player.x = pos.x - player.width / 2;
    player.y = pos.y - player.height / 2;
  }
}, { passive: false });

canvas.addEventListener('touchend', e => {
  dragging = false;
});

// Placeholder questions
const questions = [
  {
    text: "When did we start dating?",
    choices: ["September 1", "October 1", "November 1"],
    correct: 1
  },
  {
    text: "How long have we been dating?",
    choices: ["10 months+", "11 months+", "1 year+"],
    correct: 0
  },
  {
    text: "What was the first text I sent you after 2 years?",
    choices: ["what's up", "thank you for existing", "i miss you"],
    correct: 1
  },
  {
    text: "When did we start liking each other?",
    choices: ["2021", "2022", "2023"],
    correct: 0
  },
  {
    text: "What's my favourite song?",
    choices: ["Let Down", "Lover you should have come over", "Najeek"],
    correct: 2
  }

  
];
const playerImg = new Image();
playerImg.src = "player.png";  // put the correct path

const heartImg = new Image();
heartImg.src = "heart.jpg";    // put the correct path

// Create hearts
function spawnHeart() {
  hearts.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 50),
    size: 50
  });
}

function drawPlayer() {
  ctx.save(); // Save current canvas state

  // Create an elliptical clipping region
  ctx.beginPath();
  ctx.ellipse(
    player.x + player.width / 2,  // centerX
    player.y + player.height / 2, // centerY
    player.width / 2,             // radiusX (horizontal radius)
    player.height / 2,            // radiusY (vertical radius)
    0,                            // rotation
    0, Math.PI * 2                 // startAngle, endAngle
  );
  ctx.clip();

  // Draw the image clipped inside the ellipse
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  ctx.restore(); // Restore canvas state (removes clipping)
}



function drawHearts() {
  ctx.fillStyle = "pink"; // fallback color if image not loaded yet
  hearts.forEach(h => {
    ctx.save();

    ctx.beginPath();
    // ellipse(centerX, centerY, radiusX, radiusY, rotation, startAngle, endAngle)
    ctx.ellipse(h.x, h.y, h.size, h.size*0.68, 0, 0, Math.PI * 2);
    ctx.clip();

    // Draw the heart image centered at (h.x, h.y)
    ctx.drawImage(heartImg, h.x - h.size, h.y - h.size, h.size * 2, h.size * 2);

    ctx.restore();
  });
}


// Update game
function update() {
  if (!gamePaused) {
    frame++;
    if (frame % 50 === 0) spawnHeart();

    hearts.forEach(h => h.x -= 4.5);
    hearts = hearts.filter(h => h.x + h.size > 0);

    hearts.forEach((h, i) => {
      if (player.x < h.x + h.size &&
          player.x + player.width > h.x &&
          player.y < h.y + h.size &&
          player.y + player.height > h.y) {
        score++;
        hearts.splice(i, 1);
        if (score % 15 === 0) showQuestion();

        if(score === 80){
          // End game and show slideshow
          document.getElementById("gameContainer").style.display = 'none';

          document.getElementById('slideshowContainer').style.display = 'block';
          document.getElementById('dots').style.display = 'block';


          // Show first slide and start autoplay
          autoplayPaused = false;
          showSlide(0);
          startAutoSlide();
        }
      }
    });
  }
}
function clampPlayerPosition() {
  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Render game
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawHearts();
  ctx.fillStyle = "black";
  ctx.fillText("Hearts: " + score, 10, 20);
}
let gameRunning = false;

const closeButton = document.getElementById('closeButton');
closeButton.addEventListener('click', () => {
  document.getElementById('messageBox').style.display = 'none';
  document.body.style.overflow = ''; // Enable scroll
  gameRunning = true; // Flag to start game loop
  gameLoop();         // Start the game loop now
});
// Game loop
function gameLoop() {
  if (!gameRunning) return;  // Stop game until started
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Show question popup
function showQuestion() {
  gamePaused = true;
  const q = questions[currentQuestionIndex % questions.length];
  questionText.textContent = q.text;
  choicesDiv.innerHTML = "";
  feedback.classList.add("hidden");

  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      if (i === q.correct) {
        currentQuestionIndex++;
        questionBox.classList.add("hidden");
        gamePaused = false;
        if (score >= 80) endGame();
      } else {
        feedback.textContent = "😢 Try again!";
        feedback.classList.remove("hidden");
      }
    };
    choicesDiv.appendChild(btn);
  });

  questionBox.classList.remove("hidden");
}

// End game function just hides game and shows slideshow, unused now because handled above
function endGame() {
  document.getElementById("gameContainer").style.display = 'none';
  document.querySelector('.slideshow-container').style.display = 'block';

  autoplayPaused = false;
  showSlide(0);
  startAutoSlide();
}

// Controls
window.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") player.x += player.speed;
  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowUp") player.y -= player.speed;
  if (e.key === "ArrowDown") player.y += player.speed;
});

playerImg.onload = () => {
  heartImg.onload = () => {
    gameLoop();  // start the game loop after images are loaded
  }
}
