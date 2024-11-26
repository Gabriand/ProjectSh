document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('musicaFondo');
    
    if (!audio) {
        console.error('No se encontró el elemento de audio');
        return;
    }

    audio.preload = "auto";

    const audioSource = audio.querySelector('source');
    if (!audioSource || !audioSource.src) {
        console.error('No hay fuente de audio definida');
        return;
    }

    // Configurar el volumen
    audio.volume = 0.3;
    
    // Verificar si la música ya estaba reproduciéndose
    const musicaActiva = localStorage.getItem('musicaActiva') === 'true';
    const tiempoGuardado = parseFloat(localStorage.getItem('tiempoMusica') || '0');

    if (musicaActiva) {
        // En lugar de reproducir inmediatamente, esperamos la primera interacción
        document.addEventListener('click', async function iniciarMusica() {
            audio.currentTime = tiempoGuardado;
            try {
                await audio.play();
            } catch (error) {
                console.error('Error al reproducir:', error);
            }
            document.removeEventListener('click', iniciarMusica);
        }, { once: true });
    }

    // Guardar el tiempo actual periódicamente
    setInterval(() => {
        if (!audio.paused) {
            localStorage.setItem('tiempoMusica', audio.currentTime.toString());
        }
    }, 1000);

    // Para la primera reproducción
    if (!musicaActiva) {
        document.addEventListener('click', async function playAudio() {
            try {
                if (audio.readyState < 3) {
                    await new Promise((resolve) => {
                        audio.addEventListener('canplay', resolve, { once: true });
                    });
                }
                await audio.play();
                localStorage.setItem('musicaActiva', 'true');
            } catch (error) {
                console.error('Error al reproducir el audio:', error);
            }
            document.removeEventListener('click', playAudio);
        }, { once: true });
    }
});