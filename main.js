const express = require('express');
const { Registrator } = require('./registrator');
const cors = require('cors');

const app = express()
const registrator = new Registrator();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

const PORT = 3000

app.post('/register', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    registrator.createNewUser(req.body).then(resolved => res.send(resolved));
});

app.post('/login', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    registrator.checkUser(req.body).then(resolved => res.send(resolved));
});


app.listen(PORT, () => {
    console.log(`App run on port ${PORT}`)
})