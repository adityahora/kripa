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
const slides = document.querySelectorAll(".slide");
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
let currentSlide = 0;

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
  audio.paused ? audio.play() : audio.pause();
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

// Slide Functions
const showSlide = (index) => {
  slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
  document.getElementById("prevBtn").classList.toggle("hidden", index === 0);
  document.getElementById("nxtBtn").classList.toggle("hidden", index === slides.length - 1);
};

document.getElementById("nxtBtn").addEventListener("click", () => updateSlide(1));
document.getElementById("prevBtn").addEventListener("click", () => updateSlide(-1));

const updateSlide = (direction) => {
  currentSlide = Math.min(Math.max(currentSlide + direction, 0), slides.length - 1);
  showSlide(currentSlide);
};

// UI Interaction Functions
const showMessage = () => message.style.display = "block";

const hover_text = () => {
  [nextBtn, prevBtn, timeDisplay].forEach(el => el.classList.remove("hidden"));
  flick.innerHTML = "";
  seekBar.style.display = "block";
};

// Initialization
showSlide(currentSlide);
