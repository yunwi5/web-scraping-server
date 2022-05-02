const nightmare = require('nightmare');
const {
    getYearGenreDurationFormat,
    getDirectorAndProducers,
    getRatingAsNumber,
} = require('./parser-helper');

async function findDirectorAndProducers(URL) {
    const nm = nightmare();
    const movieSection = await nm.goto(URL).wait('body').evaluate(() => {
        const content = document.querySelector(
            'div.UDZeY.fAgajc.OTFaAf:last-child, div.OTFaAf .wDYxhc span.LrzXr.kno-fv.wHYlTd.z8gr9e a.fl',
        );
        return content ? content.textContent : '';
    });
    nm.end();
    return movieSection;
}

async function findTitle(URL) {
    const nm = nightmare();
    const movieTitle = await nm.goto(URL).wait('body').evaluate(() => {
        const descContainer = document.querySelector(
            'div.PyJv1b.gsmt.PZPZlf .yKMVIe, .SPZz6b h2.PZPZlf span',
        );
        return descContainer ? descContainer.textContent : '';
    });
    nm.end();
    return movieTitle;
}

async function findDescription(URL) {
    const nm = nightmare();
    const movieDesc = await nm.goto(URL).wait('body').evaluate(() => {
        const descContainer = document.querySelector('div.kno-rdesc span');
        return descContainer ? descContainer.textContent : '';
    });
    nm.end();
    return movieDesc;
}

// a.NY3LVe span.IZACzd
async function findRating(URL) {
    const nm = nightmare();
    // gsrt KMdzJ
    const movieRating = await nm.goto(URL).wait('body').evaluate(() => {
        const ratingElem = document.querySelector('span.IZACzd, span.gsrt.KMdzJ');
        return ratingElem ? ratingElem.textContent : '';
    });
    // console.log('Raw movie rating:', movieRating);
    nm.end();
    return movieRating;
}

async function findYearGenreDuration(URL) {
    const nm = nightmare();
    // wwUB2c PZPZlf
    // 'div.EGmpye div.wx62f.PZPZlf.x7XAkb'
    const movieYearGenreDuration = await nm.goto(URL).wait('body').evaluate(() => {
        const content = document.querySelector('div.EGmpye div.PZPZlf, .wwUB2c');
        return content ? content.textContent : '';
    });
    // console.log('Hours and minutes part:');
    nm.end();
    return movieYearGenreDuration;
}

const BASE_URL = `https://www.google.com/search?q=`;

async function searchDescription(titleQuery = '') {
    const URL = `${BASE_URL}${titleQuery}`;
    const startTime = performance.now();
    const desc = await findDescription(URL);

    const endTime = performance.now();
    console.log('Time taken:', endTime - startTime);

    return {
        description: desc,
    }
}

async function searchMovie(titleQuery = '') {
    const URL = `${BASE_URL}${titleQuery}`;
    const startTime = performance.now();

    const descPromise = findDescription(URL);
    const titlePromise = findTitle(URL);
    const yearGenreDurationPromise = findYearGenreDuration(URL);

    // This function needs to be fixed.
    const movieCardContentPromise = findDirectorAndProducers(URL);
    const ratingTextPromise = findRating(URL);

    const [desc, title, yearGenreDuration, movieCardContent, ratingText] = await Promise.all([
        descPromise, titlePromise, yearGenreDurationPromise, movieCardContentPromise, ratingTextPromise]);

    // console.log('movieCardContent:', movieCardContent);
    const { year, genres, hours, minutes } = getYearGenreDurationFormat(yearGenreDuration);
    const { director, producers } = getDirectorAndProducers(movieCardContent);
    const rating = getRatingAsNumber(ratingText);

    // console.log(`title: ${title}`);
    // console.log(`desc: ${desc}}`);
    // console.log(`year: ${year}`);
    // console.log(`genre: ${genres}`);
    // console.log(`hours: ${hours}`);
    // console.log(`minutes: ${minutes}`);
    // console.log(`director: ${director}`);
    // console.log(`producers: ${producers.join(' & ')}`);
    // console.log(`rating: ${rating}`);

    const endTime = performance.now();
    console.log('Time taken:', endTime - startTime);

    return {
        title,
        description: desc,
        year: year || null,
        genres: genres || null,
        hours: hours || null,
        minutes: minutes | null,
        director: director || null,
        producers: producers || null,
        rating,
    };
}


module.exports = {
    searchDescription,
    searchMovie
}