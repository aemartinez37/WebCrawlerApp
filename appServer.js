const express = require('express')
const scrapeIt = require("scrape-it");
const app = express()
var multer = require('multer');
var upload = multer();
var path = require('path');
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array());
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

const scrapeNewsPage = function (filter) {
    return new Promise(function (resolve, reject) {
        scrapeIt("https://news.ycombinator.com", {
            newsEntries: {
                listItem: 'tr.athing',
                data: {
                    id: {
                        attr: "id"
                    },
                    title: 'a.storylink',
                    orderNumber: 'span.rank'
                }
            },
            newsEntriesMetaInfo: {
                listItem: 'td.subtext',
                data: {
                    id: {
                        selector: "span.score",
                        attr: "id"
                    },
                    score: 'span.score',
                    coments: {
                        listItem: "a"
                    }
                }
            }
        }).then(({ data }) => {
            data.newsEntries.map(function (x) {
                x['orderNumber'] = x['orderNumber'].replace(/\./g, '')
                return x;
            });
            data.newsEntriesMetaInfo.map(function (x) {
                x['id'] = x['id'].split("_")[1]
                x['score'] = x['score'].split(" ")[0]
                x['coments'] = x['coments'].length > 3 ? x['coments'][3].includes("comment") ? x['coments'][3].replace(/\u00a0/g, " ").split(" ")[0] : "0" : "0"
                return x;
            });
            var mergedList = data.newsEntries.map(itm => ({
                ...data.newsEntriesMetaInfo.find((item) => (item.id === itm.id) && item),
                ...itm
            }));
            //Filters
            if (filter == "1") {
                mergedList = mergedList.filter(function (x) {
                    return x.title.trim().split(" ").length > 4;
                });
                mergedList.sort((a, b) => (Number(a.coments) < Number(b.coments)) ? 1 : ((Number(b.coments) < Number(a.coments)) ? -1 : 0));
            }
            if (filter == "2") {
                mergedList = mergedList.filter(function (x) {
                    return x.title.trim().split(" ").length <= 4;
                });
                mergedList.sort((a, b) => (Number(a.score) < Number(b.score)) ? 1 : ((Number(b.score) < Number(a.score)) ? -1 : 0));
            }
            resolve(mergedList)
        })
    })
}