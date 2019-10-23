algorithm = {

  initialize: function () {
    this.n = 0;
    this.fibo = [10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000];
  },

  update: function () {
    this.n++;
  },

  isSquare: function (n) {
    return Math.sqrt(n) % 1 === 0;
  },

  run: function () {
    var number = this.fibo[this.n];
    number = 5 * multiply(number, number);
    return (this.isSquare(number + 4) || this.isSquare(number - 4))
  }
};