import express from 'express';
import path from 'path';
import serverRenderer from './serverTools/renderer';

const app = express();

const router = express.Router();

// root (/) should always serve our server rendered page
router.use('^/$', serverRenderer);

// other static resources should just be served as they are
router.use(express.static(
    path.resolve(__dirname, 'dist'),
    { maxAge: '30d' },
));

// tell the app to use the above rules
app.use(router);

var counter = 1;

app.get('/api/hello', (req, res) =>
{    
    res.send({ message: `Message #${counter++} from the server!` });
});

app.get('/api/article/:id', (req, res) =>
{    
    res.send({ message: `Text of article #${req.params.id}.` });
});

app.get('*', serverRenderer);

const defaultPort = process.env.DEVMODE ? 3001 : 3000;
// if not in production, we should be able to run server and client on different ports simultaneously (and use proxy on client to redirect API calls).

const port = process.env.PORT || defaultPort;

app.listen(port, (error) =>
{
    if (error)
    {
        console.error('Error on trying to listen to port ' + port, error);
        return;
    }
    console.log("Listening on port " + port + "...");
});