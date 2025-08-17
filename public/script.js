// public/script.js

// 1. TODO EL CÓDIGO SE ENVUELVE AQUÍ
// Esto asegura que el script se ejecute solo cuando la página esté completamente cargada.
tsParticles.loadJSON("particles-js", "/particles.json");

document.addEventListener('DOMContentLoaded', async () => {
    const loginView = document.getElementById('login-view');
    const appView = document.getElementById('app-view');

    const sessionResponse = await fetch('/check-session');
    const sessionData = await sessionResponse.json();

    if (sessionData.loggedIn) {
        // Si el usuario ya inició sesión
        loginView.style.display = 'none';
        appView.style.display = 'block';
        updateUIText(sessionData.service); // Actualizamos el texto de la UI
        const playlistSelect = document.getElementById('playlist-select');
        const themeToggleButton = document.getElementById('theme-toggle-btn');
        
        setupThemeToggle(themeToggleButton); // Configura el botón del tema

        // Decide qué playlists cargar según el servicio
        if (sessionData.service === 'spotify') {
            loadPlaylists('/get-my-playlists', playlistSelect, 'spotify');
            // Cuando el usuario elija una playlist, analiza los géneros
            playlistSelect.addEventListener('change', handleSpotifyPlaylistChange);
        } else if (sessionData.service === 'youtube') {
            loadPlaylists('/get-my-youtube-playlists', playlistSelect, 'youtube');
            // Cuando el usuario elija una playlist, busca las canciones
            playlistSelect.addEventListener('change', handleYouTubePlaylistChange);
        }

    } else {
        // Si el usuario no ha iniciado sesión
        loginView.style.display = 'block';
        appView.style.display = 'none';
    }
    const modal = document.getElementById('feedback-modal');
    const openBtn = document.getElementById('open-feedback-btn');
    const closeBtn = document.querySelector('.close-btn');
    const commentForm = document.getElementById('comment-form');

    // Función para cargar los comentarios desde el servidor
    const loadComments = async () => {
        const commentsList = document.getElementById('comments-list');
        try {
            const response = await fetch('/api/comments');
            const comments = await response.json();
            commentsList.innerHTML = ''; // Limpiar lista
            comments.forEach(comment => {
                const div = document.createElement('div');
                div.classList.add('comment-item');
                div.innerHTML = `<strong>${escapeHTML(comment.author || 'Anónimo')}</strong><p>${escapeHTML(comment.text)}</p>`;
                commentsList.appendChild(div);
            });
        } catch (error) {
            commentsList.innerHTML = 'No se pudieron cargar los comentarios.';
        }
    };

    // Abrir el modal
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('visible');
        loadComments();
});


// Cerrar el modal
    closeBtn.addEventListener('click', () => modal.classList.remove('visible'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Si se hace clic en el fondo oscuro
            modal.classList.remove('visible');
        }
    });

    // Enviar un nuevo comentario
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const authorInput = document.getElementById('author-input');
        const textInput = document.getElementById('text-input');

        const newComment = {
            author: authorInput.value || 'Anónimo',
            text: textInput.value
        };

        try {
            await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newComment)
            });
            authorInput.value = '';
            textInput.value = '';
            loadComments(); // Recargar comentarios
        } catch (error) {
            alert('Error al enviar el comentario.');
        }
    });
});

// Función de seguridad para evitar inyección de HTML
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag));
}


// --- DEFINICIÓN DE FUNCIONES ---

let myChart; // Variable para la instancia del gráfico

// Función genérica para cargar las listas de reproducción
async function loadPlaylists(url, playlistSelectElement, service) {
    try {
        const response = await fetch(url);
        const playlists = await response.json();
        
        playlistSelectElement.innerHTML = '<option value="">-- Elige una playlist --</option>';

        if (service === 'spotify') {
            const likedOption = document.createElement('option');
            likedOption.value = 'liked';
            likedOption.textContent = '❤️ Canciones que te gustan';
            playlistSelectElement.appendChild(likedOption);
        }

        playlists.forEach(playlist => {
            const option = document.createElement('option');
            option.value = playlist.id;
            option.textContent = playlist.name || playlist.snippet.title; 
            playlistSelectElement.appendChild(option);
        });
    } catch (error) {
        alert('Error al cargar tus playlists.');
    }
}

async function handleSpotifyPlaylistChange() {
    const playlistSelect = document.getElementById('playlist-select');
    const playlistId = playlistSelect.value; // <-- Obtenemos el VALOR, no el elemento
    
    const chartLayout = document.getElementById('chart-layout-container');
    const trackCountDisplay = document.getElementById('track-count-display');
    const loadingMessage = document.getElementById('loadingMessage');

    trackCountDisplay.textContent = '';
    if (myChart) myChart.destroy();
    if (!playlistId) {
        chartLayout.style.display = 'none';
        return;
    }

    loadingMessage.style.display = 'block';
    chartLayout.style.display = 'none';

    try {
        const response = await fetch(`/get-genres?id=${playlistId}`);
        const analysisData = await response.json();

        if (!response.ok) throw new Error(analysisData.error || 'Error desconocido');

        const genreData = analysisData.genreCounts;
        const totalTracks = analysisData.totalTracks;

        trackCountDisplay.textContent = `Análisis basado en ${totalTracks} canciones.`;
        loadingMessage.style.display = 'none';
        chartLayout.style.display = 'flex';
        
        const labels = Object.keys(genreData);
        const data = Object.values(genreData);

        if (labels.length > 0) {
            renderChart(labels, data);
        } else {
            trackCountDisplay.textContent += ' No se encontraron géneros para analizar.';
        }
    } catch (error) {
        loadingMessage.style.display = 'none';
        trackCountDisplay.textContent = `Error al analizar la playlist: ${error.message}`;
    }
}

