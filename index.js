const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/users', (req, res) =>
{
    res.send({message:"I am that second code3"});
});

//if (process.env.NODE_ENV === 'production')
{
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
}
//else
{

}

const port = process.env.PORT || 3001;

app.listen(port);
console.log('Listening on port ' + port);