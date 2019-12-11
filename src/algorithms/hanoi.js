// This function will recursively store all the moves and return the moves information as Array

algorithm = {
    initialize: function () {
        this.count = 2;
    },

    update: function () {
        this.count += 2;
    },

    hanoi: function (count, source, auxiliary, destination, moves) {
        moves = moves || [];

        if (count === 1) {
            moves.push({
                'disk': 1,
                'from': source,
                'to': destination
            });
        }

        else {
            // Move 'n-1' disks from 'source' to 'aux'
            this.hanoi(count - 1, source, destination, auxiliary, moves);

            moves.push({
                'disk': count,
                'from': source,
                'to': destination
            });

            // Move (n-1) disks from 'aux' to 'destination'
            this.hanoi(count - 1, auxiliary, source, destination, moves);
        }

        return moves;
    },

    run: function () {
        var moves = this.hanoi(this.count, 'A', 'B', 'C');
        return 'count: ' + this.count + ' | moves: ' + moves.length;
    }
};
