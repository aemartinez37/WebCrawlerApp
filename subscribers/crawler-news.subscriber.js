const scrapeIt = require("scrape-it");
const filterData = require('../services/filter-news.service');

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
            if (filter == "1") {
                mergedList = filterData.filterByComments(mergedList)
            }
            if (filter == "2") {
                mergedList = filterData.filterByScore(mergedList)
            }
            resolve(mergedList)
        })
    })
}

module.exports = scrapeNewsPage