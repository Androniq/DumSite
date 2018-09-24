const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/users', (req, res) =>
{
    res.send({message:"I am that second code"});
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port);
console.log('Listening on port ' + port);