// public/script.js

// 1. Inicia la animación de partículas inmediatamente.
//tsParticles.loadJSON("particles-js", "particles.json");

// --- VARIABLES GLOBALES ---
let myChart; // Variable para la instancia del gráfico

// --- LÓGICA PRINCIPAL DE LA PÁGINA ---
document.addEventListener('DOMContentLoaded', async () => {
    // Referencias a las vistas
    const loginView = document.getElementById('login-view');
    const appView = document.getElementById('app-view');
     
    await tsParticles.load("particles-js",{
  "autoPlay": true,
  "background": {
    "color": {
      "value": "#0d47a1"
    },
    "image": "",
    "position": "",
    "repeat": "",
    "size": "",
    "opacity": 1
  },
  "backgroundMask": {
    "composite": "destination-out",
    "cover": {
      "opacity": 1,
      "color": {
        "value": ""
      }
    },
    "enable": false
  },
  "clear": true,
  "defaultThemes": {},
  "delay": 0,
  "detectRetina": true,
  "duration": 0,
  "fpsLimit": 120,
  "interactivity": {
    "detectsOn": "window",
    "events": {
      "onClick": {
        "enable": true,
        "mode": "push"
      },
      "onDiv": {
        "selectors": [],
        "enable": false,
        "mode": [],
        "type": "circle"
      },
      "onHover": {
        "enable": false,
        "mode": "repulse",
        "parallax": {
          "enable": false,
          "force": 60,
          "smooth": 10
        }
      },
      "resize": {
        "delay": 0.5,
        "enable": true
      }
    },
    "modes": {
      "trail": {
        "delay": 1,
        "pauseOnStop": false,
        "quantity": 1
      },
      "attract": {
        "distance": 200,
        "duration": 0.4,
        "easing": "ease-out-quad",
        "factor": 1,
        "maxSpeed": 50,
        "speed": 1
      },
      "bounce": {
        "distance": 200
      },
      "bubble": {
        "distance": 400,
        "duration": 2,
        "mix": false,
        "opacity": 0.8,
        "size": 40,
        "divs": {
          "distance": 200,
          "duration": 0.4,
          "mix": false,
          "selectors": []
        }
      },
      "connect": {
        "distance": 80,
        "links": {
          "opacity": 0.5
        },
        "radius": 60
      },
      "grab": {
        "distance": 400,
        "links": {
          "blink": false,
          "consent": false,
          "opacity": 1
        }
      },
      "push": {
        "default": true,
        "groups": [],
        "quantity": 4
      },
      "remove": {
        "quantity": 2
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4,
        "factor": 100,
        "speed": 1,
        "maxSpeed": 50,
        "easing": "ease-out-quad",
        "divs": {
          "distance": 200,
          "duration": 0.4,
          "factor": 100,
          "speed": 1,
          "maxSpeed": 50,
          "easing": "ease-out-quad",
          "selectors": []
        }
      },
      "slow": {
        "factor": 3,
        "radius": 200
      },
      "particle": {
        "replaceCursor": false,
        "pauseOnStop": false,
        "stopDelay": 0
      },
      "light": {
        "area": {
          "gradient": {
            "start": {
              "value": "#ffffff"
            },
            "stop": {
              "value": "#000000"
            }
          },
          "radius": 1000
        },
        "shadow": {
          "color": {
            "value": "#000000"
          },
          "length": 2000
        }
      }
    }
  },
  "manualParticles": [],
  "particles": {
    "bounce": {
      "horizontal": {
        "value": 1
      },
      "vertical": {
        "value": 1
      }
    },
    "collisions": {
      "absorb": {
        "speed": 2
      },
      "bounce": {
        "horizontal": {
          "value": 1
        },
        "vertical": {
          "value": 1
        }
      },
      "enable": true,
      "maxSpeed": 50,
      "mode": "bounce",
      "overlap": {
        "enable": true,
        "retries": 0
      }
    },
    "color": {
      "value": "#ffffff",
      "animation": {
        "h": {
          "count": 0,
          "enable": false,
          "speed": 1,
          "decay": 0,
          "delay": 0,
          "sync": true,
          "offset": 0
        },
        "s": {
          "count": 0,
          "enable": false,
          "speed": 1,
          "decay": 0,
          "delay": 0,
          "sync": true,
          "offset": 0
        },
        "l": {
          "count": 0,
          "enable": false,
          "speed": 1,
          "decay": 0,
          "delay": 0,
          "sync": true,
          "offset": 0
        }
      }
    },
    "effect": {
      "close": true,
      "fill": true,
      "options": {},
      "type": []
    },
    "groups": {},
    "move": {
      "angle": {
        "offset": 0,
        "value": 90
      },
      "attract": {
        "distance": 200,
        "enable": false,
        "rotate": {
          "x": 3000,
          "y": 3000
        }
      },
      "center": {
        "x": 50,
        "y": 50,
        "mode": "percent",
        "radius": 0
      },
      "decay": 0,
      "distance": {},
      "direction": "none",
      "drift": 0,
      "enable": true,
      "gravity": {
        "acceleration": 9.81,
        "enable": false,
        "inverse": false,
        "maxSpeed": 50
      },
      "path": {
        "clamp": true,
        "delay": {
          "value": 0
        },
        "enable": false,
        "options": {}
      },
      "outModes": {
        "default": "out",
        "bottom": "out",
        "left": "out",
        "right": "out",
        "top": "out"
      },
      "random": false,
      "size": false,
      "speed": 10,
      "spin": {
        "acceleration": 0,
        "enable": false
      },
      "straight": false,
      "trail": {
        "enable": false,
        "length": 10,
        "fill": {}
      },
      "vibrate": false,
      "warp": false
    },
    "number": {
      "density": {
        "enable": true,
        "width": 1920,
        "height": 1080
      },
      "limit": {
        "mode": "delete",
        "value": 0
      },
      "value": 80
    },
    "opacity": {
      "value": 0.5,
      "animation": {
        "count": 0,
        "enable": false,
        "speed": 2,
        "decay": 0,
        "delay": 0,
        "sync": false,
        "mode": "auto",
        "startValue": "random",
        "destroy": "none"
      }
    },
    "reduceDuplicates": false,
    "shadow": {
      "blur": 0,
      "color": {
        "value": "#000"
      },
      "enable": false,
      "offset": {
        "x": 0,
        "y": 0
      }
    },
    "shape": {
      "close": true,
      "fill": true,
      "options": {},
      "type": "circle"
    },
    "size": {
      "value": {
        "min": 10,
        "max": 15
      },
      "animation": {
        "count": 0,
        "enable": false,
        "speed": 5,
        "decay": 0,
        "delay": 0,
        "sync": false,
        "mode": "auto",
        "startValue": "random",
        "destroy": "none"
      }
    },
    "stroke": {
      "width": 0
    },
    "zIndex": {
      "value": 0,
      "opacityRate": 1,
      "sizeRate": 1,
      "velocityRate": 1
    },
    "destroy": {
      "bounds": {},
      "mode": "none",
      "split": {
        "count": 1,
        "factor": {
          "value": 3
        },
        "rate": {
          "value": {
            "min": 4,
            "max": 9
          }
        },
        "sizeOffset": true,
        "particles": {}
      }
    },
    "roll": {
      "darken": {
        "enable": false,
        "value": 0
      },
      "enable": false,
      "enlighten": {
        "enable": false,
        "value": 0
      },
      "mode": "vertical",
      "speed": 25
    },
    "tilt": {
      "value": 0,
      "animation": {
        "enable": false,
        "speed": 0,
        "decay": 0,
        "sync": false
      },
      "direction": "clockwise",
      "enable": false
    },
    "twinkle": {
      "lines": {
        "enable": false,
        "frequency": 0.05,
        "opacity": 1
      },
      "particles": {
        "enable": false,
        "frequency": 0.05,
        "opacity": 1
      }
    },
    "wobble": {
      "distance": 5,
      "enable": false,
      "speed": {
        "angle": 50,
        "move": 10
      }
    },
    "life": {
      "count": 0,
      "delay": {
        "value": 0,
        "sync": false
      },
      "duration": {
        "value": 0,
        "sync": false
      }
    },
    "rotate": {
      "value": 0,
      "animation": {
        "enable": false,
        "speed": 0,
        "decay": 0,
        "sync": false
      },
      "direction": "clockwise",
      "path": false
    },
    "orbit": {
      "animation": {
        "count": 0,
        "enable": false,
        "speed": 1,
        "decay": 0,
        "delay": 0,
        "sync": false
      },
      "enable": false,
      "opacity": 1,
      "rotation": {
        "value": 45
      },
      "width": 1
    },
    "links": {
      "blink": false,
      "color": {
        "value": "#ffffff"
      },
      "consent": false,
      "distance": 150,
      "enable": false,
      "frequency": 1,
      "opacity": 0.4,
      "shadow": {
        "blur": 5,
        "color": {
          "value": "#000"
        },
        "enable": false
      },
      "triangles": {
        "enable": false,
        "frequency": 1
      },
      "width": 1,
      "warp": false
    },
    "repulse": {
      "value": 0,
      "enabled": false,
      "distance": 1,
      "duration": 1,
      "factor": 1,
      "speed": 1
    }
  },
  "pauseOnBlur": true,
  "pauseOnOutsideViewport": true,
  "responsive": [],
  "smooth": false,
  "style": {},
  "themes": [],
  "zLayers": 100,
  "key": "collisionsBounce",
  "name": "Collisions Bounce",
  "motion": {
    "disable": false,
    "reduce": {
      "factor": 4,
      "value": true
    }
  }

    }) 
  
  

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