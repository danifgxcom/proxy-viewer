import React, { useState } from 'react';
import axios from 'axios';

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

  const handleDescargarPDF = async () => {
    try {
      // Realizar la solicitud al servidor para generar y descargar el PDF
      await axios.get('/descargar-pdf', {
        params: { url },
        responseType: 'blob', // Indicar que se espera una respuesta tipo blob (archivo)
      }).then(response => {
        // Crear un enlace temporal para descargar el PDF
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'archivo.pdf';
        a.click();
        // Liberar el enlace temporal
        window.URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
    }
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
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default VisorHTML;
