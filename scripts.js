
        // Variables
        var audio = document.getElementById("audio");
        var seekBarFilled = document.getElementById("seek-bar-filled");
        var timeDisplay = document.getElementById("timeDisplay");
        var playPauseBtn = document.getElementById("playPauseBtn");
        var nextBtn = document.getElementById("nextBtn");
        var seekBar = document.getElementById("seekBar");

        // Array of songs (you can add as many as you like)
        var songs = [
            "japanesedemin.mp3",
            "prettyboy.mp3", 
            "gluesong.mp3", // Add the actual file paths for your next songs
            "fadeintoyou.mp3"
        ];
        var currentSongIndex = 0;
        audio.addEventListener("ended", nextSong);
        // Function to show the message
        function showMessage() {
            document.getElementById("message").style.display = "block";
        }

        // Function to show and hide seek bar and time display after heart is clicked
        function hover_text() {
            document.getElementById("nextBtn").classList.remove("hidden");
            document.getElementById("timeDisplay").classList.remove("hidden");
            document.getElementById("flick").innerHTML = "";
            document.getElementById("seekBar").style.display = "block";
            // document.getElementById("timeDisplay").style.display = "block";

        }

        // Toggle play/pause functionality
        playPauseBtn.addEventListener("click", function() {
            if (audio.paused) {
                audio.play();
                playPauseBtn.classList.add("with-image");
                playPauseBtn.classList.remove("with-image2");
                playPauseBtn.classList.add("rotate");
            } else {
                audio.pause();
                playPauseBtn.classList.add("with-image2");
                playPauseBtn.classList.remove("rotate");
            }
        });

        // Update the seek bar and time display as audio plays
        audio.ontimeupdate = function () {
            var progress = (audio.currentTime / audio.duration) * 100;
            seekBarFilled.style.width = progress + "%";

            var minutes = Math.floor(audio.currentTime / 60);
            var seconds = Math.floor(audio.currentTime % 60);
            timeDisplay.innerText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        };

        // Set the audio position when clicking on the seek bar
        function setSeek(event) {
            var progressBar = document.querySelector(".seek-bar");
            var progressBarWidth = progressBar.offsetWidth; // Get the width of the progress bar
            var clickPosition = (event.clientX - progressBar.getBoundingClientRect().left) / progressBarWidth; // Adjust calculation
            audio.currentTime = clickPosition * audio.duration; // Update current time based on the position clicked
        }
        
        // Function to load the next song
        function nextSong() {
document.getElementById("nextBtn").classList.add("with-image);
            currentSongIndex = (currentSongIndex + 1) % songs.length; // Loop back to the first song if at the end
            audio.src = songs[currentSongIndex];
            audio.load(); // Load the new audio file
            audio.play(); 
            playPauseBtn.classList.add("with-image");// Update the button
            playPauseBtn.classList.add("rotate"); // Start rotation
            seekBarFilled.style.width = "0%"; // Reset the seek bar
            timeDisplay.innerText = "00:00"; // Reset the time display
        }
        
        var currentSlide = 0;
        var slides = document.querySelectorAll(".slide"); // Select all slides
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove("active");
                if (i === index) slide.classList.add("active");
            });
        
            // Hide/show buttons dynamically
            document.getElementById("prevBtn").classList.toggle("hidden", index === 0);
            document.getElementById("nxtBtn").classList.toggle("hidden", index === slides.length - 1);
        }
        
        function nextSlide() {
            if (currentSlide < slides.length - 1) {
                currentSlide++;
                showSlide(currentSlide);
            }
        }
        
        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                showSlide(currentSlide);
            }
        }
        
        showSlide(currentSlide);
