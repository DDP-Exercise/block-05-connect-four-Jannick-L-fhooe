"use strict";

//TODO: Think of this model as the game-logic.
//      The model knows everything that is neccessary to manage
//      the game. It knows the players, know who's turn it is,
//      knows all the stones and where they are, knows if the
//      game is over and if so, why (draw or winner). It knows
//      which stones are the winning stones. The model also has
//      sovereignty over the battlefield.
//      First step: Create your model-object with all the properties
//      necessary to store that information.

//TODO: Prepare some customEvents. The model should dispatch events when
//      - The Player Changes
//      - A stone was inserted
//      - The Game is over (Draw or Winner)
//      Don't forget to give your events a namespace.
//      For each customEvent, just make a >method< for your model-object,
//      that, when called, dispatches the event. Nothing else should
//      happen in those methods.


//TODO: Initiate the battlefield. Your model needs a representation of the
//      battlefield as data (two-dimensional array). Obviously, there are
//      no stones yet in the field.

//TODO: The model should offer a method to insert a stone at a given column.
//      If the stone can be inserted, the model should insert the stone,
//      dispatch an event to let the world know that the battlefield has changed
//      and check if the game is over now.
//      Hint: This method will be called later by your controller, when the
//      user makes an according input.

//TODO: Methods to check if the game is over, either by draw or a win.
//      Let the world know in both cases what happend. If it's a win,
//      Don't forget to store the winning stones and add this >detail<
//      to your custom event.

//TODO: Method to change the current player (and dispatch the according event).

export let connectfourModel = {
    polished: null,
    console: null,
    field : [],
    currentPlayer : 1,
    playerOneName: "Player One",
    playerTwoName: "Player Two",
    gameStatus: "Init",
    columnCount : [0, 0, 0, 0, 0, 0, 0],
    totalStones: 0,
    init : function () {
        this.columnCount = [0,0,0,0,0,0,0];
        this.totalStones = 0;
        this.currentPlayer = 1;
        this.field = [];
        for (let i = 0; i < 7; i++){
            let column = []
            for (let j = 0; j < 6; j++){
                column.push(0)
            }
            this.field.push(column)
        }
        this.polished = document.querySelector('script[src="./js/view.polished.js"]')
        this.console = document.querySelector('script[src="./js/view.console.js"]')
    },
    addStone : function (column) {
        if(this.gameStatus === "Playing"){
            let xCoordinate = column-1
            if(this.field[xCoordinate][5] === 0){
                let  yCoordinate = this.columnCount[column-1]
                this.field[xCoordinate][yCoordinate] = this.currentPlayer
                this.columnCount[xCoordinate] ++
                this.totalStones ++
                this.stoneInsertEvent([xCoordinate + 1, yCoordinate + 1], this.currentPlayer)
                this.checkWin(xCoordinate, yCoordinate)
                if(this.gameStatus === "Victory"){
                    return;
                }
                if(this.gameStatus !== "Victory" && this.totalStones === 42){
                    this.gameStatus = "Draw"
                    this.drawEvent()
                    return;
                }
                this.currentPlayer = this.currentPlayer % 2 + 1
                this.playerSwitchEvent(this.currentPlayer)
            } else {
                if(this.currentPlayer === 1)this.errorEvent(this.playerOneName)
                else this.errorEvent(this.playerTwoName)
            }
        }
    },
    checkWin: function (column, row) {
        let counter = 1
        let stones = [[column+1,row+1]]
        let player = this.currentPlayer
        let i = 1

        while(column-i >= 0 && this.field[column-i][row] === player){
            counter ++
            stones.push([column-i+1, row+1])
            i ++;
        }
        i = 1
        while(column+i <= 6 && this.field[column+i][row] === player){
            counter ++
            stones.push([column+i+1, row+1])
            i ++;
        }
        i = 1
        if(counter >= 4){
            this.gameStatus = "Victory";
            if(this.currentPlayer == 1)this.winEvent(this.playerOneName, stones)
            else this.winEvent(this.playerTwoName, stones)
            return
        }
        counter = 1
        stones = [[column+1,row+1]]

        while(row-i >= 0 && this.field[column][row-i] === player){
            counter ++
            stones.push([column+1, row-i+1])
            i ++;
        }
        i = 1
        if(counter >= 4){
            this.gameStatus = "Victory";
            if(this.currentPlayer == 1)this.winEvent(this.playerOneName, stones)
            else this.winEvent(this.playerTwoName, stones)
            return
        }
        counter = 1
        stones = [[column+1,row+1]]

        while(column-i >= 0 && row-i >= 0 && this.field[column-i][row-i] === player){
            counter ++
            stones.push([column-i+1, row-i+1])
            i ++;
        }
        i = 1
        while(column+i <= 6 && row+i <= 5 && this.field[column+i][row+i] === player){
            counter ++
            stones.push([column+i+1, row+i+1])
            i ++;
        }
        i = 1
        if(counter >= 4){
            this.gameStatus = "Victory";
            if(this.currentPlayer == 1)this.winEvent(this.playerOneName, stones)
            else this.winEvent(this.playerTwoName, stones)
            return
        }
        counter = 1
        stones = [[column+1,row+1]]

        while(column-i >= 0 && row+i <= 5 && this.field[column-i][row+i] === player){
            counter ++
            stones.push([column-i+1, row+i+1])
            i ++;
        }
        i = 1
        while(column+i <= 6 && row-i >= 0 && this.field[column+i][row-i] === player){
            counter ++
            stones.push([column+i+1, row-i+1])
            i ++;
        }
        if(counter >= 4){
            this.gameStatus = "Victory";
            if(this.currentPlayer == 1)this.winEvent(this.playerOneName, stones)
            else this.winEvent(this.playerTwoName, stones)
        }
    },
    errorEvent : function (player) {
        this.polished.dispatchEvent(
            new CustomEvent('connectfour:error', {
                detail: {
                    player: player,
                }
            })
        );
        this.console.dispatchEvent(
            new CustomEvent('connectfour:error', {
                detail: {
                    player: player,
                }
            })
        );
    },
    winEvent : function (player, stones){
        this.polished.dispatchEvent(
            new CustomEvent('connectfour:win', {
                detail: {
                    player: player,
                    stones: stones
                }
            })
        );
        this.console.dispatchEvent(
            new CustomEvent('connectfour:win', {
                detail: {
                    player: player,
                    stones: stones
                }
            })
        );
    },
    drawEvent : function (){
        this.polished.dispatchEvent(new CustomEvent('connectfour:draw'));
        this.console.dispatchEvent(new CustomEvent('connectfour:draw'));
    },
    playerSwitchEvent : function(player){
        this.polished.dispatchEvent(
            new CustomEvent('connectfour:playerSwitch', {
                detail: {
                    player: player,
                }
            })
        );
    },
    stoneInsertEvent : function (position, player){
        this.polished.dispatchEvent(
            new CustomEvent('connectfour:stoneInsert', {
                detail: {
                    position: position,
                    player: player,
                    field: this.field,
                }
            })
        );
        this.console.dispatchEvent(
            new CustomEvent('connectfour:stoneInsert', {
                detail: {
                    field: this.field,
                }
            })
        );
    },
    start : function (playerOne, playerTwo) {
        this.gameStatus = "Playing"
        if (playerOne !== playerTwo){
            if(playerOne !== "")this.playerOneName = playerOne
            if(playerTwo !== "")this.playerTwoName = playerTwo
        }
    },
    restart: function() {
        this.gameStatus = "Init";
        this.playerOneName = "Player One";
        this.playerTwoName = "Player Two";
        this.init();
    }
}

connectfourModel.init();
