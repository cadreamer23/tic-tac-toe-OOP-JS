$(document).ready(function() {
    //enable string prototypes
    Console.attach();
    Console.styles.attach();

    // registered styles
    Console.styles.register({
        bold: 'font-weight:bold',
        underline: 'text-decoration:underline',

        red: 'color:#de4f2a',
        blue: 'color:#1795de',
        green: 'color:green',
        grey: 'color:grey',

        code: 'background: rgb(255, 255, 219); padding: 1px 5px; border: 1px solid rgba(0, 0, 0, 0.1); line-height: 18px; text-decoration:underline;'
    });

    // test out console.log.bind()
    var info = console.log.bind(console, '\nINFO:');
    var warn = console.warn.bind(console, '\nWARN:');
    var error = console.error.bind(console, '\nERROR: ');
    var testing = console.log.bind(console, '\nTEST:'.underline.bold.green + ' ');

    // TIC TAC TOE GAME
    function Player() {
        this.move = 'x'; // first move to 'x'
    }

    Player.prototype.makeMove = function (game, row, column) {
        // makeMove assumes that the state is set to 'none'

        var $box = game.getBox(row, column);
        testing($box);

        $box.addClass(this.move);

        // Change box's state
        game.board[row][column]['state'] = this.move;

        // Check IF winner
        var winner = game.isWinner();
        if(winner) {

            // Show win banner + messages ...
            $('#move').html(winner.toUpperCase() + " HAS WON!");
            $('#message').addClass('win');
            $("#win").addClass('fadeIn');
        } else {
            // Alternate the current move
            this.move = (this.move === 'o') ? 'x' : 'o';

            // Change turn message
            $('#move').html("(It is " + this.move + "'s turn ...)");
        }
    };
    //TicTacToe player class
    function TicTacToe(player) {

        var thisGame = this;


        // Game board set up
        thisGame.board = [[{id:thisGame.getBox(0,0), state:'none'},
                           {id:thisGame.getBox(0,1), state:'none'},
                           {id:thisGame.getBox(0,2), state:'none'}],

                          [{id:thisGame.getBox(1,0), state:'none'},
                           {id:thisGame.getBox(1,1), state:'none'},
                           {id:thisGame.getBox(1,2), state:'none'}],

                          [{id:thisGame.getBox(2,0), state:'none'},
                           {id:thisGame.getBox(2,1), state:'none'},
                           {id:thisGame.getBox(2,2), state:'none'}]];

        // clickable box setup
        var $boxes = $('.box');

        //change to JQuery
        $boxes.on('click', function(e) {
   
            var target = e.target.id;

            // When a board box is pressed, make a move based upon the current
            // state -- but only if there is no winner
            if (!thisGame.isWinner()) {
                switch(thisGame.board[thisGame.getRow(target)][thisGame.getColumn(target)]['state']){
                    case 'none':
                        testing('state is none, changing state');
                        player.makeMove(thisGame, thisGame.getRow(target), thisGame.getColumn(target), player.move);
                        break;
                    case 'x':
                        // Do nothing, because this box is already checked
                        testing('state is already Kiss!');
                        break;
                    case 'o':
                        // Do nothing, because this box is already checked
                        testing('state is already Skull!');
                        break;
                    default:
                        testing('something went wrong!');
                        break;
                }
            }
        });

        // setup RESET button
        $('#reset').on('click', function() { thisGame.resetGame(player) });
    }

    // Checks array sums are either 3 or -3 for WINNER
    TicTacToe.prototype.three = function (arr) {
        var isWinner = 'false';
        var winner = 'none';

        for (var i = 0; i < arr.length; i++) {
            if (Math.abs(arr[i]) === 3) {
                return { isWinner:true, winner:((arr[i] === 3) ? 'Kiss' : 'Skull') }
            }
        };

        return { isWinner:false, winner:'none' };
    };

    // Sets up box for row and column
    TicTacToe.prototype.getBox = function (row, column) {
        var id = '';

        // organize boxes into numbers
        switch(row){
            case 0:
                id = 'top';
                break;
            case 1:
                id = 'middle';
                break;
            case 2:
                id = 'bottom';
                break;
        }

        switch(column){
            case 0:
                id += '-left';
                break;
            case 1:
                id += '-middle';
                break;
            case 2:
                id += '-right';
                break;
        }

        return $('#'+ id);
    };

    // get a row
    TicTacToe.prototype.getRow = function (id) {
        switch(id.split('-')[0]){
            case 'top':
                return 0;
            case 'middle':
                return 1;
            case 'bottom':
                return 2;
        }
    };

    // get a column
    TicTacToe.prototype.getColumn = function (id) {
        switch(id.split('-')[1]){
            case 'left':
                return 0;
            case 'middle':
                return 1;
            case 'right':
                return 2;
        }
    };

    // returns the current state for a row/column 
    TicTacToe.prototype.getState = function (row, column) {
        switch(this.board[row][column]['state']){
            case 'none':
                return 0;
            case 'x':
                return 1;
            case 'o':
                return -1;
        }
    };

    TicTacToe.prototype.isWinner = function () {
        // There are 8 total ways to win for each player.  To check for victory, add
        // 1 to checkWin for 'x', subtract 1 for 'o'

        // Check the row sums
        var rowSums = [this.getState(0,0) + this.getState(0,1) + this.getState(0,2),
                       this.getState(1,0) + this.getState(1,1) + this.getState(1,2),
                       this.getState(2,0) + this.getState(2,1) + this.getState(2,2)];

        // Check the columns
        var columnSums = [this.getState(0,0) + this.getState(1,0) + this.getState(2,0),
                          this.getState(0,1) + this.getState(1,1) + this.getState(2,1),
                          this.getState(0,2) + this.getState(1,2) + this.getState(2,2)];


        // Check the diagonals
        var diagonalSums = [this.getState(0,0) + this.getState(1,1) + this.getState(2,2),
                            this.getState(0,2) + this.getState(1,1) + this.getState(2,0)]

        // Check all array sums for -3 or 3
        if (this.three(rowSums)['isWinner']) {
            info('Winner: ' + this.three(rowSums)['winner'])
            return this.three(rowSums)['winner'];
        }

        if (this.three(columnSums)['isWinner']) {
            info('Winner: ' + this.three(columnSums)['winner'])
            return this.three(columnSums)['winner'];
        }

        if (this.three(diagonalSums)['isWinner']) {
            info('Winner: ' + this.three(diagonalSums)['winner'])
            return this.three(diagonalSums)['winner'];
        }
    };

    TicTacToe.prototype.resetGame = function (player) {
        info("Reseting Game ...");

        // Clear board and state
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                this.board[i][j]['state'] = 'none';
            };
        };

        // Reset  box styles
        var $boxes = $('.box');
        $boxes.removeClass('x o');

        // Reset move on player object
        player.move = 'x';

        // Reset moves and win message
        $('#move').html("(It is " + player.move + "'s turn ...)");
        $('#message').removeClass('win');
        $('#win').removeClass('fadeIn');
    };

    var gamePlayer = new Player();
    var game = new TicTacToe(gamePlayer);

    console.log(game);
});