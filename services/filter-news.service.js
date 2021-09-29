const filterFunctions = {
  filterByComments() {
    this.mergedList = this.mergedList.filter(function (x) {
      return x.title.trim().split(" ").length > 4;
    });
    this.mergedList = this.mergedList.sort((a, b) =>
      Number(a.coments) < Number(b.coments)
        ? 1
        : Number(b.coments) < Number(a.coments)
        ? -1
        : 0
    );
  },

  filterByScore() {
    this.mergedList = this.mergedList.filter(function (x) {
      return x.title.trim().split(" ").length <= 4;
    });
    this.mergedList = this.mergedList.sort((a, b) =>
      Number(a.score) < Number(b.score)
        ? 1
        : Number(b.score) < Number(a.score)
        ? -1
        : 0
    );
  },
};

module.exports = filterFunctions;
