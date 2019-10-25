algorithm = {

    initialize: function () {
        this.n = 0;
        this.numbers = [10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000];
    },

    update: function () {
        this.n++;
    },

    run: function () {
        var a = 0;
        var b = 1;
        var sum = 0;
        var number = this.numbers[this.n];

        do {
            sum = a + b;
            a = b;
            b = sum;
            if (sum == number)
                return  number + " : is fibo";
        } while (sum <= number);
        return number + " : isn't fibo";
    }
};