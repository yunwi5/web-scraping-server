const nightmare = require('nightmare');
const {
    getYearGenreDurationFormat,
    getDirectorAndProducers,
    getRatingAsNumber,
} = require('./parser-helper');

async function findDirectorAndProducers(nightmare, URL) {
    const movieSection = await nightmare.goto(URL).wait('body').evaluate(() => {
        const content = document.querySelector(
            'div.UDZeY.fAgajc.OTFaAf:last-child, div.OTFaAf .wDYxhc span.LrzXr.kno-fv.wHYlTd.z8gr9e a.fl',
        );
        return content ? content.textContent : '';
    });

    return movieSection;
}

async function findTitle(nightmare, URL) {
    const movieTitle = await nightmare.goto(URL).wait('body').evaluate(() => {
        const descContainer = document.querySelector(
            'div.PyJv1b.gsmt.PZPZlf .yKMVIe, .SPZz6b h2.PZPZlf span',
        );
        return descContainer ? descContainer.textContent : '';
    });
    return movieTitle;
}

async function findDescription(nightmare, URL) {
    const movieDesc = await nightmare.goto(URL).wait('body').evaluate(() => {
        const descContainer = document.querySelector('div.kno-rdesc span');
        return descContainer ? descContainer.textContent : '';
    });
    return movieDesc;
}

// a.NY3LVe span.IZACzd
async function findRating(nightmare, URL) {
    // gsrt KMdzJ
    const movieRating = await nightmare.goto(URL).wait('body').evaluate(() => {
        const ratingElem = document.querySelector('span.IZACzd, span.gsrt.KMdzJ');
        return ratingElem ? ratingElem.textContent : '';
    });
    console.log('Raw movie rating:', movieRating);
    return movieRating;
}

async function findYearGenreDuration(nightmare, URL) {
    // wwUB2c PZPZlf
    // 'div.EGmpye div.wx62f.PZPZlf.x7XAkb'
    const movieYearGenreDuration = await nightmare.goto(URL).wait('body').evaluate(() => {
        const content = document.querySelector('div.EGmpye div.PZPZlf, .wwUB2c');
        return content ? content.textContent : '';
    });
    console.log('Hours and minutes part:');
    console.log(movieYearGenreDuration);
    return movieYearGenreDuration;
}

async function findMovie(titleQuery = '') {
    const URL = `https://www.google.com/search?q=${titleQuery}`;
    console.log(URL);

    const nm = nightmare();
    const desc = await findDescription(nm, URL);
    const title = await findTitle(nm, URL);
    const yearGenreDuration = await findYearGenreDuration(nm, URL);
    const movieCardContent = await findDirectorAndProducers(nm, URL);
    const ratingText = await findRating(nm, URL);

    const { year, genres, hours, minutes } = getYearGenreDurationFormat(yearGenreDuration);
    const { director, producers } = getDirectorAndProducers(movieCardContent);
    const rating = getRatingAsNumber(ratingText);

    console.log(`title: ${title}`);
    console.log(`desc: ${desc}}`);
    console.log(`year: ${year}`);
    console.log(`genre: ${genres}`);
    console.log(`hours: ${hours}`);
    console.log(`minutes: ${minutes}`);
    console.log(`director: ${director}`);
    console.log(`producers: ${producers.join(' & ')}`);
    console.log(`rating: ${rating}`);
    await nm.end();

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
    findMovie
}