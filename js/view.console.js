"use strict";

//TODO: Optional: Create a console-view to test your Game.

export let viewConsole = {
    script:document.querySelector('script[src="./js/view.console.js"]'),
    init : function() {
        this.script.addEventListener('connectfour:stoneInsert', (e) => {
            this.display(e.detail.field)
        })
        this.script.addEventListener('connectfour:draw', (e) => {
            console.log('Oh its a draw')
        })
        this.script.addEventListener('connectfour:error', (e) => {
            console.log(e.detail.player + " the column you try to fill is already full!")
        })
        this.script.addEventListener('connectfour:win', (e) => {
            console.log('Congrats ' + e.detail.player + ' You Win!')
            console.log('The winning Stones are:')
            console.log(e.detail.stones)
        })
    },
    display : function (field) {
        let line = "---------------"
        for (let i = 5; i >= 0; i--){
            console.log(line)
            let column = "|"
            for (let j = 0; j < 7; j++){
                column += field[j][i] + "|"
            }
            console.log(column);
        }
        console.log(line)
    },
}
