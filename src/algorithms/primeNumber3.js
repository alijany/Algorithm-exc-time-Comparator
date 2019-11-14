algorithm = {

    initialize: function () {
        this.numbers = [99991, 199999, 299993, 399989, 499979, 599999, 699967, 799999, 899981, 999983];
        this.i = 0;
    },

    update: function () {
        this.i++;
    },

    run: function () {
        var num = this.numbers[this.i];
        var limit = Math.sqrt(num);
        for (var i = 3; i < limit; i += 2)
            if (num % i === 0) return num + ' : isn\'t prime';
        return num + ' : is prime';
    }
};


/*
this.numbers = 
    [1000000007, 7000000001, 13000000073, 19000000007, 25000000013,
    31000000027, 37000000007, 43000000019, 49000000001, 55000000001,
    61000000001, 67000000003, 73000000019, 79000000063, 85000000013,
    91000000037, 97000000037, 103000000007, 109000000001, 115000000007,
    121000000021, 127000000003, 133000000043, 145000000027, 145000000027];
*/