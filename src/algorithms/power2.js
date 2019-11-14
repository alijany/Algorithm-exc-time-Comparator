algorithm = {
    initialize: function () {
        this.pow = 2;
        this.base = 2;
    },

    update: function () {
        this.pow += 4;
    },

    power: function (base, n) {
        if (n == 1)
            return base;

        if (n % 2 == 0) {
            let power = this.power(base, n / 2);
            return multiply(power, power);
        } else {
            let power = this.power(base, n - 1);
            return multiply(base, power);
        }
    },

    run: function () {
        return `pow(${this.base},${this.pow}) = ` + this.power(this.base, this.pow);
    }
};