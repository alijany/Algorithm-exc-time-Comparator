algorithm = {

    initialize: function () {
        this.numbers = [10000019, 20000003, 30000001, 40000003, 50000017, 60000011, 70000027, 80000023, 90000049, 100000007];
        this.i = 0;
    },

    update: function () {
        this.i++;
    },

    run: function () {
        var num = this.numbers[this.i];
        for (var i = 2; i < num; i++)
            if (num % i === 0) return num + ' : isn\'t prime';
        return num + ' : is prime';
    }
};