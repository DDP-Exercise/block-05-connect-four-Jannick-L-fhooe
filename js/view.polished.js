"use strict";

//TODO: Think of this view as your game board.
//      Your view should listen to various custom events of your model.
//      For each event of your model, there should be a clear visual
//      representation of what's going on.

//TODO: Update the field. Show the whole battlefield with all the stones
//      that are already played.

//TODO: Show the current player

//TODO: Notify the player when the game is over. Make it clear how the
//      Game ended. If it's a win, show the winning stones.



export let viewPolished ={
    standardInfo: "Zwei Kräfte stehen sich gegenüber: Raum und Zeit. Setzt eure Spielsteine strategisch und verbindet vier Symbole, bevor euer Gegner es schafft. Wählt eine Spalte mit den Zahlentasten 1–7 auf eurer Tastatur und beeinflusst das Gleichgewicht der Realität zu euren Gunsten.",
    script:document.querySelector('script[src="./js/view.polished.js"]'),
    init: function(){
        const container = document.getElementById("container")
        container.innerHTML = "";
        container.className = "";
        container.classList.add("container", "init")

        const headline = document.createElement("div");
        headline.id = "headline";

        const h1 = document.createElement("h1");
        h1.textContent = "Connect Four";

        headline.appendChild(h1);

        const playerOne = this.createPlayerSection(
            "playerOne",
            "portraitPast",
            "Player One",
            "playerOneInput",
            "Enter your Name Player One",
            "playerOneInput"
        );

        const playerTwo = this.createPlayerSection(
            "playerTwo",
            "portraitFuture",
            "Player Two",
            "playerTwoInput",
            "Enter your Name Player Two",
            "playerTwoInput"
        );

        const explanation = document.createElement("div");
        explanation.id = "explanation";

        const explanationText = document.createElement("p");
        explanationText.textContent =
            this.standardInfo +
            "Drück auf den Start Button wenn ihr bereit seid";

        explanation.appendChild(explanationText);

        const start = document.createElement("div");
        start.id = "start";

        const startButton = document.createElement("button");
        startButton.id = "startButton";
        startButton.type = "submit";
        startButton.textContent = "Start";

        start.appendChild(startButton);

        container.appendChild(headline);
        container.appendChild(playerOne);
        container.appendChild(playerTwo);
        container.appendChild(explanation);
        container.appendChild(start);
    },
    registerEventListener :function (){
        this.script.addEventListener('connectfour:stoneInsert', (e) => {
            this.placeStone(e.detail.position, e.detail.player)
        })
        this.script.addEventListener('connectfour:win', (e) => {
            this.win(e.detail.stones, e.detail.player)
        })
        this.script.addEventListener('connectfour:draw', () => {
            this.draw()
        })
        this.script.addEventListener('connectfour:playerSwitch', (e) => {
            if(e.detail.player == 1) {
                this.editPlayer(1,true)
                this.editPlayer(2,false)
            } else {
                this.editPlayer(1,false)
                this.editPlayer(2,true)
            }
        })
        this.script.addEventListener('connectfour:error', (e) => {
            this.errorMessage(e.detail.player)
        })
    },
    createPlayerSection: function(wrapperId, portraitId, labelText, inputId, placeholderText, labelFor){
        const wrapper = document.createElement("div");
        wrapper.id = wrapperId;

        const portrait = document.createElement("div");
        portrait.id = portraitId;

        const label = document.createElement("label");
        label.setAttribute("for", labelFor);
        label.textContent = labelText;

        const input = document.createElement("input");
        input.type = "text";
        input.id = inputId;

        const p = document.createElement("p");
        p.textContent = placeholderText;

        wrapper.appendChild(portrait);
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        wrapper.appendChild(p);

        return wrapper;
    },
    createPlayScreen: function(playerOneName, playerTwoName){
        const container = document.querySelector(".container");
        container.classList.add("playing");
        container.innerHTML = "";

        const headline = document.createElement("div");
        headline.id = "headline";
        headline.innerHTML = "<h1>Connect Four</h1>";

        function createPlayer(id, portraitId, name) {
            const div = document.createElement("div");
            div.id = id;
            div.classList.add("playing");

            const portrait = document.createElement("div");
            portrait.id = portraitId;
            portrait.classList.add("playing");

            const p = document.createElement("p");
            p.textContent = name;

            div.append(portrait, p);
            return div;
        }

        const board = document.createElement("div");
        board.classList.add("board");

        for (let y = 6; y >= 1; y--) {
            for (let x = 1; x <= 7; x++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.x = x;
                cell.dataset.y = y;

                const img = document.createElement("img");
                img.src = "";
                img.alt = "";

                cell.appendChild(img);
                board.appendChild(cell);
            }
        }

        const info = document.createElement("div");
        info.id = "info";
        info.innerHTML = "<p>Zwei Kräfte stehen sich gegenüber: Raum und Zeit. Setzt eure Spielsteine strategisch und verbindet vier Symbole, bevor euer Gegner es schafft. Wählt eine Spalte mit den Zahlentasten 1–7 auf eurer Tastatur und beeinflusst das Gleichgewicht der Realität zu euren Gunsten.</p>";

        container.append(
            headline,
            createPlayer("playerOne", "portraitPast", playerOneName),
            board,
            createPlayer("playerTwo", "portraitFuture", playerTwoName),
            info
        );
        this.editPlayer(2, false)

    },
    placeStone: function (position, player) {
        document.getElementById("info").innerText = this.standardInfo;
        const [x, y] = position;
        const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (!cell) return;
        const img = cell.querySelector("img");
        img.src = player == 1 ? "./img/chipTime.png" : "./img/chipSpace.png";
    },
    win: function (stones, player){
        stones.forEach(([x, y]) => {
            const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);

            const img = cell.querySelector("img");
            if (img) img.remove();

            cell.style.background = "#e63946";
        });
        document.getElementById("info").innerText = "Gratuliere " + player + "! Du hast gewonnen dies wird die neue Ordnung des Universums bestimmen | Drücke R für Neustart";
    },
    draw: function () {
        document.getElementById("info").innerText = "Ein Unentschieden. Raum und Zeit keiner kann die Oberhand erlangen.\n" +
            "Keine Seite konnte die Realität vollständig dominieren — das Kontinuum verharrt in einem fragilen Stillstand. | Drücke R für Neustart";
    },
    editPlayer: function (player, active) {
        if(player == 1){
            if(active){
                const target = document.getElementById("portraitPast")
                target.style.backgroundImage = "url(./img/pastPersColor.png)";
            }else {
                const target = document.getElementById("portraitPast")
                target.style.backgroundImage = "url(./img/pastPersGray.png)";
            }
        } else {
            if(active){
                const target = document.getElementById("portraitFuture")
                target.style.backgroundImage = "url(./img/futurePersColor.png)";
            }else {
                const target = document.getElementById("portraitFuture")
                target.style.backgroundImage = "url(./img/futurePersGray.png)";
            }
        }
    },
    errorMessage: function (player) {
        document.getElementById("info").innerText = "Oh nein " + player + "!\n Die Kräfte dieser Säule sind gesättigt.\nDer Stein findet keinen Platz mehr im Kontinuum.";
    }
}

