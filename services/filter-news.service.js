const filterByComments = function (arrayToFilter) {
    arrayToFilter = arrayToFilter.filter(function (x) {
        return x.title.trim().split(" ").length > 4;
    });
    return arrayToFilter.sort((a, b) => (Number(a.coments) < Number(b.coments)) ? 1 : ((Number(b.coments) < Number(a.coments)) ? -1 : 0));
}

const filterByScore = function (arrayToFilter) {
    arrayToFilter = arrayToFilter.filter(function (x) {
        return x.title.trim().split(" ").length <= 4;
    });
    return arrayToFilter.sort((a, b) => (Number(a.score) < Number(b.score)) ? 1 : ((Number(b.score) < Number(a.score)) ? -1 : 0));
}

module.exports = {
    filterByComments,
    filterByScore
}