// public/script.js

async function handleYouTubePlaylistChange() {
    const playlistSelect = document.getElementById('playlist-select');
    const playlistId = playlistSelect.value;
    const chartLayout = document.getElementById('chart-layout-container');
    const trackCountDisplay = document.getElementById('track-count-display');
    const loadingMessage = document.getElementById('loadingMessage');
    
    trackCountDisplay.textContent = '';
    if (myChart) myChart.destroy();

    if (!playlistId) {
        chartLayout.style.display = 'none';
        return;
    }

    loadingMessage.textContent = 'Obteniendo canciones de YouTube...';
    loadingMessage.style.display = 'block';
    chartLayout.style.display = 'none';

    try {
        // 1. Pedimos la lista de canciones a nuestro servidor (GET)
        const itemsResponse = await fetch(`/get-youtube-playlist-items?id=${playlistId}`);
        if (!itemsResponse.ok) throw new Error('No se pudieron obtener las canciones de la playlist.');
        const tracks = await itemsResponse.json();

        trackCountDisplay.textContent = `Se encontraron ${tracks.length} canciones. Analizando géneros con Spotify...`;
        loadingMessage.textContent = 'Analizando géneros... (esto puede tardar)';

        // 2. Enviamos esa lista a nuestro servidor para que la analice (POST)
        // ESTA ES LA PARTE IMPORTANTE A VERIFICAR
        const analysisResponse = await fetch('/analyze-youtube-playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tracks: tracks })
        });
        
        const analysisData = await analysisResponse.json();

        // Verificamos si la respuesta del análisis fue un error
        if (!analysisResponse.ok) {
            throw new Error(analysisData.error || 'Error desconocido del servidor');
        }

        // 3. Mostramos los resultados
        trackCountDisplay.textContent = `Análisis basado en ${analysisData.totalTracks} canciones encontradas.`;
        loadingMessage.style.display = 'none';
        chartLayout.style.display = 'flex';
        
        const labels = Object.keys(analysisData.genreCounts);
        const data = Object.values(analysisData.genreCounts);

        if (labels.length > 0) {
            renderChart(labels, data);
        } else {
            trackCountDisplay.textContent += ' No se encontraron géneros para analizar.';
        }
    } catch (error) {
        loadingMessage.style.display = 'none';
        trackCountDisplay.textContent = `Error al analizar la playlist: ${error.message}`;
    }
}

/**
 * Actualiza los textos de la UI según el servicio con el que se inició sesión.
 * @param {string} service - El nombre del servicio 
 */
function updateUIText(service) {
    const mainTitle = document.getElementById('main-title');
    const selectLabel = document.getElementById('select-label');
    const chartTitle = myChart ? myChart.options.plugins.title : null;

    if (service === 'spotify') {
        mainTitle.textContent = 'Analizador de Géneros para Playlists de Spotify';
        selectLabel.textContent = 'Selecciona una de tus playlists de Spotify para analizar:';
        if (chartTitle) chartTitle.text = 'Géneros Musicales en la Playlist de Spotify';
    } else if (service === 'youtube') {
        mainTitle.textContent = 'Analizador de Géneros para Playlists de YouTube';
        selectLabel.textContent = 'Selecciona una de tus playlists de YouTube para analizar:';
        if (chartTitle) chartTitle.text = 'Géneros Musicales en la Playlist de YouTube';
    }

    if (myChart) myChart.update(); // Actualiza la gráfica si ya existe
}

function setupThemeToggle(themeToggleButton) {
    // Aplicar el tema guardado al cargar la página
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleButton.innerHTML = '☀️';
    } else {
        themeToggleButton.innerHTML = '🌙';
    }

    // Evento de clic para el botón
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggleButton.innerHTML = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleButton.innerHTML = '🌙';
        }

        if (myChart) {
            const labels = myChart.data.labels;
            const data = myChart.data.datasets[0].data;
            renderChart(labels, data);
        }
    });
}

function renderChart(labels, data) {
    const ctx = document.getElementById('genreChart').getContext('2d');
    if (myChart) {
        myChart.destroy();
    }
     
    const serviceName = document.getElementById('main-title').textContent.includes('Spotify') ? 'Spotify' : 'YouTube';
    const chartTitleText = `Géneros Musicales en la Playlist de ${serviceName}`;
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#333';

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distribución de Géneros',
                data: data,
                backgroundColor: generateRandomColors(labels.length),
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false 
                },
                title: {
                    display: true,
                    text: chartTitleText,
                    color: textColor
                }
            }
        }
    });

    generateHtmlLegend(myChart);
}

function generateRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = (i * (360 / count)) % 360;
        colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
}

function generateHtmlLegend(chart) {
    const legendContainer = document.getElementById('legend-container');
    legendContainer.innerHTML = ''; 

    const legendItems = chart.data.labels.map((label, index) => {
        const backgroundColor = chart.data.datasets[0].backgroundColor[index];
        return {
            text: label,
            fillStyle: backgroundColor
        };
    });

    legendItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('legend-item');
        const colorBox = document.createElement('span');
        colorBox.classList.add('legend-color-box');
        colorBox.style.backgroundColor = item.fillStyle;
        const text = document.createTextNode(item.text);
        div.appendChild(colorBox);
        div.appendChild(text);
        legendContainer.appendChild(div);
    });
}