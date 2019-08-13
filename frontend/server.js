const express = require('express');
const proxy = require('http-proxy-middleware');
const morgan = require('morgan');
const app = express();
const port = 9194;


const backendUrl = process.argv[2]

app.use(morgan('tiny'));
app.use(express.static('build'));
app.use(
  '/api',
  proxy({
    target: backendUrl,
    changeOrigin: true,
  }),
);
app.use((req, res, next) => {
  res.status(200).sendFile(`${__dirname}/build/index.html`);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
