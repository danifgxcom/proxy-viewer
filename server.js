const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const port = 5000; // Puedes cambiar el puerto según tus necesidades

// Middleware para parsear datos en formato JSON
app.use(express.json());

// Ruta para servir imágenes estáticas desde la carpeta "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

// Definir una ruta para recibir la URL y enviar el HTML renderizado
app.get('/mostrar-pagina', async (req, res) => {
  const url = req.query.url; // La URL que se pasa como parámetro en la solicitud

  try {
    // Realizar la solicitud HTTP para descargar el contenido HTML
    const response = await axios.get(url);
    const html = response.data;

    // Renderizar el HTML usando Cheerio para obtener el contenido completo con recursos cargados
    const $ = cheerio.load(html);

    // Iterar sobre las imágenes y modificar sus rutas para que sean absolutas
    $('img').each((index, element) => {
      const originalSrc = $(element).attr('src');

      // Verificar si la ruta de la imagen es relativa
      if (!originalSrc.startsWith('http') && !originalSrc.startsWith('/')) {
        // Convertir la ruta relativa en una ruta absoluta usando el host de la página solicitada
        const absoluteSrc = new URL(originalSrc, url).href;
        $(element).attr('src', absoluteSrc);
      }
    });

    // Enviar el HTML renderizado al cliente
    res.send($.html());
  } catch (error) {
    console.error('Error al descargar o renderizar el HTML:', error);
    res.status(500).send('Error al procesar la solicitud');
  }
});

// Servir la aplicación React desde la carpeta "visor-react/build" (asegúrate de haber creado el build previamente)
app.use(express.static(path.join(__dirname, 'visor-react', 'build')));

// Ruta de fallback para manejar cualquier otra solicitud y servir el archivo "index.html" de la aplicación React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'visor-react', 'build', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
