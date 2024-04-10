//Anne-Lii Hansen - webbapplikation med mina tidigare arbetslivserfarenheter

//inkluderar express och cors
const express = require('express');
const cors = require('cors');
const path = require('path'); 

const app = express();

app.use(express.json());// Middleware för att tolka JSON
app.use(express.static(path.join(__dirname, 'public'))); //statiska filer i mappen "public"
app.use(cors());// Middleware för CORS
app.set('view engine', 'ejs');//view engine: EJS

// Routing
app.get('/', (req, res) => {
    const workExpList = [];
    res.render('index');
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.get('/about', (req, res) => {
    res.render('about');
});

// Lyssna på port 3000 (eller valfri port)
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
