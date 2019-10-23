algorithm = {
    initialize: function () {
        this.pow = 2;
        this.base = 2;
    },

    update: function () {
        this.pow += 3;
    },

    run: function () {
        var power = 1;
        for (var i = 0; i < this.pow; i++) {
            power = multiply(power, this.base);
        }

        return power;
    }
};
