// console.log('lets write JS');

// // --- UTILITY FUNCTIONS ---
// function formatTime(seconds) {
//     if (isNaN(seconds) || seconds < 0) return "00:00";
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
// }

// // async function getSongs() {
// //     try {
// //         // This URL points directly to your local server and folder
// //         let a = await fetch("./playlist.json");
        
// //         let response = await a.text();
// //         let div = document.createElement("div");
// //         div.innerHTML = response;
// //         let as = div.getElementsByTagName("a");
// //         let songs = [];
        
// //         for (let element of as) {
// //             if (element.href.endsWith(".mp3")) {
// //                 songs.push(element.href);
// //             }
// //         }
// //         return songs;

// //     } catch (error) {
// //         console.error("Failed to fetch songs:", error);
// //         return []; // Return an empty array if there's an error
// //     }
// // }
// async function getSongs() {
//     try {
//         let response = await fetch("./playlist.json");
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         let songs = await response.json();
//         return songs;
//     } catch (error) {
//         console.error("Could not fetch the playlist:", error);
//         return []; // Return an empty array on error
//     }
// }

// // --- MAIN APPLICATION LOGIC ---
// async function main() {
//     // --- 1. SETUP ---
//     const songs = await getSongs();
//     if (songs.length === 0) {
//         console.error("No songs found. Please check your songs folder and server.");
//         return;
//     }
//     const audio = new Audio();
//     let currentSongIndex = 0;

//     // Get all elements from HTML
//     const songUL = document.querySelector(".song-list ul");
//     const play = document.getElementById("play");
//     const previous = document.getElementById("previous");
//     const next = document.getElementById("next");
//     const songInfo = document.querySelector(".song-info");
//     const songTime = document.querySelector(".song-time");

//     const volumeIcon = document.getElementById("volume-icon");
//     const volumeSlider = document.getElementById("volume-slider");

//     const seekBar = document.querySelector(".seek-bar");
//     const circle = document.querySelector(".circle");

//     // Add this block after your getSongs() function

// // --- LIKED SONGS LOGIC ---
// // Load liked songs from browser memory, or create an empty list
// let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];

// // Function to save the liked songs list to browser memory
// const saveLikedSongs = () => {
//     localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
// };

// // Function to handle liking or unliking a song
// const toggleLike = (songSrc, heartIcon) => {
//     if (likedSongs.includes(songSrc)) {
//         // If already liked, unlike it
//         likedSongs = likedSongs.filter(song => song !== songSrc);
//         heartIcon.classList.remove('liked');
//     } else {
//         // If not liked, like it
//         likedSongs.push(songSrc);
//         heartIcon.classList.add('liked');
//     }
//     saveLikedSongs(); // Save the updated list
//     updateAllHeartIcons(); // Update all hearts on the page
// };

// // Add this function right after toggleLike

// // Function to update the appearance of all heart icons on the page
// const updateAllHeartIcons = () => {
//     const currentSongSrc = audio.src;

//     // Update the main playbar heart
//     const playbarHeart = document.querySelector('.playbar .heart-icon');
//     if (likedSongs.includes(currentSongSrc)) {
//         playbarHeart.classList.add('liked');
//     } else {
//         playbarHeart.classList.remove('liked');
//     }

//     // Update all hearts in the library list
//     document.querySelectorAll('.song-list .heart-icon').forEach((heart, index) => {
//         if (likedSongs.includes(songs[index])) {
//             heart.classList.add('liked');
//         } else {
//             heart.classList.remove('liked');
//         }
//     });
// };

//     // Clean up song names for display in the library
//     const songNames = songs.map(path => {
//         return decodeURIComponent(path).split("/").pop().replace(".mp3", "").trim();
//     });

//     // --- 2. CORE FUNCTIONS ---

//     // This function just plays a song by its index
//     const playMusic = (index) => {
//         if (index >= 0 && index < songs.length) {
//             currentSongIndex = index;
//             audio.src = songs[currentSongIndex];
//             audio.play();
//             updateAllHeartIcons(); // ADD THIS LINE
//         }
//     };

// // Replace your existing updateUI function with this one
// const updateUI = () => {
//     // This safety check is the main fix.
//     // If no song is loaded, don't try to update the UI.
//     if (!audio.src) {
//         return; 
//     }

//     // Update playbar play/pause icon
//     play.src = audio.paused ? "play.svg" : "pause.svg";
    
//     // Update playbar song info and time
//     songInfo.innerHTML = decodeURIComponent(audio.src).split("/").pop().replace(".mp3", "").trim();
//     songTime.innerHTML = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    
//     // Update seek bar position
//     if (circle && !isNaN(audio.duration)) {
//         circle.style.left = (audio.currentTime / audio.duration) * 100 + "%";
//     }

