// public/script.js

// 1. TODO EL CÓDIGO SE ENVUELVE AQUÍ
// Esto asegura que el script se ejecute solo cuando la página esté completamente cargada.
document.addEventListener('DOMContentLoaded', async () => {

    // Referencias a las vistas principales
    const loginView = document.getElementById('login-view');
    const appView = document.getElementById('app-view');

    // 2. PRIMERO VERIFICAMOS LA SESIÓN, antes de hacer cualquier otra cosa
    const sessionResponse = await fetch('/check-session');
    const sessionData = await sessionResponse.json();

    if (sessionData.loggedIn) {
        // 3. SOLO SI ESTÁ LOGUEADO, mostramos la app y buscamos sus elementos internos
        loginView.style.display = 'none';
        appView.style.display = 'block';

        // Ahora es seguro buscar estos elementos porque su contenedor (appView) está visible
        const playlistSelect = document.getElementById('playlist-select');
        const themeToggleButton = document.getElementById('theme-toggle-btn');
        const trackCountDisplay = document.getElementById('track-count-display');
        const loadingMessage = document.getElementById('loadingMessage');
        const chartLayout = document.getElementById('chart-layout-container');

        // Lógica para cargar las playlists
        loadPlaylists(playlistSelect);

        // Lógica para el cambio de playlist
        playlistSelect.addEventListener('change', () => {
            handlePlaylistChange(playlistSelect, chartLayout, trackCountDisplay, loadingMessage);
        });

        // Lógica para el botón de tema (claro/oscuro)
        setupThemeToggle(themeToggleButton);

    } else {
        // Si no está logueado, solo mostramos la vista de login
        loginView.style.display = 'block';
        appView.style.display = 'none';
    }
});


// --- DEFINICIÓN DE FUNCIONES ---
// (He movido la lógica a funciones más pequeñas para que sea más fácil de leer)

let myChart; // Variable global para la instancia del gráfico

async function loadPlaylists(playlistSelectElement) {
    try {
        const response = await fetch('/get-my-playlists');
        const playlists = await response.json();
        
        playlistSelectElement.innerHTML = '<option value="">-- Elige una playlist --</option>';
        playlists.forEach(playlist => {
            const option = document.createElement('option');
            option.value = playlist.id;
            option.textContent = playlist.name;
            playlistSelectElement.appendChild(option);
        });
    } catch (error) {
        alert('Error al cargar tus playlists.');
    }
}

async function handlePlaylistChange(playlistSelectElement, chartLayout, trackCountDisplay, loadingMessage) {
    const playlistId = playlistSelectElement.value;
    
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
                    text: 'Géneros Musicales en la Playlist',
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