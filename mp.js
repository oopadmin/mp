let progress = document.getElementById("progress");
let song = document.getElementById("song");
let ctrlIcon = document.getElementById("ctrlIcon");
let repeat = document.getElementById("repeatIcon");
let songArt = document.getElementById("art");
let title = document.getElementById("Title");
let artist = document.getElementById("Artist");
var songIndex = 1;

document.addEventListener("contextmenu", function(event){
    event.preventDefault();
}, false);

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        playPause();
    };
    if (event.code === 'KeyR') {
        Repeat();
    }
});

window.onload = function(){
    song.autoplay = false;
    songArt.style.animationPlayState = "paused";
    updateSongInfo(songIndex);
}

song.onloadedmetadata = function(){
    progress.max = song.duration;
    progress.value = song.currentTime;
}

function updateSongInfo(Index) {
    fetch("db/info.json")
        .then(response => response.json())
        .then(data => {
            const songs = data.songs;
            
            if (Index < 1){
                Index = songs.length - 1;
                songIndex = Index;
            }
            if (Index >= songs.length){
                Index = 1;
                songIndex = Index;
            }

            title.textContent = songs[Index].title;
            artist.textContent = songs[Index].artist;
            song.src = `db/song/${songs[Index].name}`;
            songArt.src = `db/art/${songs[Index].art}`;
        })
        .catch(error => {
            console.error('Error fetching song data:', error);
        })
}

function playPause(){
    if(ctrlIcon.classList.contains("fa-pause")){
        song.pause();
        ctrlIcon.classList.remove("fa-pause");
        ctrlIcon.classList.add("fa-play");
        songArt.style.animationPlayState = "paused";
    }
    else{
        song.play();
        ctrlIcon.classList.add("fa-pause");
        ctrlIcon.classList.remove("fa-play");
        songArt.style.animationPlayState = "running";
    }
}

if(song.play()){
    setInterval(()=>{
        progress.value = song.currentTime;
    },300);
}

progress.onchange = function(){
    song.play();
    songArt.style.animationPlayState = "running";
    song.currentTime = progress.value;
    ctrlIcon.classList.add("fa-pause");
    ctrlIcon.classList.remove("fa-play");
}

const text = document.getElementById("repeatIcon");
const originalColor = '#0f1710';
const changedColor = '#12d12c';
let currentColor = originalColor; 

function Repeat(){
    song.loop = !song.loop;
    if (song.loop && progress.value == Math.floor(song.duration)){
        song.play();
        }
    if (currentColor === originalColor) {
        text.style.color = changedColor;
        currentColor = changedColor;
    } else {
        text.style.color = originalColor;
        currentColor = originalColor;
    };
};

function forwardSong(){
    updateSongInfo(++songIndex);
    
    if(ctrlIcon.classList.contains("fa-pause")){
        song.autoplay = true;
    }else{
        song.autoplay = false;
    }
}

function backwardSong(){
    updateSongInfo(--songIndex);

    if(ctrlIcon.classList.contains("fa-pause")){
        song.autoplay = true;
    }else{
        song.autoplay = false;
    }
}

