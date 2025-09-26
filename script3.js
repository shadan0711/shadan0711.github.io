console.log('lets write JS');

// --- UTILITY FUNCTIONS ---
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getSongs() {
    try {
        // This URL points directly to your local server and folder
        let a = await fetch("http://127.0.0.1:3000/MuzikFlow/songs/");
        
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        let songs = [];
        
        for (let element of as) {
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href);
            }
        }
        return songs;

    } catch (error) {
        console.error("Failed to fetch songs:", error);
        return []; // Return an empty array if there's an error
    }
}

// --- MAIN APPLICATION LOGIC ---
async function main() {
    // --- 1. SETUP ---
    const songs = await getSongs();
    if (songs.length === 0) {
        console.error("No songs found. Please check your songs folder and server.");
        return;
    }
    const audio = new Audio();
    let currentSongIndex = 0;

    // Get all elements from HTML
    const songUL = document.querySelector(".song-list ul");
    const play = document.getElementById("play");
    const previous = document.getElementById("previous");
    const next = document.getElementById("next");
    const songInfo = document.querySelector(".song-info");
    const songTime = document.querySelector(".song-time");

    const volumeIcon = document.getElementById("volume-icon");
    const volumeSlider = document.getElementById("volume-slider");

    const seekBar = document.querySelector(".seek-bar");
    const circle = document.querySelector(".circle");

    // Add this block after your getSongs() function

// --- LIKED SONGS LOGIC ---
// Load liked songs from browser memory, or create an empty list
let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];

// Function to save the liked songs list to browser memory
const saveLikedSongs = () => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
};

// Function to handle liking or unliking a song
const toggleLike = (songSrc, heartIcon) => {
    if (likedSongs.includes(songSrc)) {
        // If already liked, unlike it
        likedSongs = likedSongs.filter(song => song !== songSrc);
        heartIcon.classList.remove('liked');
    } else {
        // If not liked, like it
        likedSongs.push(songSrc);
        heartIcon.classList.add('liked');
    }
    saveLikedSongs(); // Save the updated list
    updateAllHeartIcons(); // Update all hearts on the page
};

// Add this function right after toggleLike

// Function to update the appearance of all heart icons on the page
const updateAllHeartIcons = () => {
    const currentSongSrc = audio.src;

    // Update the main playbar heart
    const playbarHeart = document.querySelector('.playbar .heart-icon');
    if (likedSongs.includes(currentSongSrc)) {
        playbarHeart.classList.add('liked');
    } else {
        playbarHeart.classList.remove('liked');
    }

    // Update all hearts in the library list
    document.querySelectorAll('.song-list .heart-icon').forEach((heart, index) => {
        if (likedSongs.includes(songs[index])) {
            heart.classList.add('liked');
        } else {
            heart.classList.remove('liked');
        }
    });
};

    // Clean up song names for display in the library
    const songNames = songs.map(path => {
        return decodeURIComponent(path).split("/").pop().replace(".mp3", "").trim();
    });

    // --- 2. CORE FUNCTIONS ---

    // This function just plays a song by its index
    const playMusic = (index) => {
        if (index >= 0 && index < songs.length) {
            currentSongIndex = index;
            audio.src = songs[currentSongIndex];
            audio.play();
            updateAllHeartIcons(); // ADD THIS LINE
        }
    };

// Replace your existing updateUI function with this one
const updateUI = () => {
    // This safety check is the main fix.
    // If no song is loaded, don't try to update the UI.
    if (!audio.src) {
        return; 
    }

    // Update playbar play/pause icon
    play.src = audio.paused ? "play.svg" : "pause.svg";
    
    // Update playbar song info and time
    songInfo.innerHTML = decodeURIComponent(audio.src).split("/").pop().replace(".mp3", "").trim();
    songTime.innerHTML = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    
    // Update seek bar position
    if (circle && !isNaN(audio.duration)) {
        circle.style.left = (audio.currentTime / audio.duration) * 100 + "%";
    }

    // Update card animations
    document.querySelectorAll('.card').forEach(card => {
        const cardIdentifier = card.dataset.song;
        // This check prevents the error if an identifier is missing
        if (cardIdentifier) { 
            if (decodeURIComponent(audio.src).toLowerCase().includes(cardIdentifier.toLowerCase()) && !audio.paused) {
                card.classList.add('is-playing');
            } else {
                card.classList.remove('is-playing');
            }
        }
    });
};

    // --- 3. BUILD THE PLAYLIST ---
    songUL.innerHTML = "";
    for (let i = 0; i < songNames.length; i++) {
        let li = document.createElement("li");
        li.innerHTML = `
            <img class="icon-white" src="music.svg" alt="music">
            <div class="info">
                <div class="song-title">${songNames[i]}</div>
            </div>
            <div class="heart-icon list-heart">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.39 20.87a.696.696 0 0 1-.78 0C9.764 19.637 2 14.15 2 8.973c0-6.68 7.85-7.75 10-3.25 2.15-4.5 10-3.43 10 3.25 0 5.178-7.764 10.664-9.61 11.897z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
    `;
        li.addEventListener("click", () => {
            playMusic(i);
        });
        songUL.appendChild(li);
    }

    // --- 4. SETUP EVENT LISTENERS ---

    // Listen to the audio player itself. This is the "source of truth".
    audio.addEventListener('play', updateUI);
    audio.addEventListener('pause', updateUI);
    audio.addEventListener('timeupdate', updateUI);
    audio.addEventListener('loadeddata', updateUI);
    audio.addEventListener('ended', () => {
        // Play the next song when the current one ends
        playMusic((currentSongIndex + 1) % songs.length);
    });

    // Add this inside the "4. SETUP EVENT LISTENERS" section of main()

    // Add click listener to the main playbar heart
    const playbarHeart = document.querySelector('.playbar .heart-icon');
    playbarHeart.addEventListener('click', () => {
        if (audio.src) {
            toggleLike(audio.src, playbarHeart);
        }
    });

    // Add click listeners to all hearts in the library list
    document.querySelectorAll('.song-list .heart-icon').forEach((heart, index) => {
        heart.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents the song from playing when liking
            toggleLike(songs[index], heart);
        });
    });

    // Initial UI sync on page load
    updateAllHeartIcons();

    // Main playbar listener
    play.addEventListener("click", () => {
        if (audio.paused) {
            if (!audio.src && songs.length > 0) {
                playMusic(0); // Play first song if none is loaded
            } else {
                audio.play();
            }
        } else {
            audio.pause();
        }
    });

    // Next/Previous listeners
    next.addEventListener("click", () => playMusic((currentSongIndex + 1) % songs.length));
    previous.addEventListener("click", () => playMusic((currentSongIndex - 1 + songs.length) % songs.length));

    // Card listeners
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", () => {
            const songIdentifier = card.dataset.song;
            const songIndex = songs.findIndex(url => decodeURIComponent(url).toLowerCase().includes(songIdentifier.toLowerCase()));

            if (songIndex !== -1) {
                if (currentSongIndex === songIndex && !audio.paused) {
                    audio.pause();
                } else {
                    playMusic(songIndex);
                }
            }
        });
    });

    // Seek bar listener
    if (seekBar) {
        seekBar.addEventListener("click", (e) => {
            if (!isNaN(audio.duration)) {
                let percent = (e.offsetX / e.currentTarget.getBoundingClientRect().width);
                audio.currentTime = percent * audio.duration;
            }
        });
    }
    // add a event listner for hamburger
    // document.querySelector(".hamburger").addEventListener("click", ()=>{
    //     document.querySelector(".left").style.left = "0"
    // })
    // add a event listner for close button
    // document.querySelector(".close").addEventListener("click", ()=>{
    //     document.querySelector(".left").style.left = "-100%"
    // })

