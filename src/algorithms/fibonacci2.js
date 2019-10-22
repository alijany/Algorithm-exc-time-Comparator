algorithm = {

    initialize: function () {
        this.n = 0;
        this.fibo = [6765, 75025, 832040, 9227465, 102334155, 1134903170, 12586269025, 139583862445, 1548008755920, 17167680177565];
    },

    update: function () {
        this.n++;
    },

    run: function () {
        var a = 0;
        var b = 1;
        var sum = 0;
        var number = this.fibo[this.n];

        do {
            sum = a + b;
            a = b;
            b = sum;
            if (sum == number)
                console.log(number);
        } while (sum <= number);
    }
};