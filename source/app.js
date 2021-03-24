const app = {
    //audio.duration không return đc giá trị ngay sau khi mới new Audio
    songs: [],

    currentSongIndex: 0,
    playing: false,
    repeat: false,
    random: false,
    volume: 1,

    setCurrentSongIndex: function (increment, decrement, repeat, random) {
        if (repeat) {
            //Do nothing
        }
        else if (random) {
            while (true) {
                let newSongIndex = Math.round(Math.random() * this.songs.length - 1);
                if (this.currentSongIndex == newSongIndex)
                    continue;
                else {
                    this.currentSongIndex = newSongIndex;
                    break;
                }
            }
        }
        else if (increment) {
            if (this.currentSongIndex >= this.songs.length - 1)
                this.currentSongIndex = 0;
            else
                this.currentSongIndex++;
        }
        else if (decrement) {
            if (this.currentSongIndex == 0)
                this.currentSongIndex = this.songs.length - 1;
            else {
                this.currentSongIndex--;
            }
        }
    },

    getCurrentSong: function () {
        return this.songs[this.currentSongIndex];
    },

    convertSongDurationToSeconds: function (songDuration) {
        //[min,sec]
        const songDurationToArray = songDuration.split(":");
        const minutes = parseInt(songDurationToArray[0]);
        const seconds = parseInt(songDurationToArray[1]);
        return minutes * 60 + seconds;
    },

    playAndStopSong: function () {
        const audioHandler = document.getElementById("audioHandler");
        if (this.playing)
            audioHandler.play();
        else
            audioHandler.pause();
    },

    goToNextSong: function () {
        this.setCurrentSongIndex(true, false, false, false);
        this.start();
    },

    goToPreviousSong: function () {
        this.setCurrentSongIndex(false, true, false, false);
        this.start();
    },

    goToRandomSong: function () {
        this.setCurrentSongIndex(false, false, false, this.random);
        this.start();
    },

    start: function () {
        const components = {
            header: `
                <header class="sticky">
                    <div class="search-wrapper">
                        <input type="text" placeholder="Nhập tên bài hát">
                        <i class="fas fa-search"></i>
                    </div>
                </header>
            `,

            playlistHeader: `
                <div class="playlist-header-sticky">
                    <div class="playlist-header__thumbnail">
                        <picture>
                            <source media="(max-width:700px)" srcset=${this.getCurrentSong().thumbnail_mobile}>
                            <img src=${this.getCurrentSong().thumbnail_desktop} alt="">
                        </picture>
                    </div>
                    <h3 class="playlist-header__name">${this.getCurrentSong().name}</h3>
                    <p class="playlist-header__updated-time">Cập nhật ${this.getCurrentSong().updated}</p>
                </div>
            `,

            playlist: () => {
                const playlist = this.songs.map(song => {
                    if (song === this.getCurrentSong()) {
                        return `
                            <div class="playlist__song playing">
                                <div class="song--left">
                                    <div class="song-image">
                                        <img src=${song.thumbnail_desktop} alt="">
                                        <i class="fas fa-play show"></i>
                                    </div>
                                    <div class="song-information">
                                        <p class="song-name">${song.name}</p>
                                        <p class="singer-name">${song.singer}</p>
                                    </div>
                                </div>
                                <div class="song--middle">
                                    <p class="song-duration">${song.duration}</p>
                                </div>
                                <div class="song--right">
                                    <i class="fas fa-ellipsis-h moreButton"></i>
                                    <div class="song-more hidden">
                                        <div class="more more-download">
                                            <a href=${song.source} download>
                                                <i class="fas fa-download">Tải xuống</i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                    } else {
                        return `
                            <div class="playlist__song">
                                <div class="song--left">
                                    <div class="song-image">
                                        <img src=${song.thumbnail_desktop} alt="">
                                        <i class="fas fa-play show"></i>
                                    </div>
                                    <div class="song-information">
                                        <p class="song-name">${song.name}</p>
                                        <p class="singer-name">${song.singer}</p>
                                    </div>
                                </div>
                                <div class="song--middle">
                                    <p class="song-duration">${song.duration}</p>
                                </div>
                                <div class="song--right">
                                    <i class="fas fa-ellipsis-h moreButton"></i>
                                    <div class="song-more hidden">
                                        <div class="more more-download">
                                            <a href=${song.source} download>
                                                <i class="fas fa-download">Tải xuống</i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                    }
                });

                return playlist.join("");
            },

            player: `
                <footer class="player">
                    <div class="player--left">
                        <div class="song-image">
                            <img src=${this.getCurrentSong().thumbnail_mobile} alt="">
                        </div>
                        <div class="player__song-information">
                            <p class="song-name">${this.getCurrentSong().name}</p>
                            <p class="song-singer-name">${this.getCurrentSong().singer}</p>
                        </div>
                    </div>
                    <div class="player--middle">
                        <div class="player-control--top">
                            <i class="fas fa-redo-alt" id="repeatButton"></i>
                            <i class="fas fa-step-backward" id="previousButton"></i>                        
                            <i class="fas fa-play show" id="playButton"></i>
                            <i class="fas fa-pause hidden" id="pauseButton"></i>
                            <i class="fas fa-step-forward" id="nextButton"></i>
                            <i class="fas fa-random" id="randomButton"></i>
                        </div>
                        <div class="player-control--bottom">
                            <span id="current-time">00:00</span>
                            <input type="range" value="0" min="0" step="1" max=${this.convertSongDurationToSeconds(this.getCurrentSong().duration)} id="audioSlider">
                            <span>${this.getCurrentSong().duration}</span>
                            <audio src=${this.getCurrentSong().source} id="audioHandler"></audio>
                        </div>
                    </div>
                    <div class="player--right">
                        <i class="fas fa-volume-up"></i>
                        <input type="range" value="1" min="0" max="1" step="0.01" id="volumeSlider">
                    </div>
                </footer>
            `
        }

        const render = () => {
            document.body.innerHTML = `
                ${components.header}
                <section class="main">
                    <div class="playlist-header">${components.playlistHeader}</div>
                    <div class="playlist">${components.playlist()}</div>
                </section>
                ${components.player}
            `;
        };

        const stylingHandler = () => {
            const stylingRepeatAndRandomButton = () => {
                const repeatButton = document.getElementById("repeatButton");
                const randomButton = document.getElementById("randomButton");
                if (this.repeat)
                    repeatButton.classList.add("active");
                else
                    repeatButton.classList.remove("active");

                if (this.random)
                    randomButton.classList.add("active");
                else
                    randomButton.classList.remove("active");
            }

            const togglingPlayButton = () => {
                const playButton = document.getElementById("playButton");
                const pauseButton = document.getElementById("pauseButton");
                if (this.playing) {
                    //Ẩn nút play
                    playButton.classList.remove("show");
                    playButton.classList.add("hidden");
                    //Hiện nút pause
                    pauseButton.classList.add("show");
                    pauseButton.classList.remove("hidden");
                } else {
                    //Hiện nút play
                    playButton.classList.add("show");
                    playButton.classList.remove("hidden");
                    //Ẩn nút pause
                    pauseButton.classList.remove("show");
                    pauseButton.classList.add("hidden");
                }
            }

            stylingRepeatAndRandomButton();
            togglingPlayButton();
        }

        const eventHandler = () => {
            const openMoreMenu = () => {
                const moreButtons = document.querySelectorAll(".moreButton");
                const moreMenus = document.querySelectorAll(".song-more");
                let openingMenuIndex = -1;
                moreButtons.forEach((moreButton, index) => {
                    moreButton.addEventListener("click", () => {
                        //Nếu menu khác đang mở hoặc k có menu mở
                        if (openingMenuIndex != index) {
                            //Hiện menu mới
                            moreMenus[index].classList.toggle("hidden");
                            moreMenus[index].classList.toggle("show");

                            //Nếu có menu khác đang mở
                            if (openingMenuIndex != -1) {
                                //Đóng menu cũ
                                moreMenus[openingMenuIndex].classList.toggle("hidden");
                                moreMenus[openingMenuIndex].classList.toggle("show");
                            }

                            openingMenuIndex = index;
                        }
                        //Nếu menu đang mở trùng menu ấn mở
                        else {
                            //Đóng menu
                            moreMenus[index].classList.toggle("hidden");
                            moreMenus[index].classList.toggle("show");
                            //K có menu nào mở => index = -1
                            openingMenuIndex = -1;
                        }
                    });
                });
            };

            const playerButtonsClick = () => {
                const nextAndPreviousButtonClick = () => {
                    const nextButtonClick = () => {
                        const nextButton = document.getElementById("nextButton");
                        nextButton.addEventListener("click", () => {
                            this.goToNextSong();
                            this.playAndStopSong();
                        });
                    };

                    const previousButtonClick = () => {
                        const previousButton = document.getElementById("previousButton");
                        previousButton.addEventListener("click", () => {
                            this.goToPreviousSong();
                            this.playAndStopSong();
                        });
                    };

                    nextButtonClick();
                    previousButtonClick();
                }

                const repeatAndRandomButtonClick = () => {
                    const repeatButtonClick = () => {
                        const repeatButton = document.getElementById("repeatButton");
                        repeatButton.addEventListener("click", () => {
                            //Tắt random
                            if (this.random)
                                this.random = false;
                            //Toggle repeat    
                            if (this.repeat)
                                this.repeat = false;
                            else
                                this.repeat = true;

                            stylingHandler();
                        });
                    }
                    const randomButtonClick = () => {
                        const randomButton = document.getElementById("randomButton");
                        randomButton.addEventListener("click", () => {
                            //Tắt repeat
                            if (this.repeat)
                                this.repeat = false;

                            //Toggle random
                            if (this.random)
                                this.random = false;
                            else
                                this.random = true;

                            stylingHandler();
                        });
                    }

                    repeatButtonClick();
                    randomButtonClick();
                }

                const playAndPauseButtonClick = () => {
                    const playButton = document.getElementById("playButton");
                    const pauseButton = document.getElementById("pauseButton");

                    const playButtonClick = () => {
                        playButton.addEventListener("click", () => {
                            this.playing = true;
                            stylingHandler();
                            this.playAndStopSong();
                        });
                    }

                    const pauseButtonClick = () => {
                        pauseButton.addEventListener("click", () => {
                            this.playing = false;
                            stylingHandler();
                            this.playAndStopSong();
                        });
                    }

                    playButtonClick();
                    pauseButtonClick();
                }

                nextAndPreviousButtonClick();
                repeatAndRandomButtonClick();
                playAndPauseButtonClick();
            }

            const songEnd = () => {
                audioHandler.addEventListener("ended", () => {
                    //Repeat
                    if (this.repeat) {
                        stylingHandler();
                        this.playAndStopSong();
                    }
                    //Random
                    else if (this.random) {
                        this.goToRandomSong();
                        stylingHandler();
                        this.playAndStopSong();
                    }
                    //Bình thường
                    else {
                        this.goToNextSong();
                        stylingHandler();
                        this.playAndStopSong();
                    }
                });
            }

            //Update thanh trượt + thời gian bài hát
            const updateAudioSliderAndCurrentTime = () => {
                const audioSlider = document.getElementById("audioSlider");
                const displayCurrentTime = document.getElementById("current-time");
                audioHandler.addEventListener("timeupdate", () => {
                    const audioCurrentTime = parseInt(audioHandler.currentTime);
                    audioSlider.value = audioCurrentTime;
                    const minutes = Math.floor(audioCurrentTime / 60);
                    const seconds = Math.round(audioCurrentTime - 60 * minutes);
                    console.log(minutes, seconds);
                    if (seconds >= 10) {
                        displayCurrentTime.innerHTML = `0${minutes}:${seconds}`;
                    } else {
                        displayCurrentTime.innerHTML = `0${minutes}:0${seconds}`;
                    }
                })
            }

            const setAndUpdateAudioVolume = () => {
                const volumeSlider = document.getElementById("volumeSlider");
                const audioHandler = document.getElementById("audioHandler");

                const setAudioVolume = () => {
                    audioHandler.volume = this.volume;
                    volumeSlider.value = this.volume;
                }

                const updateAudioVolume = () => {
                    volumeSlider.addEventListener("input", () => {
                        this.volume = volumeSlider.value; //audio.volume [0,1]
                        console.log(this.volume);
                        setAudioVolume();
                    });
                }
                console.log(this.volume);
                setAudioVolume();
                updateAudioVolume();
            }

            openMoreMenu();
            playerButtonsClick();
            songEnd();
            updateAudioSliderAndCurrentTime();
            setAndUpdateAudioVolume();
        };

        render();
        stylingHandler();
        eventHandler();
    }
}

app.start();