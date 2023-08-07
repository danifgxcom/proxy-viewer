const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const puppeteer = require('puppeteer');

const app = express();
const port = 5000; // Puedes cambiar el puerto según tus necesidades

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/mostrar-pagina', async (req, res) => {
  const url = req.query.url;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    $('img').each((index, element) => {
      const originalSrc = $(element).attr('src');
      if (!originalSrc.startsWith('http') && !originalSrc.startsWith('/')) {
        const absoluteSrc = new URL(originalSrc, url).href;
        $(element).attr('src', absoluteSrc);
      }
    });

    const renderedHTML = $.html();

    res.send(renderedHTML);
  } catch (error) {
    console.error('Error al descargar o renderizar el HTML:', error);
    res.status(500).send('Error al procesar la solicitud');
  }
});

app.get('/descargar-pdf', async (req, res) => {
  const url = req.query.url;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    $('img').each((index, element) => {
      const originalSrc = $(element).attr('src');
      if (!originalSrc.startsWith('http') && !originalSrc.startsWith('/')) {
        const absoluteSrc = new URL(originalSrc, url).href;
        $(element).attr('src', absoluteSrc);
      }
    });

    const renderedHTML = $.html();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(renderedHTML);
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar o enviar el PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
});

app.use(express.static(path.join(__dirname, 'visor-react', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'visor-react', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
