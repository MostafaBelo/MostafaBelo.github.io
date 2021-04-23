import { Chess } from  './chess_sim.js';
const chess = new Chess();

var board = window['Chessboard']('board', 'start')

let file = document.getElementById('file');
let movelist = document.getElementById('moves');
let current = []
const reader = new FileReader();

let i;
let data = {}
let pos = data;

file.onchange = (e) => {
    reader.readAsText(e.target.files[0]);
}

reader.onload = () => {
    data = JSON.parse(reader.result)
    pos = data;
    current = [data];
    refresh();
}

function refresh() {
    movelist.innerHTML = '';
    for (i in pos) {
        movelist.innerHTML += `<div class="move" move="${i}"><span>${i} ${pos[i][0][0]}</span> <div class="score-main"> <div class="score-white score" count="${pos[i][0][1]} ${pos[i][0][0]}">${pos[i][0][1]}</div> <div class="score-draw score" count="${pos[i][0][2]} ${pos[i][0][0]}">${pos[i][0][2]}</div> <div class="score-black score" count="${pos[i][0][3]} ${pos[i][0][0]}">${pos[i][0][3]}</div> </dvi></div>`
    }
    
    let btn_move = document.getElementsByClassName('move');

    for (let i = 0; i < btn_move.length; i++) {
        btn_move[i].onclick = move;
    }

    let btn_move_score = document.getElementsByClassName('score');
    let tmp;

    for (let i = 0; i < btn_move_score.length; i++) {
        tmp = btn_move_score[i].getAttribute('count').split(' ');
        btn_move_score[i].style.width = String(Number(tmp[0])/Number(tmp[1])*100) + '%';
    }

    board = window['Chessboard']('board', chess.fen())
    document.getElementById('movespgn').innerHTML = 'Moves: ' + chess.pgn();
}

function move(e) {
    current.push(pos[e.target.getAttribute('move')][1]);
    pos = current[current.length-1];
    let m = e.target.getAttribute('move').split('.')
    chess.move(m[m.length-1])
    refresh();
}

document.getElementById('back').onclick = () => {
    if (current.length != 1) {
        current.pop();
        pos = current[current.length-1];
        chess.undo();
        refresh();
    }
}