//     // Update card animations
//     document.querySelectorAll('.card').forEach(card => {
//         const cardIdentifier = card.dataset.song;
//         // This check prevents the error if an identifier is missing
//         if (cardIdentifier) { 
//             if (decodeURIComponent(audio.src).toLowerCase().includes(cardIdentifier.toLowerCase()) && !audio.paused) {
//                 card.classList.add('is-playing');
//             } else {
//                 card.classList.remove('is-playing');
//             }
//         }
//     });
// };

//     // --- 3. BUILD THE PLAYLIST ---
//     songUL.innerHTML = "";
//     for (let i = 0; i < songNames.length; i++) {
//         let li = document.createElement("li");
//         li.innerHTML = `
//             <img class="icon-white" src="music.svg" alt="music">
//             <div class="info">
//                 <div class="song-title">${songNames[i]}</div>
//             </div>
//             <div class="heart-icon list-heart">
//                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.39 20.87a.696.696 0 0 1-.78 0C9.764 19.637 2 14.15 2 8.973c0-6.68 7.85-7.75 10-3.25 2.15-4.5 10-3.43 10 3.25 0 5.178-7.764 10.664-9.61 11.897z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
//             </div>
//     `;
//         li.addEventListener("click", () => {
//             playMusic(i);
//         });
//         songUL.appendChild(li);
//     }

//     // --- 4. SETUP EVENT LISTENERS ---

//     // Listen to the audio player itself. This is the "source of truth".
//     audio.addEventListener('play', updateUI);
//     audio.addEventListener('pause', updateUI);
//     audio.addEventListener('timeupdate', updateUI);
//     audio.addEventListener('loadeddata', updateUI);
//     audio.addEventListener('ended', () => {
//         // Play the next song when the current one ends
//         playMusic((currentSongIndex + 1) % songs.length);
//     });

//     // Add this inside the "4. SETUP EVENT LISTENERS" section of main()

//     // Add click listener to the main playbar heart
//     const playbarHeart = document.querySelector('.playbar .heart-icon');
//     playbarHeart.addEventListener('click', () => {
//         if (audio.src) {
//             toggleLike(audio.src, playbarHeart);
//         }
//     });

//     // Add click listeners to all hearts in the library list
//     document.querySelectorAll('.song-list .heart-icon').forEach((heart, index) => {
//         heart.addEventListener('click', (e) => {
//             e.stopPropagation(); // Prevents the song from playing when liking
//             toggleLike(songs[index], heart);
//         });
//     });

//     // Initial UI sync on page load
//     updateAllHeartIcons();

//     // Main playbar listener
//     play.addEventListener("click", () => {
//         if (audio.paused) {
//             if (!audio.src && songs.length > 0) {
//                 playMusic(0); // Play first song if none is loaded
//             } else {
//                 audio.play();
//             }
//         } else {
//             audio.pause();
//         }
//     });

//     // Next/Previous listeners
//     next.addEventListener("click", () => playMusic((currentSongIndex + 1) % songs.length));
//     previous.addEventListener("click", () => playMusic((currentSongIndex - 1 + songs.length) % songs.length));

//     // Card listeners
//     document.querySelectorAll(".card").forEach(card => {
//         card.addEventListener("click", () => {
//             const songIdentifier = card.dataset.song;
//             const songIndex = songs.findIndex(url => decodeURIComponent(url).toLowerCase().includes(songIdentifier.toLowerCase()));

//             if (songIndex !== -1) {
//                 if (currentSongIndex === songIndex && !audio.paused) {
//                     audio.pause();
//                 } else {
//                     playMusic(songIndex);
//                 }
//             }
//         });
//     });

//     // Seek bar listener
//     if (seekBar) {
//         seekBar.addEventListener("click", (e) => {
//             if (!isNaN(audio.duration)) {
//                 let percent = (e.offsetX / e.currentTarget.getBoundingClientRect().width);
//                 audio.currentTime = percent * audio.duration;
//             }
//         });
//     }
//     // add a event listner for hamburger
//     // document.querySelector(".hamburger").addEventListener("click", ()=>{
//     //     document.querySelector(".left").style.left = "0"
//     // })
//     // add a event listner for close button
//     // document.querySelector(".close").addEventListener("click", ()=>{
//     //     document.querySelector(".left").style.left = "-100%"
//     // })

// // Add this inside the "4. SETUP EVENT LISTENERS" section of main()

// // // Volume Control Listener
// // volumeSlider.addEventListener("input", (e) => {
// //     const volume = parseInt(e.target.value) / 100;
// //     audio.volume = volume;
// //     volumeSlider.style.setProperty('--volume-progress', `${volumeLevel}%`);
// //     if (volume === 0) {
// //         volumeIcon.src = "mute.svg";
// //         audio.muted = true;
// //     } else {
// //         volumeIcon.src = "volume.svg";
// //         audio.muted = false;
// //     }
// // });

