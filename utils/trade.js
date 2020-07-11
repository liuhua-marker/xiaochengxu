module.exports = {
  tradeno: function() {
      var e = new Date().getTime();
      return "fk" + parseInt(1e11 * Math.random() + 1e11) + parseInt(1e4 * Math.random() + 1e4) + e;
  }
};
