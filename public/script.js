// public/script.js
document.addEventListener('DOMContentLoaded', async () => {
    const loginView = document.getElementById('login-view');
    const appView = document.getElementById('app-view');
    const playlistSelect = document.getElementById('playlist-select');
    const loadingMessage = document.getElementById('loadingMessage');
    const chartContainer = document.querySelector('.chart-container');
    
    //Verificar si el usuario ya tiene una sesión activa
    const sessionResponse = await fetch('/check-session');
    const sessionData = await sessionResponse.json();

    if (sessionData.loggedIn) {
        // Si está logueado, mostrar la app y cargar sus playlists
        loginView.style.display = 'none';
        appView.style.display = 'block';
        loadPlaylists();
    } else {
        // Si no, mostrar la vista de login
        loginView.style.display = 'block';
        appView.style.display = 'none';
    }
    
    // Función para cargar las playlists del usuario en el menú desplegable
    async function loadPlaylists() {
        try {
            const response = await fetch('/get-my-playlists');
            const playlists = await response.json();
            
            playlistSelect.innerHTML = '<option value="">-- Elige una playlist --</option>'; // Opción por defecto
            playlists.forEach(playlist => {
                const option = document.createElement('option');
                option.value = playlist.id;
                option.textContent = playlist.name;
                playlistSelect.appendChild(option);
            });
        } catch (error) {
            alert('Error al cargar tus playlists.');
        }
    }

    // Evento que se dispara al seleccionar una playlist
    playlistSelect.addEventListener('change', async () => {
        const playlistId = playlistSelect.value;
        if (!playlistId) {
            chartContainer.style.display = 'none';
            return;
        }

        loadingMessage.style.display = 'block';
        chartContainer.style.display = 'none';

        try {
            const response = await fetch(`/get-genres?id=${playlistId}`);
            const genreData = await response.json();

            if (!response.ok) throw new Error(genreData.error || 'Error desconocido');

            loadingMessage.style.display = 'none';
            chartContainer.style.display = 'block';
            
            const labels = Object.keys(genreData);
            const data = Object.values(genreData);
            renderChart(labels, data);
        } catch (error) {
            loadingMessage.style.display = 'none';
            alert(`Error al analizar la playlist: ${error.message}`);
        }
    });
});

let myChart; // Variable para la instancia del gráfico

// --- LÓGICA PARA EL CAMBIO DE TEMA ---

const themeToggleButton = document.getElementById('theme-toggle-btn');

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

    // Guardar la preferencia del usuario y cambiar el ícono
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggleButton.innerHTML = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggleButton.innerHTML = '🌙';
    }

    //Si hay una gráfica visible, volver a dibujarla con los colores del nuevo tema
    if (myChart) {
        // Obtenemos los datos actuales antes de destruir la gráfica
        const labels = myChart.data.labels;
        const data = myChart.data.datasets[0].data;
        renderChart(labels, data); // Volvemos a llamar a renderChart
    }
});

function renderChart(labels, data) {
    const ctx = document.getElementById('genreChart').getContext('2d');
    if (myChart) {
        myChart.destroy();
    }
    
    // Determinamos el color del texto basado en el tema actual
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
                    color: textColor // Aplicamos el color al título
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

/**

 * @param {Chart} chart - La instancia del gráfico de Chart.js
 */
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