algorithm = {
    initialize: function () {
        this.pow = 2;
        this.base = 2;
    },

    update: function () {
        this.pow += 2;
        this.base = 2;
    },

    power: function (base, n) {
        if (n == 1)
            return base;

        if (n % 2 == 0) {
            power = this.power(base, n / 2);
            return multiply(power, power);
        } else {
            power = this.power(base, n - 1);
            return multiply(base, power);
        }
    },

    run: function () {
        return this.power(this.base, this.pow);
    }
};