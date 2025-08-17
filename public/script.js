// public/script.js

// 1. Inicia la animación de partículas inmediatamente.
//tsParticles.loadJSON("particles-js", "particles.json");

// --- VARIABLES GLOBALES ---
let myChart; // Variable para la instancia del gráfico
let vantaEffect = null;

function getVantaColor() {
  // elige un color distinto para modo oscuro si quieres
  return document.body.classList.contains('dark-mode') ? 0x0b1437 : 0x0d47a1;
}
function vantaPalette() {
  const dark = document.body.classList.contains('dark-mode');
  return {
    // color de las olas
    color: dark ? 0x66e0ff : 0x2196f3,
    waveHeight: dark ? 12 : 10,
    waveSpeed: 0.6,
    shininess: 60,
    zoom: 1.03
  };
}
function initVanta() {
  if (vantaEffect) vantaEffect.destroy();

  const p = vantaPalette();
  vantaEffect = VANTA.WAVES({
    el: "#vanta-bg",
    color: p.color,
    waveHeight: p.waveHeight,
    waveSpeed: p.waveSpeed,
    shininess: p.shininess,
    zoom: p.zoom,
    backgroundAlpha: 0.0 // 👈 canvas transparente (deja ver el degradado CSS)
  });
}

function spawnDecorShapes(count = (window.innerWidth < 720 ? 8 : 12)) {
  const container = document.getElementById('decor-shapes');
  if (!container) return;
  container.innerHTML = ''; // limpia por si recargas

  const types = ['bubble', 'ring', 'triangle', 'square'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'shape ' + types[Math.floor(Math.random() * types.length)];

    const sz = Math.floor(60 + Math.random() * 140);               // 60–200px
    const top = Math.floor(5 + Math.random() * 85);                 // 5–90%
    const left = Math.floor(5 + Math.random() * 90);                // 5–95%
    const drift = (Math.random() * 220 - 110).toFixed(0) + 'px';    // -110–110px
    const durY = (12 + Math.random() * 12).toFixed(1) + 's';        // 12–24s
    const durX = (20 + Math.random() * 22).toFixed(1) + 's';        // 20–42s
    const durR = (35 + Math.random() * 40).toFixed(1) + 's';        // 35–75s
    const scale = (0.7 + Math.random() * 0.8).toFixed(2);           // 0.7–1.5

    el.style.setProperty('--sz', sz + 'px');
    el.style.setProperty('--top', top + '%');
    el.style.setProperty('--left', left + '%');
    el.style.setProperty('--drift', drift);
    el.style.setProperty('--durY', durY);
    el.style.setProperty('--durX', durX);
    el.style.setProperty('--durR', durR);
    el.style.setProperty('--scale', scale);

    container.appendChild(el);
  }
}

// --- LÓGICA PRINCIPAL DE LA PÁGINA ---
document.addEventListener('DOMContentLoaded', async () => {
    // Referencias a las vistas
    const loginView = document.getElementById('login-view');
    const appView = document.getElementById('app-view');
     
    initVanta();
    spawnDecorShapes();
  

    // Verifica la sesión del usuario
    const sessionResponse = await fetch('/check-session');
    const sessionData = await sessionResponse.json();

    if (sessionData.loggedIn) {
        // Si el usuario ya inició sesión
        loginView.style.display = 'none';
        appView.style.display = 'block';
        updateUIText(sessionData.service);
        
        const playlistSelect = document.getElementById('playlist-select');
        const themeToggleButton = document.getElementById('theme-toggle-btn');
        
        setupThemeToggle(themeToggleButton);

        // Decide qué playlists y eventos cargar
        if (sessionData.service === 'spotify') {
            loadPlaylists('/get-my-playlists', playlistSelect, 'spotify');
            playlistSelect.addEventListener('change', handleSpotifyPlaylistChange);
        } else if (sessionData.service === 'youtube') {
            loadPlaylists('/get-my-youtube-playlists', playlistSelect, 'youtube');
            playlistSelect.addEventListener('change', handleYouTubePlaylistChange);
        }
    } else {
        // Si no ha iniciado sesión
        loginView.style.display = 'block';
        appView.style.display = 'none';
    }

    // Configura la lógica del modal de comentarios (siempre disponible)
    setupFeedbackModal();
});


// --- DEFINICIÓN DE FUNCIONES ---

function setupFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    const openBtn = document.getElementById('open-feedback-btn');
    const closeBtn = document.querySelector('.close-btn');
    const commentForm = document.getElementById('comment-form');

    const loadComments = async () => {
        const commentsList = document.getElementById('comments-list');
        try {
            const response = await fetch('/api/comments');
            const comments = await response.json();
            commentsList.innerHTML = '';
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

    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('visible');
        loadComments();
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('visible'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('visible');
    });

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
            loadComments();
        } catch (error) {
            alert('Error al enviar el comentario.');
        }
    });
}

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

    loadingMessage.style.display = 'block';
    chartLayout.style.display = 'none';

    try {
        const response = await fetch(`/get-genres?id=${playlistId}`);
        const analysisData = await response.json();
        if (!response.ok) throw new Error(analysisData.error || 'Error desconocido');

        trackCountDisplay.textContent = `Análisis basado en ${analysisData.totalTracks} canciones.`;
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
        const itemsResponse = await fetch(`/get-youtube-playlist-items?id=${playlistId}`);
        if (!itemsResponse.ok) throw new Error('No se pudieron obtener las canciones.');
        const tracks = await itemsResponse.json();

        loadingMessage.textContent = 'Analizando géneros... (esto puede tardar)';
        trackCountDisplay.textContent = `Se encontraron ${tracks.length} canciones. Analizando...`;
        
        const analysisResponse = await fetch('/analyze-youtube-playlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tracks: tracks })
        });
        const analysisData = await analysisResponse.json();
        if (!analysisResponse.ok) throw new Error(analysisData.error || 'Error desconocido del servidor');
        
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

function updateUIText(service) {
    const mainTitle = document.getElementById('main-title');
    const selectLabel = document.getElementById('select-label');

    if (service === 'spotify') {
        mainTitle.textContent = 'Analizador de Géneros para Playlists de Spotify';
        selectLabel.textContent = 'Selecciona una de tus playlists de Spotify:';
    } else if (service === 'youtube') {
        mainTitle.textContent = 'Analizador de Géneros para Playlists de YouTube';
        selectLabel.textContent = 'Selecciona una de tus playlists de YouTube:';
    }
}

function setupThemeToggle(themeToggleButton) {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleButton.innerHTML = '☀️';
    } else {
        themeToggleButton.innerHTML = '🌙';
    }
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
            renderChart(myChart.data.labels, myChart.data.datasets[0].data);
        }
        initVanta();
    });
}

function renderChart(labels, data) {
    const ctx = document.getElementById('genreChart').getContext('2d');
    if (myChart) myChart.destroy();
    
    const serviceName = document.getElementById('main-title').textContent.includes('Spotify') ? 'Spotify' : 'YouTube';
    const chartTitleText = `Géneros Musicales en la Playlist de ${serviceName}`;
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#333';

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: generateRandomColors(labels.length),
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
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
    const legendItems = chart.data.labels.map((label, index) => ({
        text: label,
        fillStyle: chart.data.datasets[0].backgroundColor[index]
    }));
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

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}