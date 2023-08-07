import React, { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const VisorHTML = () => {
  const [url, setUrl] = useState('');
  const [html, setHtml] = useState('');

  const handleMostrarPagina = async () => {
    try {
      const response = await axios.get('/mostrar-pagina', {
        params: { url },
      });
      setHtml(response.data);
    } catch (error) {
      console.error('Error al mostrar la página:', error);
      setHtml('Error al mostrar la página. Verifica la URL o intenta nuevamente.');
    }
  };

  const handleDescargarPDF = () => {
    const element = document.getElementById('html-content');

    html2pdf()
      .from(element)
      .save('archivo.pdf');
  };

  return (
    <div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Ingresa la URL de la página"
      />
      <button onClick={handleMostrarPagina}>Mostrar Página</button>
      <button onClick={handleDescargarPDF}>Descargar PDF</button>
      <div id="html-content" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default VisorHTML;
