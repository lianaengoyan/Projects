const board = document.getElementById("board");

let figures = [
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♘","♗","♕","♔","♗","♘","♖"],
];

// ===== CREATE BOARD =====
function createBoard() {
  board.innerHTML = "";
    for(let row = 0; row < 8; row++){
      for(let col = 0; col < 8; col++){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.classList.add((row + col) % 2 === 0 ? "light" : "dark");

        cell.dataset.row = row;
        cell.dataset.col = col;

        cell.textContent = figures[row][col];
        board.appendChild(cell);
      }
    }
}

createBoard();


// ===== NUMBERS AND LETTERS =====
function drawCoords() {
  const left = document.getElementById("coords-left");
  const bottom = document.getElementById("coords-bottom");

  left.innerHTML = "";
  bottom.innerHTML = "";

  const nums = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  nums.forEach(n => {
      const div = document.createElement("div");
      div.textContent = n;
      left.appendChild(div);
  });

  letters.forEach(l => {
      const div = document.createElement("div");
      div.textContent = l;
      bottom.appendChild(div);
  });
}

drawCoords();


// ===== RESET =====
const resetBtn = document.getElementById("reset");
const turnText = document.getElementById("turn");


resetBtn.addEventListener("click", ()=> {
  figures = [
    ["♜","♞","♝","♛","♚","♝","♞","♜"],
    ["♟","♟","♟","♟","♟","♟","♟","♟"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["♙","♙","♙","♙","♙","♙","♙","♙"],
    ["♖","♘","♗","♕","♔","♗","♘","♖"],
  ];

  if(isSelected) unhighlightCell(isSelected);
  isSelected = null;

  whitesTurn = true;
  turnText.textContent = "White's turn";
  
  createBoard();
});

// ===== SELECTION =====
let isSelected = null;
let whitesTurn = true;

function highlightCell(cell) {
  cell.classList.add("selected"); 
}

function unhighlightCell(cell) { 
  if(cell) cell.classList.remove("selected"); 
}

function isWhitePiece(piece) { 
  return "♙♖♘♗♕♔".includes(piece); 
}

function isBlackPiece(piece) {
  return "♟♜♞♝♛♚".includes(piece); 
}

// ===== MOVE LOGIC =====
function canMove(fromRow, fromCol, toRow, toCol, piece){
  if(piece==="♙" || piece==="♟") return canMovePawn(fromRow,fromCol,toRow,toCol,isWhitePiece(piece));
  if(piece==="♖" || piece==="♜") return canMoveRook(fromRow,fromCol,toRow,toCol,piece);
  if(piece==="♗" || piece==="♝") return canMoveBishop(fromRow,fromCol,toRow,toCol,piece);
  if(piece==="♘" || piece==="♞") return canMoveKnight(fromRow,fromCol,toRow,toCol,piece);
  if(piece==="♕" || piece==="♛") return canMoveQueen(fromRow,fromCol,toRow,toCol,piece);
  if(piece==="♔" || piece==="♚") return canMoveKing(fromRow,fromCol,toRow,toCol,piece);
  return false;
}

// ===== PAWN =====
function canMovePawn(fR,fC,tR,tC,isWhite){
  const dir = isWhite ? -1 : 1;
  const startRow = isWhite ? 6 : 1;

  if(tC === fC && tR === fR+dir && figures[tR][tC] === "") return true;
  if(tC === fC && fR === startRow && tR === fR + 2 * dir && figures[fR + dir][tC] === "" && figures[tR][tC] === "") return true;

  if(Math.abs(tC - fC) === 1 && tR === fR + dir && figures[tR][tC] !== ""){
    if(isWhite && isBlackPiece(figures[tR][tC])) return true;
    if(!isWhite && isWhitePiece(figures[tR][tC])) return true;
  }
  return false;
}

// ===== ROOK =====
function canMoveRook(fR, fC, tR, tC, piece){
  if(fR !== tR && fC !== tC) return false;
  let stepR = fR === tR ? 0 : (tR > fR ? 1 : -1);
  let stepC = fC === tC ? 0 : (tC > fC ? 1 : -1);
  let r = fR + stepR, c = fC + stepC;

  while(r !== tR || c !== tC){
    if(figures[r][c] !== "") return false;
    r += stepR; c += stepC;
  }

  if(figures[tR][tC] === "") return true;
  return (isWhitePiece(piece) ? isBlackPiece(figures[tR][tC]) : isWhitePiece(figures[tR][tC]));
}

// ===== BISHOP =====
function canMoveBishop(fR, fC, tR, tC, piece){
    if(Math.abs(tR - fR) !== Math.abs(tC - fC)) return false;
    let stepR = tR > fR ? 1 : -1;
    let stepC = tC > fC ? 1 : -1;
    let r = fR + stepR, c = fC + stepC;

    while(r !== tR && c !== tC){
        if(figures[r][c] !== "") return false;
        r += stepR; c += stepC;
    }

    if(figures[tR][tC] === "") return true;
    return (isWhitePiece(piece) ? isBlackPiece(figures[tR][tC]) : isWhitePiece(figures[tR][tC]));
}

// ===== KNIGHT =====
function canMoveKnight(fR, fC, tR, tC, piece){
    let dr = Math.abs(fR - tR), dc = Math.abs(fC - tC);

    if((dr === 2 && dc === 1) || (dr === 1 && dc === 2)){
        if(figures[tR][tC] === "") return true;
        return (isWhitePiece(piece) ? isBlackPiece(figures[tR][tC]) : isWhitePiece(figures[tR][tC]));
    }
    return false;
}

// ===== QUEEN =====
function canMoveQueen(fR, fC, tR, tC, piece){
  return canMoveRook(fR, fC, tR, tC, piece) || canMoveBishop(fR, fC, tR, tC, piece);
}

// ===== KING =====
function canMoveKing(fR, fC, tR, tC, piece){
    if(Math.abs(fR - tR) <= 1 && Math.abs(fC - tC) <= 1){
        if(figures[tR][tC] === "") return true;
        return (isWhitePiece(piece) ? isBlackPiece(figures[tR][tC]) : isWhitePiece(figures[tR][tC]));
    }
    return false;
}

// ===== CHECK =====
function isKingInCheck(isWhite){
  let kingPos = null;

  for(let r = 0; r < 8; r++){
    for(let c = 0; c < 8; c++){
      let p = figures[r][c];
      if(p === (isWhite ? "♔" : "♚")) kingPos = {r,c};
    }
  }

  for(let r = 0; r < 8; r++){
    for(let c = 0; c < 8; c++){
        let p = figures[r][c];

        if((isWhite && isBlackPiece(p)) || (!isWhite && isWhitePiece(p))){
            if(canMove(r, c, kingPos.r, kingPos.c, p)) return true;
        }
    }
  }
  return false;
}

// ===== HAS MOVES =====
function hasMoves(isWhite){
  for(let r1 = 0; r1 < 8; r1++){
    for(let c1 = 0; c1 < 8; c1++){
      let p = figures[r1][c1];
      if((isWhite && isWhitePiece(p)) || (!isWhite && isBlackPiece(p))){
        for(let r2 = 0;r2 < 8; r2++){
          for(let c2 = 0; c2 < 8; c2++){
            if(canMove(r1, c1, r2, c2, p)){
              let backup = figures[r2][c2];
              figures[r2][c2] = p; figures[r1][c1] = "";
              if(!isKingInCheck(isWhite)){
                figures[r1][c1] = p; figures[r2][c2] = backup;
                return true;
              }
              figures[r1][c1] = p; figures[r2][c2] = backup;
            }
          }
        }
      }
    }
  }
  return false;
}

// ===== BOARD CLICK =====
board.addEventListener("click", (e) => {
  const cell = e.target;
  if(!cell.classList.contains("cell")) return;
  const row = +cell.dataset.row;
  const col = +cell.dataset.col;
  const piece = figures[row][col];

  if(!isSelected){
    if(piece === "") return;
    if(whitesTurn && !isWhitePiece(piece)) return;
    if(!whitesTurn && !isBlackPiece(piece)) return;
    isSelected = cell; highlightCell(cell); return;
  }

  const fromRow = +isSelected.dataset.row;
  const fromCol = +isSelected.dataset.col;
  const selectedPiece = figures[fromRow][fromCol];

  if(!canMove(fromRow, fromCol, row, col, selectedPiece)){
    unhighlightCell(isSelected);
    isSelected = null;
    return;
  }

  figures[row][col] = selectedPiece;
  figures[fromRow][fromCol] = "";

  createBoard();
  whitesTurn = !whitesTurn;

  turnText.textContent = whitesTurn ? "White's turn" : "Black's turn";
  unhighlightCell(isSelected);
  isSelected = null;

  const sideInCheck = whitesTurn;

  if (isKingInCheck(sideInCheck)) {
    if (!hasMoves(sideInCheck)) {
      alert((sideInCheck ? "White" : "Black") + " is in checkmate!");
    } else {
      alert((sideInCheck ? "White" : "Black") + " is in check!");
    }
  }
});