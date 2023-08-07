const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/mostrar-pagina',
    proxy({
      target: 'http://localhost:5000', // El puerto donde estará el servidor Express
      changeOrigin: true,
    })
  );
};
