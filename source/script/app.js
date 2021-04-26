
const app = {
    songs: null,
    currentSongID: 0,
    playing: false,
    repeat: false,
    random: false,
    volume: 1,
    timer: 0,
    searchText: "",
    searchSongs: null,

    setCurrentSongID: function (next, previous, repeat, random, selectedID) {
        if (repeat) {
            //Do nothing
        }
        else if (random) {
            if (this.searchSongs) {
                while (true) {
                    let randomSearchSongsIndex = Math.round(Math.random() * this.searchSongs.length - 1);
                    let newSongID = this.searchSongs[randomSearchSongsIndex].id
                    if (this.currentSongID == newSongID)
                        continue;
                    else {
                        this.currentSongID = newSongID;
                        break;
                    }
                }
            }
            else {
                while (true) {
                    let randomSongsIndex = Math.round(Math.random() * this.songs.length - 1);
                    let newSongID = this.songs[randomSongsIndex].id;
                    if (this.currentSongID == newSongID)
                        continue;
                    else {
                        this.currentSongID = newSongID;
                        break;
                    }
                }
            }
        }
        else if (next) {
            if (this.searchSongs) {
                //ID k trùng thứ tự bài
                let currentSearchSongIndex = this.searchSongs.findIndex(searchSong => {
                    return searchSong == this.songs[this.currentSongID];
                });

                if (currentSearchSongIndex == this.searchSongs.length - 1) {
                    this.currentSongID = this.searchSongs[0].id;
                }
                else
                    this.currentSongID = this.searchSongs[currentSearchSongIndex + 1].id;
            }
            else {
                //ID trùng thứ tự bài
                if (this.currentSongID == this.songs.length - 1)
                    this.currentSongID = this.songs[0].id;
                else
                    this.currentSongID = this.songs[this.currentSongID + 1].id;
            }
        }
        else if (previous) {
            if (this.searchSongs) {
                let currentSearchSongIndex = this.searchSongs.findIndex(searchSong => {
                    return searchSong == this.songs[this.currentSongID];
                });

                if (this.currentSongID == 0)
                    this.currentSongID = this.searchSongs[this.searchSongs.length - 1].id;
                else
                    this.currentSongID = this.searchSongs[currentSearchSongIndex - 1].id;
            }
            else {
                if (this.currentSongID == 0)
                    this.currentSongID = this.songs[this.songs.length - 1].id;
                else
                    this.currentSongID = this.songs[this.currentSongID - 1].id;
            }
        }
        else
            this.currentSongID = selectedID;
    },

    getCurrentSong: function () {
        return this.songs[this.currentSongID];
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
        this.setCurrentSongID(true, false, false, false, false);
        this.start();
        this.playAndStopSong();
    },

    goToPreviousSong: function () {
        this.setCurrentSongID(false, true, false, false, false);
        this.start();
        this.playAndStopSong();
    },

    goToRandomSong: function () {
        this.setCurrentSongID(false, false, false, true, false);
        this.start();
        this.playAndStopSong();
    },

    goToSelectedSong: function (selectedID) {
        this.setCurrentSongID(false, false, false, false, selectedID);
        this.start();
        this.playAndStopSong();
    },

    start: function () {
        const sections = {
            title: `Music - ${this.getCurrentSong().name}`,

            header: `
                <header class="sticky">
                    <div class="search-wrapper">
                        <input type="text" placeholder="Nhập tên bài hát" id="searchInput" value="${this.searchText}">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="timer-wrapper">
                        <i class="far fa-clock"></i>
                        <div class="timer-handler" id="timerHandler"></div>
                    </div>
                </header>
            `,

            playlistHeader: `
                <div class="playlist-header-sticky">
                    <div class="playlist-header__thumbnail">
                        <picture>
                            <source media="(max-width:600px)" srcset=${this.getCurrentSong().thumbnail_mobile}>
                            <img src=${this.getCurrentSong().thumbnail_desktop} class="song-cd" alt="">
                        </picture>
                    </div>
                    <h3 class="playlist-header__name">${this.getCurrentSong().name}</h3>
                    <p class="playlist-header__updated-time">Cập nhật ${this.getCurrentSong().updated}</p>
                </div>
            `,

            playlist: () => {
                if (this.searchSongs) {
                    playlist = this.searchSongs.map(searchSong => {
                        if (searchSong === this.getCurrentSong()) {
                            return `
                                <div id="${searchSong.id}" class="playlist__song playing">
                                    <div class="song--left">
                                        <div class="song-image">
                                            <img src=${searchSong.thumbnail_desktop} alt="">
                                            <i class="fas fa-play show"></i>
                                        </div>
                                        <div class="song-information">
                                            <p class="song-name">${searchSong.name}</p>
                                            <p class="singer-name">${searchSong.singer}</p>
                                        </div>
                                    </div>
                                    <div class="song--middle">
                                        <p class="song-duration">${searchSong.duration}</p>
                                    </div>
                                    <div class="song--right">
                                        <i class="fas fa-ellipsis-h moreButton"></i>
                                        <div class="song-more hidden">
                                            <div class="more more-download">
                                                <a href=${searchSong.source} download>
                                                    <i class="fas fa-download">Tải xuống</i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        }
                        else {
                            return `
                                <div id="${searchSong.id}" class="playlist__song">
                                    <div class="song--left">
                                        <div class="song-image">
                                            <img src=${searchSong.thumbnail_desktop} alt="">
                                            <i class="fas fa-play show"></i>
                                        </div>
                                        <div class="song-information">
                                            <p class="song-name">${searchSong.name}</p>
                                            <p class="singer-name">${searchSong.singer}</p>
                                        </div>
                                    </div>
                                    <div class="song--middle">
                                        <p class="song-duration">${searchSong.duration}</p>
                                    </div>
                                    <div class="song--right">
                                        <i class="fas fa-ellipsis-h moreButton"></i>
                                        <div class="song-more hidden">
                                            <div class="more more-download">
                                                <a href=${searchSong.source} download>
                                                    <i class="fas fa-download">Tải xuống</i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        }
                    });
                } else {
                    playlist = this.songs.map(song => {
                        if (song === this.getCurrentSong()) {
                            return `
                                    <div id="${song.id}" class="playlist__song playing">
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
                        else {
                            return `
                                    <div id="${song.id}" class="playlist__song">
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
                }

                return playlist.join("");
            },

            player: `
                <footer class="player">
                    <div class="player--left">
                        <div class="song-image">
                            <img src=${this.getCurrentSong().thumbnail_mobile} class="song-cd" alt="">
                        </div>
                        <div class="player__song-information">
                            <p class="song-name">${this.getCurrentSong().name}</p>
                            <p class="singer-name">${this.getCurrentSong().singer}</p>
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
                            <span id="current-time" class="current-time">00:00</span>
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
            document.title = `${sections.title}`;

            document.body.innerHTML = `
                ${sections.header}
                <section class="main" id="main">
                    <div class="playlist-header">${sections.playlistHeader}</div>
                    <div class="playlist" id="playlist">${sections.playlist()}</div>
                </section>
                ${sections.player}
            `;
        };

        const renderSearch = () => {
            document.getElementById("playlist").innerHTML = `
                <div class="playlist" id="playlist">${sections.playlist()}</div>
            `
        }

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
            const animatingSongCDs = () => {
                const songCDs = document.querySelectorAll(".song-cd");
                songCDs.forEach(songCD => {
                    if (this.playing)
                        songCD.classList.add("spinning");
                    else
                        songCD.classList.remove("spinning");
                });
            }

            const stylingTimer = () => {
                const timerHandler = document.getElementById("timerHandler");
                if (this.timer) {
                    timerHandler.classList.add("active");
                    timerHandler.innerHTML = this.timer;
                }
                else {
                    timerHandler.classList.remove("active");
                    timerHandler.innerHTML = "";
                }
            }

            stylingRepeatAndRandomButton();
            togglingPlayButton();
            animatingSongCDs();
            stylingTimer();
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
                        });
                    };

                    const previousButtonClick = () => {
                        const previousButton = document.getElementById("previousButton");
                        previousButton.addEventListener("click", () => {
                            this.goToPreviousSong();
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
                            this.playAndStopSong();
                            stylingHandler();
                        });
                    }

                    const pauseButtonClick = () => {
                        pauseButton.addEventListener("click", () => {
                            this.playing = false;
                            this.playAndStopSong();
                            stylingHandler();
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
                        this.playAndStopSong();
                        stylingHandler();
                    }
                    //Random
                    else if (this.random) {
                        this.goToRandomSong();
                        stylingHandler();
                    }
                    //Bình thường
                    else {
                        this.goToNextSong();
                        stylingHandler();
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
                        setAudioVolume();
                    });
                }
                setAudioVolume();
                updateAudioVolume();
            }

            const songClick = () => {
                const songsList = document.querySelectorAll(".playlist__song");
                songsList.forEach(song => {
                    song.addEventListener("click", (e) => {
                        //Lấy ID bài hát
                        const selectedID = song.getAttribute("id");

                        //Nếu click vào button more hoặc icon download
                        if (e.target.classList.contains("moreButton") || e.target.tagName == "I") {
                        }
                        else {
                            this.goToSelectedSong(selectedID);
                        }

                    });
                });
            }

            const setSongCurrentTime = () => {
                const audioSlider = document.getElementById("audioSlider");
                const audioHandler = document.getElementById("audioHandler");
                audioSlider.addEventListener("input", () => {
                    audioHandler.currentTime = audioSlider.value;
                });
            }

            const setTimer = () => {
                let previousIntervalID = 0; //Để clearInterval cũ nếu có

                const timerButtonClick = () => {
                    const timerButton = document.getElementById("timerButton");
                    const header = document.querySelector("header");
                    const timerForm = document.getElementById("timerForm");

                    const timerCountDown = () => {
                        clearInterval(previousIntervalID);
                        const countDown = () => {
                            if (this.timer) {
                                this.timer--;
                                stylingHandler(); //Update thời gian
                            }
                            //K else để tránh chạy thêm 1 lần interval
                            if (!this.timer) {
                                clearInterval(countDownSetIntervalHandler);
                                this.playing = false;
                                this.playAndStopSong();
                                stylingHandler(); //Update styling sau khi dừng
                            }
                        }
                        const countDownSetIntervalHandler = setInterval(countDown, 1000 * 60);

                        previousIntervalID = countDownSetIntervalHandler;
                    }

                    const timeValidation = (time, timerInput) => {
                        if (isNaN(time) == true || time == "" || time <= 0 || time >= 1000) {
                            timerInput.classList.add("error");
                        }
                        else {
                            this.timer = time;
                            timerInput.classList.remove("error");
                            header.removeChild(timerForm); //Tự động đóng nếu nhập thành công
                            stylingHandler(); //Add css cho timer
                            timerCountDown(); //Đếm ngược
                        }
                    }

                    timerButton.addEventListener("click", () => {
                        const timerInput = document.getElementById("timerInput");
                        timeValidation(timerInput.value, timerInput);
                    });
                }


                const openAndCloseTimerForm = () => {
                    const timerWrapper = document.querySelector(".timer-wrapper");
                    const header = document.querySelector("header");
                    const timerInputForm =
                        `<div class="timer-form" id="timerForm">
                            <input type="text" id="timerInput" placeholder="Nhập số phút hẹn giờ" min="0" max="999" />
                            <button type="button" id="timerButton">Xác nhận</button>
                        </div>`;

                    timerWrapper.addEventListener("click", () => {
                        const timerForm = document.getElementById("timerForm");
                        //Đóng cửa sổ khi click đồng hồ
                        if (timerForm) {
                            header.removeChild(timerForm);
                        }
                        else {
                            header.innerHTML += timerInputForm;
                            const timerForm = document.getElementById("timerForm");

                            //Đóng cửa sổ khi click vào màn hình
                            timerForm.addEventListener("click", (e) => {
                                if (e.target.tagName != "INPUT" && e.target.tagName != "BUTTON") {
                                    header.removeChild(timerForm);
                                }
                            });
                            openAndCloseTimerForm(); //Thêm lại event click vào timerWrapper mới tạo
                            timerButtonClick(); // Thêm event button
                        }
                    });
                }

                openAndCloseTimerForm();
            }

            const searchSongs = () => {
                const searchInput = document.getElementById("searchInput");
                searchInput.addEventListener("input", () => {
                    const searchValue = searchInput.value;

                    this.searchSongs = this.songs.filter(song => {
                        return song.name.toLowerCase().indexOf(searchValue.toLowerCase()) != -1;
                    });

                    this.searchText = searchValue;
                    renderSearch();
                    stylingHandler(); //Css sau khi re-render
                    // Add lại event playlist sau khi re-render
                    openMoreMenu();
                    songClick();
                });
            }

            openMoreMenu();
            playerButtonsClick();
            songEnd();
            updateAudioSliderAndCurrentTime();
            setAndUpdateAudioVolume();
            songClick();
            setSongCurrentTime();
            setTimer();
            searchSongs();
        };

        render();
        stylingHandler();
        eventHandler();
    }
}

const data = "../data/songs.json";

fetch(data)
    .then(response => response.json())
    .then(songs => {
        app.songs = songs;
        app.start();
    })
    .catch(error => {
        document.getElementsByTagName("body")[0].innerHTML = "Lỗi!";
        console.error(error);
    });

// const xhr = new XMLHttpRequest();
// xhr.open("GET", "../data/songs.json", false);
// xhr.addEventListener("load", () => {
//     if (xhr.status === 200) {
//         app.songs = JSON.parse(xhr.responseText);
//         console.log("data received");
//     }

// });
// xhr.send();

