const express = require('express');
const asyncHandler = require('express-async-handler');
const cors = require('cors');

const { findMovie } = require('./scrapping/google-parser');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from movie app server!');
})

app.get('/api/search/:title', asyncHandler(async (req, res) => {
    const queryTitle = req.params.title;
    // console.log('query title:', queryTitle);

    const result = await findMovie(queryTitle);

    res.send(result);
}))

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on the port ${port}`);
})