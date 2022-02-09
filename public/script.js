/* Área de controles */
const controls = document.querySelector("#controls");
const btnPlay = document.querySelector("#play-control");
let index = 0;
let currentMusic;
let isPlaying = false;

controls.addEventListener("click", (ev) => {
  const audios = [];
  let musica = {};

  const linhas =
    ev.path[2].childNodes[5].childNodes[1].childNodes[3].childNodes;

  linhas.forEach((item) => {
    if (item.nodeName != "#text") {
      musica.nome = item.childNodes[3].childNodes[0].data;
      musica.artista = item.childNodes[5].childNodes[0].data;
      musica.imagem = item.childNodes[1].childNodes[0].currentSrc;
      musica.audio = item.childNodes[7].childNodes[1];
      audios.push(musica);
      musica = {};
    }
  });

  function updateDataMusic() {
    currentMusic = audios[index];
    document.querySelector("#currentImg").src = currentMusic.imagem;
    document.querySelector("#currentName").innerText = currentMusic.nome;
    document.querySelector("#currentArtist").innerText = currentMusic.artista;
    document.querySelector("#volume").value = currentMusic.audio.volume * 100;

    const progressbar = document.querySelector("#progressbar");
    const textCurrentDuration = document.querySelector("#current-duration");
    const textTotalDuration = document.querySelector("#total-duration");

    progressbar.max = currentMusic.audio.duration;
    textTotalDuration.innerText = secondsToMinutes(currentMusic.audio.duration);
    currentMusic.audio.ontimeupdate = () => {
      textCurrentDuration.innerText = secondsToMinutes(
        currentMusic.audio.currentTime
      );
      progressbar.valueAsNumber = currentMusic.audio.currentTime;
    };
  }

  /* Botão Play */
  if (ev.target.id == "play-control") {
    if (index === 0) {
      updateDataMusic();
    }

    if (!isPlaying) {
      btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
      currentMusic.audio.play();
      isPlaying = true;
    } else {
      btnPlay.classList.replace("bi-pause-fill", "bi-play-fill");
      currentMusic.audio.pause();
      isPlaying = false;
    }
    musicEnded();
  }
  /* Fim Botão Play */

  /* Botão Mute */
  if (ev.target.id == "vol-icon") {
    currentMusic.audio.muted = !currentMusic.audio.muted;
    if (currentMusic.audio.muted) {
      ev.target.classList.replace("bi-volume-up-fill", "bi-volume-mute-fill");
    } else {
      ev.target.classList.replace("bi-volume-mute-fill", "bi-volume-up-fill");
    }
    musicEnded();
  }
  /* Fim Botão Mute */

  /* Range de Volume */
  if (ev.target.id == "volume") {
    currentMusic.audio.volume = ev.target.valueAsNumber / 100;
    musicEnded();
  }
  /* Fim Range de Volume */

  /* Escolhendo ponto da música com a progressbar */
  if (ev.target.id == "progressbar") {
    currentMusic.audio.currentTime = ev.target.valueAsNumber;
    musicEnded();
  }
  /* Fim Escolhendo ponto da música com a progressbar */

  /* Botão de Próxima música */

  if (ev.target.id == "next-control") {
    index++;

    if (index == audios.length) {
      index = 0;
    }

    currentMusic.audio.pause();
    updateDataMusic();
    currentMusic.audio.play();
    btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
    musicEnded();
  }
  /* Fim Botão de Próxima música */

  /* Botão de música anterior */
  if (ev.target.id == "prev-control") {
    index--;

    if (index === -1) {
      index = audios.length - 1;
    }

    currentMusic.audio.pause();
    updateDataMusic();
    currentMusic.audio.play();
    btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
    musicEnded();
  }
  /* Fim Botão de música anterior */

  function musicEnded() {
    currentMusic.audio.addEventListener("ended", () => {
      index++;

      if (index == audios.length) {
        index = 0;
      }

      currentMusic.audio.pause();
      updateDataMusic();
      currentMusic.audio.play();
      btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
    });
  }
});

function secondsToMinutes(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
}