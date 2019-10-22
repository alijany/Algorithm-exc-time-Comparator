algorithm = {

  initialize: function () {
    this.n = 0;
    this.fibo = [46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578];
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
    if (this.isSquare(number + 4) || this.isSquare(number - 4))
      return this.n;
  }
};