// Add this inside the "4. SETUP EVENT LISTENERS" section of main()

// // Volume Control Listener
// volumeSlider.addEventListener("input", (e) => {
//     const volume = parseInt(e.target.value) / 100;
//     audio.volume = volume;
//     volumeSlider.style.setProperty('--volume-progress', `${volumeLevel}%`);
//     if (volume === 0) {
//         volumeIcon.src = "mute.svg";
//         audio.muted = true;
//     } else {
//         volumeIcon.src = "volume.svg";
//         audio.muted = false;
//     }
// });

// // Mute button listener
// volumeIcon.addEventListener("click", () => {
//     audio.muted = !audio.muted;
//     if (audio.muted) {
//         volumeIcon.src = "mute.svg";
//         volumeSlider.value = 0;
//     } else {
//         volumeIcon.src = "volume.svg";
//         volumeSlider.value = audio.volume * 100;
//     }
// });
// Replace your old volume listeners with this complete version
    
    // Function to update the volume slider's appearance
    const updateVolumeSlider = (value) => {
        volumeSlider.style.setProperty('--volume-progress', `${value}%`);
        volumeSlider.value = value;
    };

    // Listener for when the user drags the slider
    volumeSlider.addEventListener("input", (e) => {
        const value = parseInt(e.target.value);
        audio.volume = value / 100;
        audio.muted = (value === 0);
        volumeIcon.src = (value === 0) ? "mute.svg" : "volume.svg";
        updateVolumeSlider(value);
    });

    // Listener for when the user clicks the mute icon
    volumeIcon.addEventListener("click", () => {
        audio.muted = !audio.muted;
        if (audio.muted) {
            volumeIcon.src = "mute.svg";
            updateVolumeSlider(0);
        } else {
            volumeIcon.src = "volume.svg";
            const currentVolume = audio.volume * 100;
            updateVolumeSlider(currentVolume);
        }
    });

    // Also, initialize the slider on page load
    updateVolumeSlider(100);

}

main();


// Replace your existing setupHamburgerMenu function with this one
function setupHamburgerMenu() {
    console.log("Running setupHamburgerMenu...");

    const hamburger = document.querySelector(".hamburger");
    const closeButton = document.querySelector(".close-btn");

    // This will tell us if the script found your buttons in the HTML
    console.log("Hamburger element found:", hamburger);
    console.log("Close button element found:", closeButton);

    if (hamburger && closeButton) {
        console.log("Both buttons found. Adding click listeners...");

        // Logic to open the library
        hamburger.addEventListener("click", () => {
            console.log("Hamburger clicked! Opening library.");
            document.body.classList.add("library-open");
        });

        // Logic to close the library
        closeButton.addEventListener("click", () => {
            console.log("Close button clicked! Closing library.");
            document.body.classList.remove("library-open");
        });

    } else {
        console.error("ERROR: Could not find hamburger and/or close button. Please check the class names in your HTML.");
    }

}

// Call the function to set it up
setupHamburgerMenu();


// Replace your old function with this one
function setupNavigationArrows() {
    document.querySelectorAll('.list-container').forEach(container => {
        const leftArrow = container.querySelector('.left-arrow');
        const rightArrow = container.querySelector('.right-arrow');
        const cardContainer = container.querySelector('.card-container');

        if (leftArrow && rightArrow && cardContainer) {
            rightArrow.addEventListener('click', () => {
                const scrollAmount = cardContainer.clientWidth * 0.8;
                cardContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });

            leftArrow.addEventListener('click', () => {
                const scrollAmount = cardContainer.clientWidth * 0.8;
                cardContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }
    });
}

// Call the function
setupNavigationArrows();