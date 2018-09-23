import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('*', async (req, res, next) =>
{/*
    const data = {};
    data.children = ReactDOM.renderToString(<App />);
    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(200);
    res.send(`<!doctype html>${html}`);*/
    res.status(200);
    res.send(`<!doctype html><html><head><title>Ну прівєт, безграмотщина безреактова</title></head><body><h3>Позорище.</h3><script>console.info("Рендернувся")</script></body></html>`);

});

app.listen(port, () => console.log(`Listening on port ${port}`));