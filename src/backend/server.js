const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

const BUILD = path.join(__dirname, '../../build/');
const pathToBuild = (filename) => path.join(BUILD, filename);

app.get('/', (req, res) => {
    res.sendFile(pathToBuild('index.html'))
});

app.use('/bundle.js', express.static(pathToBuild('bundle.js')));
app.use('/bundle.css', express.static(pathToBuild('bundle.css')));


app.listen(port, () => {
  console.log(`App started!`)
});