// // // Mute button listener
// // volumeIcon.addEventListener("click", () => {
// //     audio.muted = !audio.muted;
// //     if (audio.muted) {
// //         volumeIcon.src = "mute.svg";
// //         volumeSlider.value = 0;
// //     } else {
// //         volumeIcon.src = "volume.svg";
// //         volumeSlider.value = audio.volume * 100;
// //     }
// // });
// // Replace your old volume listeners with this complete version
    
//     // Function to update the volume slider's appearance
//     const updateVolumeSlider = (value) => {
//         volumeSlider.style.setProperty('--volume-progress', `${value}%`);
//         volumeSlider.value = value;
//     };

//     // Listener for when the user drags the slider
//     volumeSlider.addEventListener("input", (e) => {
//         const value = parseInt(e.target.value);
//         audio.volume = value / 100;
//         audio.muted = (value === 0);
//         volumeIcon.src = (value === 0) ? "mute.svg" : "volume.svg";
//         updateVolumeSlider(value);
//     });

//     // Listener for when the user clicks the mute icon
//     volumeIcon.addEventListener("click", () => {
//         audio.muted = !audio.muted;
//         if (audio.muted) {
//             volumeIcon.src = "mute.svg";
//             updateVolumeSlider(0);
//         } else {
//             volumeIcon.src = "volume.svg";
//             const currentVolume = audio.volume * 100;
//             updateVolumeSlider(currentVolume);
//         }
//     });

//     // Also, initialize the slider on page load
//     updateVolumeSlider(100);

// }

// main();


// // Replace your existing setupHamburgerMenu function with this one
// function setupHamburgerMenu() {
//     console.log("Running setupHamburgerMenu...");

//     const hamburger = document.querySelector(".hamburger");
//     const closeButton = document.querySelector(".close-btn");

//     // This will tell us if the script found your buttons in the HTML
//     console.log("Hamburger element found:", hamburger);
//     console.log("Close button element found:", closeButton);

//     if (hamburger && closeButton) {
//         console.log("Both buttons found. Adding click listeners...");

//         // Logic to open the library
//         hamburger.addEventListener("click", () => {
//             console.log("Hamburger clicked! Opening library.");
//             document.body.classList.add("library-open");
//         });

//         // Logic to close the library
//         closeButton.addEventListener("click", () => {
//             console.log("Close button clicked! Closing library.");
//             document.body.classList.remove("library-open");
//         });

//     } else {
//         console.error("ERROR: Could not find hamburger and/or close button. Please check the class names in your HTML.");
//     }

// }

// // Call the function to set it up
// setupHamburgerMenu();


// // Replace your old function with this one
// function setupNavigationArrows() {
//     document.querySelectorAll('.list-container').forEach(container => {
//         const leftArrow = container.querySelector('.left-arrow');
//         const rightArrow = container.querySelector('.right-arrow');
//         const cardContainer = container.querySelector('.card-container');

//         if (leftArrow && rightArrow && cardContainer) {
//             rightArrow.addEventListener('click', () => {
//                 const scrollAmount = cardContainer.clientWidth * 0.8;
//                 cardContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//             });

//             leftArrow.addEventListener('click', () => {
//                 const scrollAmount = cardContainer.clientWidth * 0.8;
//                 cardContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
//             });
//         }
//     });
// }

// // Call the function
// setupNavigationArrows();


console.log("Let's write JS");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

// This is the new, corrected function to get songs from your playlist file
async function getSongs() {
    try {
        let response = await fetch("./playlist.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        songs = await response.json();
        return songs;
    } catch (error) {
        console.error("Could not fetch the playlist:", error);
        return []; // Return an empty array on error
    }
}

const playMusic = (track, pause = false) => {
    // Use track.path, which comes directly from your playlist.json
    currentSong.src = track.path;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track.name);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
    // Get the list of songs
    await getSongs();
    if (songs.length === 0) {
        console.log("No songs found in playlist.json");
        return;
    }

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""; // Clear existing list
    for (const song of songs) {
        songUL.innerHTML += `<li>
            <img class="invert" width="34" src="img/music.svg" alt="">
            <div class="info">
                <div>${song.name}</div>
                <div>${song.artist || 'Unknown Artist'}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, i) => {
        e.addEventListener("click", element => {
            playMusic(songs[i]);
        });
    });
    
    // Play the first song initially
    playMusic(songs[0], true);


    // Attach event listeners to play, next, and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Add an event listener to the seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        let index = songs.findIndex(song => song.path === currentSong.src.split('/').slice(-2).join('/'));
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    // Add an event listener to next
    next.addEventListener("click", () => {
        let index = songs.findIndex(song => song.path === currentSong.src.split('/').slice(-2).join('/'));
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    });

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    });
}

main();