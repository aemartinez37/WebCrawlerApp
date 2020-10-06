const express = require('express')
const app = express()
const scrapeNewsPage = require('./subscribers/crawler-news.subscriber')
const port = 3000
var path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.post('/scrapingNews', async (req, res) => {
    try {
        var filter = req.body.filter;
        const resp = await scrapeNewsPage(filter);
        res.send(resp);
    } catch (error) {
        handleError(error);
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app; // for testing