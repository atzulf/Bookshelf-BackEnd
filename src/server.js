// deklarasi variabel hapi dan routes
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

// fungsi untuk menjalankan server
const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // // menambahkan routes
  server.route(routes);

  // menjalankan server
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

// menjalankan fungsi init
init();