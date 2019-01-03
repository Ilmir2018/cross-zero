"use strict";

const ticTakToe = {
    gameTableElement: null,
    status: 'playing',
    mapValues: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ],

    phase: 'X',

    init() {
        //Берём элемент по id.
        this.gameTableElement = document.getElementById('game');
        //Отображаем карту
        this.renderMap();
        //Вызывает или не вызывает определённые события при клике в контейнере table
        this.initEventHandlers();
    },

    /**
     * Метод отображает ячейки.
     */

    renderMap() {
        for (let row = 0; row < 3; row++) {
            //Создаём строки.
            const tr = document.createElement('tr');
            //Помещаем строки в контейнер table
            this.gameTableElement.appendChild(tr);
            for (let col = 0; col < 3; col++) {
                const td = document.createElement('td'); //Создаём ячейки.
                td.dataset.row = row.toString(); //Присваиваем всем ячейкам дата атрибуты.
                td.dataset.col = col.toString(); //toString - превращает число в строку.
                tr.appendChild(td);//Помещаем ячейки в созданные ранее строки.
            }
        }
    },

    /**
     * Метод вызывает событие при клике в контейнере.
     */

    //Мы применяем событие к контейнеру table, что при клике на этот контейнер вызывается метод cellClickHandler
    initEventHandlers() {
        this.gameTableElement.addEventListener('click', (event) => this.cellClickHandler(event));
    },

    /**
     * Если клик был по не по ячейке то return, ничего не происходит, тоесть если в методе isClickByCell - false,
     * прерываем.
     */

    cellClickHandler(event){
      //В константы заносим данные о дата атрибутах
        const row = event.target.dataset.row;
        const col = event.target.dataset.col;

        //Если клик был не по ячейке, мы ничего деать не будем. Или если ячейка пустая или если статус игры stopped
        if (!this.isClickByCell(event) || !this.isCellEmpty(row, col) || !this.isStatusPlaing()) {
            return;
        }
        //Если же клик был по ячейке...
        //Мы сохраняем во внутреннее представление js то, что нужно будет выводить, тоесть  Х или 0.
        this.mapValues[row][col] = this.phase;
        //Выводит Х в клетках HTML, event.target - это то, куда был клик.
        event.target.textContent = this.phase;

        //Если в методе hasWon будет правда, скажем что победили.
        if (this.hasWon()) {
            this.sayHasWon();
            //Поставим статус стоп, чтобы невозможно было продолжать после выигрыша.
            this.setStatusStopped();
        } //Если все клетки заполнены выводит ничью.
        else if (this.draw()){
            this.sayDraw();
            this.setStatusStopped();
        }

        //Метод для смены игрока
        this.togglePhase();
    },


    /**
     * Если был Х ставим 0, если нет ставим Х.
     */

    togglePhase(){
        this.phase = this.phase === 'X' ? '0' : 'X';
    },

    /**
     * Если клик был по ячейке то возвращается событие event, возвращает ячейку.
     */

    isClickByCell(event) {
        return event.target.tagName === 'TD';
    },

    /**
     * Метод проверяет была ли победа
     */
    hasWon() {
        //Проверяем полинейно была ли выиграна какая то линия.
        return this.isLineWon({x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}) ||
            this.isLineWon({x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}) ||
            this.isLineWon({x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}) ||
            this.isLineWon({x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}) ||
            this.isLineWon({x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}) ||
            this.isLineWon({x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}) ||
            this.isLineWon({x: 0, y: 2}, {x: 1, y: 1}, {x: 2, y: 1}) ||
            this.isLineWon({x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2});
    },

    /**
     * Метод определяет, была ли победа на какой либо линии.
     * Тоесть если a, b, или c равны, возвращает true.
     */

    isLineWon(a, b, c) {
        const value = this.mapValues[a.x][a.y] + this.mapValues[b.x][b.y] + this.mapValues[c.x][c.y];
        return value === 'XXX' || value === '000';
    },

    /**
     * Метод сообщает о выигыше.
     */

    sayHasWon() {
        const figure = this.phase === 'X' ? 'Крестики' : 'Нолики';
        setTimeout(() => alert(`${figure} победили!`), 1);
    },

    /**
     * Метод проверяет является ли ячейка пустой
     * @param row Данные об атрибутах строки
     * @param col Данные об атрибутах колонки
     */
    isCellEmpty(row, col) {
        //Возвращает пустую ячейку в представлении mapValues.
        return this.mapValues[row][col] === '';
    },

    /**
     * Взвращает статус игры в стоп-игра.
     */

    setStatusStopped(){
        this.status = 'stoped';
    },

    /**
     * Взвращает статус игры в играем.
     * @returns {boolean}
     */
    isStatusPlaing(){
        return this.status === 'playing';
    },

    /**
     * Если все клетки заполнены то - ничья.
     * @returns {*|string}
     */

    draw(){
        return this.isTableOver({x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0})&&
            this.isTableOver({x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1})&&
            this.isTableOver({x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2});
    },

    /**
     * Метод определяет была ли ничья.
     * @returns {string}
     */

    isTableOver(d, f, g){
        return this.mapValues[d.x][d.y] && this.mapValues[f.x][f.y] && this.mapValues[g.x][g.y];
    },

    /**
     * Метод сообщает о ничье.
     */

    sayDraw(){
        setTimeout(() => alert(`Ничья`), 1);
    },
};

window.onload = () => ticTakToe.init();







