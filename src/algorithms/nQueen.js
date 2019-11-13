/*jshint esversion: 6 */

algorithm = {
    initialize: function () {
        this.n = 5;
        this.board = Array(this.n).fill().map(() => Array(this.n).fill(0));
    },

    update: function () {
        this.n += 2;
        this.board = Array(this.n).fill().map(() => Array(this.n).fill(0));
    },

    run: function () {
        return this.isNQueen(this.board);
    },

    isSafe: function (board, row, col) {
        for (var i = 0; i < col; i++) {
            if (board[row][i] == 1)
                return false;
        }
        for (var i = row, j = col; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 1)
                return false;
        }
        for (var i = row, j = col; j >= 0 && i < board.length; i++, j--) {
            if (board[i][j] == 1)
                return false;
        }
        return true;
    },

    isNQueen: function (board, col = 0) {
        if (col >= board.length)
            return true;

        for (var i = 0; i < board.length; i++) {
            if (this.isSafe(board, i, col)) {
                board[i][col] = 1;
                if (this.isNQueen(board, col + 1) == true)
                    return true;
                board[i][col] = 0;
            }
        }
    }
};