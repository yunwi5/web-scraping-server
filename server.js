if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const asyncHandler = require('express-async-handler');
const cors = require('cors');

const { searchMovie, searchDescription } = require('./scrapping/google-parser');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from movie app server!');
})

app.get('/api/search/:title', asyncHandler(async (req, res) => {
    const queryTitle = req.params.title;
    const result = await searchMovie(queryTitle);

    res.send(result);
}))

app.get('/api/desc/:title', asyncHandler(async (req, res) => {
    const queryTitle = req.params.title;
    const result = await searchDescription(queryTitle);

    res.json(result);
}))

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on the port ${port}`);
})