# 🎵 Spotify Genre Analyzer

An interactive web application that allows you to log in with your Spotify account, select any of your playlists (including your "Liked Songs"), and visualize the musical genre distribution in a pie chart.


*(You can place a screenshot of your application in action here)*

---

## ✨ Features

* **Secure Authentication:** Log in with your Spotify account using the OAuth 2.0 Authorization Code Flow.
* **Playlist Access:** Automatically loads all your personal playlists after logging in.
* **"Liked Songs" Analysis:** Treats your list of favorite songs as another playlist to be analyzed.
* **Deep Analysis:** Iterates through all songs in a playlist, no matter how large, thanks to API pagination.
* **Clear Visualization:** Displays the results in an interactive pie chart using Chart.js.
* **Custom Legend:** Includes a scrollable sidebar legend, ideal for playlists with a wide variety of genres.
* **Light/Dark Mode:** A toggle button to switch the interface theme, with your preference saved in the browser.

---

## 🛠️ Tech Stack

* **Backend:**
    * [Node.js](https://nodejs.org/)
    * [Express.js](https://expressjs.com/)
    * [Axios](https://axios-http.com/) for API requests.
    * [express-session](https://www.npmjs.com/package/express-session) to manage user sessions.
* **Frontend:**
    * HTML5 & CSS3
    * Vanilla JavaScript
    * [Chart.js](https://www.chartjs.org/) for charts.
* **API:**
    * [Spotify Web API](https://developer.spotify.com/documentation/web-api)

---

## 🚀 Setup and Installation

Follow these steps to run the project on your local machine.

**1. Clone the repository**
```bash
git clone [https://github.com/your-username/your-repository.git](https://github.com/your-username/your-repository.git)
cd your-repository
```

**2. Install project dependencies**
```bash
npm install
```

**3. Configure your Spotify Application**
* Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
* Click **"Create App"** and give your application a name.
* Once created, go to **"Edit Settings"**.
* In the **"Redirect URIs"** field, add the following URL: `http://localhost:3000/callback`
* Save your changes and copy your **Client ID** and **Client Secret**.

**4. Create the environment variables file**
* In the project root, create a file named `.env`.
* Copy and paste the following content into the file, replacing the placeholder values with your own Spotify credentials.

```env
# Environment variables for the Spotify application

SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID_HERE
SPOTIFY_CLIENT_SECRET=YOUR_SPOTIFY_CLIENT_SECRET_HERE
```
**Important:** The `.env` file is included in `.gitignore`, so your credentials will never be uploaded to GitHub.

**5. Start the server**
```bash
node server.js
```

**6. Open the application in your browser**
Navigate to [http://localhost:3000](http://localhost:3000) and you're all set!

---

## 💻 Usage

1.  Open the application in your browser.
2.  Click the "Login with Spotify" button.
3.  Authorize the application on the Spotify page.
4.  You will be redirected back to the application, where a dropdown menu will appear.
5.  Select one of your playlists to see the genre chart.
6.  Use the 🌙/☀️ button to switch the visual theme.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

# 🎵 Analizador de Géneros de Spotify

Una aplicación web interactiva que te permite iniciar sesión con tu cuenta de Spotify, seleccionar cualquiera de tus playlists (incluyendo tus "Canciones que te gustan") y visualizar la distribución de géneros musicales en una gráfica de pastel.


*(Aquí puedes poner una captura de pantalla de tu aplicación en funcionamiento)*

---

## ✨ Características

* **Autenticación Segura:** Inicio de sesión con tu cuenta de Spotify usando el flujo de autorización OAuth 2.0.
* **Acceso a tus Playlists:** Carga automáticamente todas tus playlists personales después de iniciar sesión.
* **Análisis de "Canciones que te gustan":** Trata tu lista de canciones favoritas como una playlist más para analizar.
* **Análisis Profundo:** Recorre todas las canciones de una playlist, sin importar qué tan grande sea, gracias a la paginación de la API.
* **Visualización Clara:** Muestra los resultados en una gráfica de pastel interactiva usando Chart.js.
* **Leyenda Personalizada:** Incluye una leyenda lateral con scroll, ideal para playlists con una gran variedad de géneros.
* **Modo Claro y Oscuro:** Un botón para cambiar el tema de la interfaz, con tu preferencia guardada en el navegador.

---

## 🛠️ Tecnologías Utilizadas

* **Backend:**
    * [Node.js](https://nodejs.org/)
    * [Express.js](https://expressjs.com/)
    * [Axios](https://axios-http.com/) para las peticiones a la API.
    * [express-session](https://www.npmjs.com/package/express-session) para gestionar las sesiones de usuario.
* **Frontend:**
    * HTML5 y CSS3
    * JavaScript (Vanilla)
    * [Chart.js](https://www.chartjs.org/) para las gráficas.
* **API:**
    * [Spotify Web API](https://developer.spotify.com/documentation/web-api)

---

## 🚀 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

**1. Clona el repositorio**
```bash
git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
cd tu-repositorio
```

**2. Instala las dependencias del proyecto**
```bash
npm install
```

**3. Configura tu aplicación de Spotify**
* Ve al [Dashboard de Desarrolladores de Spotify](https://developer.spotify.com/dashboard/).
* Haz clic en **"Create App"** y dale un nombre a tu aplicación.
* Una vez creada, ve a **"Edit Settings"**.
* En **"Redirect URIs"**, añade la siguiente URL: `http://localhost:3000/callback`
* Guarda los cambios y copia tu **Client ID** y tu **Client Secret**.

**4. Crea el archivo de variables de entorno**
* En la raíz del proyecto, crea un archivo llamado `.env`.
* Copia y pega el siguiente contenido en el archivo, reemplazando los valores con tus propias credenciales de Spotify.

```env
# Variables de entorno para la aplicación de Spotify

SPOTIFY_CLIENT_ID=AQUÍ_VA_TU_CLIENT_ID
SPOTIFY_CLIENT_SECRET=AQUÍ_VA_TU_CLIENT_SECRET
```
**Importante:** El archivo `.env` está incluido en `.gitignore`, por lo que tus credenciales nunca se subirán a GitHub.

**5. Inicia el servidor**
```bash
node server.js
```

**6. Abre la aplicación en tu navegador**
Ve a [http://localhost:3000](http://localhost:3000) y ¡listo!

---

## 💻 Uso

1.  Abre la aplicación en tu navegador.
2.  Haz clic en el botón "Iniciar Sesión con Spotify".
3.  Autoriza la aplicación en la página de Spotify.
4.  Serás redirigido de vuelta a la aplicación, donde aparecerá un menú desplegable.
5.  Selecciona una de tus playlists para ver la gráfica de géneros.
6.  Usa el botón 🌙/☀️ para cambiar el tema visual.
