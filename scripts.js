// Cached DOM elements for better performance
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

// Event Listeners
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    previousBtn.classList.remove("hidden");
    nextBtn.classList.remove("hidden");
    timeDisplay.classList.remove("hidden");
    seekBar.style.display = "block";
  } else {
    audio.pause();
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
let slideIndex = 0;
    let slideInterval;
    let autoplayPaused = true; // Autoplay starts as paused until user closes the message

    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");

    function showSlide(n) {
      for (const slide of slides) slide.style.display = "none";
      for (const dot of dots) dot.classList.remove("active");

      slideIndex = (n + slides.length) % slides.length;
      slides[slideIndex].style.display = "block";
      dots[slideIndex].classList.add("active");
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
      slideInterval = setInterval(() => showSlide(slideIndex + 1), 3000);
    }

    function togglePause() {
      autoplayPaused = !autoplayPaused;
      const pauseButton = document.querySelector('.pause-btn');

      if (autoplayPaused) {
        clearInterval(slideInterval);
        pauseButton.innerText = '||'; // Play icon
      } else {
        startAutoSlide();
        pauseButton.innerText = '▶'; // Pause icon
      }

      pauseButton.style.opacity = '1';
      setTimeout(() => pauseButton.style.opacity = '0', 700);
    }

    window.onload = function() {
      showSlide(slideIndex); // Show first slide but no autoplay yet

      const messageBox = document.getElementById('messageBox');
      const closeButton = document.getElementById('closeButton');

      // Disable scroll before closing the message
      document.body.style.overflow = 'hidden';

      closeButton.addEventListener('click', () => {
        messageBox.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling

        autoplayPaused = false;  // Allow autoplay
        startAutoSlide();        // Start autoplay now
      });
    };
