function reproducirSonido(btn) {
    btn.addEventListener("click", function () {
        let sonido = new Audio("./src/musica/Crash_Bandicoot_Woah.mp3");
        sonido.play();
    })
};

function reproducirMusica(btn, audio, img) {
    btn.addEventListener("click", function () {
        if (audio.paused) {
            audio.play();
            img.src = "./src/web/Crash_Bailando.gif";
            btn.src = "./src/web/stop.png";
        } else {
            audio.pause();
            audio.currentTime = 0; // reinicia el audio
            btn.src = "./src/web/play.png";
            img.src = "./src/web/Crash_logo.png"
        }
        // Cuando termina el audio
        audio.addEventListener("ended", function () {
            btn.src = "./src/web/play.png";
            img.src = "./src/web/Crash_logo.png";
        });
    });
}

function init() {

    let btnReproducirMusica = document.getElementById("btn-reproducir-musica");
    let imgLogo = document.getElementById("img-logo");
    let musica = new Audio("./src/musica/Crash_Bandicoot_1.mp3");
    
    reproducirMusica(btnReproducirMusica, musica, imgLogo);
    reproducirSonido(imgLogo);
}

init();