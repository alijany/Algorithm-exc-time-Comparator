algorithm = {

  initialize: function () {
    this.i = 0;
    this.numbers = [10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000];
  },

  update: function () {
    this.i++;
  },

  isSquare: function (n) {
    return Math.sqrt(n) % 1 === 0;
  },

  run: function () {
    var number = this.numbers[this.i];
    number = 5 * multiply(number, number);
    if (this.isSquare(number + 4) || this.isSquare(number - 4))
      return this.numbers[this.i] + " : is fibo";
    else 
      return this.numbers[this.i] + " : isn't fibo";
  }
};