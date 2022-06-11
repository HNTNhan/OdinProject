let gameType = "tictactoe";

const GameBoard = (() => {
  let _board = gameType === "tictactoe" ? [...Array(9)] : [...Array(64)];
  const _boardContainer = document.querySelector(`#game-board`);

  const getBoard = () => _board;

  const getBoardIndex = (index) => _board[index];

  const setSignByIndex = (index, sign, box) => {
    if (_board[index] === undefined) {
      _board[index] = sign;
      const signContainer = document.createElement("p");
      signContainer.textContent = sign;
      signContainer.style.color = sign === "X" ? "red" : "blue";
      signContainer.classList.add("sign-container");
      signContainer.style.fontSize = `${(box.offsetWidth * 3) / 5 / 16}rem`;
      box.appendChild(signContainer);
      return true;
    }
    return false;
  };

  const getPosibleMove = (board = _board) => {
    return board.reduce((arr, currentValue, currentIndex) => {
      if (!currentValue) {
        arr.push(currentIndex);
      }
      return arr;
    }, []);
  };

  const resetBoard = () => {
    _board = gameType === "tictactoe" ? [...Array(9)] : [...Array(64)];
    _boardContainer.innerHTML = "";
    _initBoard();
    gameController.setTurn(0);
    gameController.setBoxes();
    gameController.addBoxEventListener();
    gameController.setIsGameOver(false);
  };

  const _initBoard = () => {
    for (let i = 0; i < _board.length; i++) {
      let box = document.createElement("div");
      box.classList.add("box", gameType === "tictactoe" ? "small" : "large");

      box.setAttribute("data-index", i);
      _boardContainer.appendChild(box);
    }
  };

  _initBoard();

  return {
    getBoard,
    getBoardIndex,
    setSignByIndex,
    resetBoard,
    getPosibleMove,
  };
})(gameType);

const Player = (sign, name) => {
  const type = "humnan";
  return {
    sign,
    name,
    type,
  };
};

const AI = (sign) => {
  const name = "AI";
  const type = "computer";
  let _level = 0;

  const setLevel = (level) => {
    _level = level;
  };

  const nextMove = () => {
    let board = GameBoard.getBoard();
    while (true) {
      let rand = Math.floor(Math.random() * board.length);
      if (!board[rand]) return rand;
    }
  };

  const nextBestMove = () => {
    function minimax(board, posibleMove, depth = 0, maximizingPlayer = true, maxDepth = _level) {
      if (maxDepth < 0) {
        return !maximizingPlayer ? 100 - depth + 0.5 : -100 + depth - 0.5;
      } else if (gameController.checkGameOver(board)) {
        if (gameController.checkGameOver(board) === "Due") return 0;
        return !maximizingPlayer ? 100 - depth : -100 + depth;
      } else if (posibleMove.length === 0) {
        return 0;
      }
      if (maximizingPlayer) {
        let value = -100;
        let pos;

        posibleMove.reduce((arr, currentValue) => {
          tempBoard = [...board];
          tempBoard[currentValue] = sign;

          const tempValue = minimax(tempBoard, GameBoard.getPosibleMove(tempBoard), depth + 1, false, maxDepth - 1);

          if (tempValue > value) {
            value = tempValue;
            pos = currentValue;
          } else if (tempValue === value) {
            if (Math.random() <= 1 / board.length) {
              value = tempValue;
              pos = currentValue;
            }
          }

          // if (depth === 0) {
          //   console.log(tempValue, currentValue);
          // }
        }, []);

        if (depth === 0) {
          return { value, pos };
        }
        return value;
      } else {
        let value = 100;

        posibleMove.reduce((arr, currentValue) => {
          tempBoard = [...board];
          tempBoard[currentValue] = sign === "X" ? "O" : "X";

          const tempValue = minimax(tempBoard, GameBoard.getPosibleMove(tempBoard), depth + 1, true, maxDepth);
          value = Math.min(value, tempValue);
        }, []);

        return value;
      }
    }

    return minimax(GameBoard.getBoard(), GameBoard.getPosibleMove());
  };

  return { sign, name, type, nextMove, nextBestMove, setLevel };
};

const displayController = (() => {
  const newGameButton = document.querySelector("#new-game");
  const changeGameTypeButton = document.querySelector("#change-type");
  const changeLevelButton = document.querySelector("#change-level");

  (() => {
    newGameButton.addEventListener("click", () => {
      GameBoard.resetBoard();
      gameController.setTurn(0);
    });
  })();

  (() => {
    changeGameTypeButton.addEventListener("click", () => {
      if (gameType === "caro") {
        gameType = "tictactoe";
        gameController._player2.setLevel(0);
        changeLevelButton.textContent = "Easy";
        changeLevelButton.disabled = false;
      } else {
        gameType = "caro";
        changeLevelButton.disabled = true;
        gameController._player2.setLevel(0);
      }
      GameBoard.resetBoard();
    });
  })();

  (() => {
    changeLevelButton.addEventListener("click", () => {
      console.log(changeLevelButton.textContent);
      if (changeLevelButton.textContent === "Easy") {
        changeLevelButton.textContent = "Normal";
        gameController._player2.setLevel(2);
      } else if (changeLevelButton.textContent === "Normal") {
        changeLevelButton.textContent = "Hard";
        gameController._player2.setLevel(9);
      } else {
        changeLevelButton.textContent = "Easy";
        gameController._player2.setLevel(0);
      }
    });
  })();
})();

const gameController = (() => {
  const _player1 = Player("X", "Player1");
  // const _player2 = Player("O", "Player2");
  const _player2 = AI("O");
  let _turn = 0;
  let _boxes = document.querySelectorAll(".box");
  let _isGameOver = false;

  const setTurn = (turn) => {
    _turn = turn;
  };

  const setBoxes = () => {
    _boxes = document.querySelectorAll(".box");
  };

  const setIsGameOver = (isGameOver) => {
    _isGameOver = isGameOver;
  };

  const addBoxEventListener = () => {
    for (let box of _boxes) {
      box.addEventListener("click", () => {
        if (!_isGameOver) {
          const checkSetSign = GameBoard.setSignByIndex(
            box.getAttribute("data-index"),
            _turn % 2 ? _player2.sign : _player1.sign,
            box,
          );

          if (checkSetSign) {
            _turn++;
            if (checkGameOver()) {
              setTimeout(() => {
                alert(checkGameOver().name);
              }, 200);
              _isGameOver = true;
              return;
            } else if (checkGameTie()) {
              setTimeout(() => {
                alert("Tie");
              }, 200);
              _isGameOver = true;
              return;
            }
          }
          if (_player2.type === "computer" && _turn % 2 === 1) {
            // let pos = _player2.nextMove();
            let pos = _player2.nextBestMove().pos;
            GameBoard.setSignByIndex(pos, _player2.sign, document.querySelector(`[data-index="${pos}"]`));
            _turn++;
            if (checkGameOver()) {
              setTimeout(() => {
                alert(checkGameOver().name);
              }, 200);
              _isGameOver = true;
              return;
            } else if (checkGameTie()) {
              setTimeout(() => {
                alert("Tie");
              }, 200);
              _isGameOver = true;
              return;
            }
          }
        }
      });
    }
  };

  const checkGameTie = () => {
    if (!GameBoard.getPosibleMove().length) return true;
    return false;
  };

  const checkGameOver = (board = GameBoard.getBoard()) => {
    match = gameType === "tictactoe" ? 3 : 5;
    const edge = board.length ** 0.5;
    //check match by row
    for (let i = 0; i < board.length; i += edge) {
      let count = 1;
      let sign;
      for (let j = i; j < i + edge - 1; j++) {
        if (board[j] && board[j] === board[j + 1]) {
          if (++count === match) {
            return _player1.sign === sign ? _player1 : _player2;
          }
          sign = board[j];
        } else {
          count = 1;
        }
      }
    }

    // check match by column
    for (let i = 0; i < edge; i++) {
      let count = 1;
      let sign;
      for (let j = i; j < board.length; j += edge) {
        if (board[j] && board[j] === board[j + edge]) {
          if (++count === match) return _player1.sign === sign ? _player1 : _player2;
          sign = board[j];
        } else {
          count = 1;
        }
      }
    }

    // check match by diagonal
    for (let i = 0; i <= edge - match; i++) {
      for (let j = i; j <= (edge - match) * edge; j += edge) {
        let countL = 1;
        let signL;
        let countR = 1;
        let signR;
        for (let k = j; k < board.length; k += edge + 1) {
          if (board[k] && board[k] === board[k + edge + 1]) {
            if (++countL === match) {
              // if (JSON.stringify(GameBoard.getPosibleMove(board)) === JSON.stringify(GameBoard.getPosibleMove())) {
              //   console.log(1);
              // }
              return _player1.sign === signL ? _player1 : _player2;
            }
            signL = board[k];
          } else {
            countL = 1;
          }
        }
        // for (let k = j + edge - i * 2 - 1; k < board.length; k += edge - i * 2 - 1) {
        for (let k = j + edge - 1; k < board.length; k += edge - 1) {
          // if (k + edge - i * 2 - 1 <= board.length - edge && board[k] && board[k] === board[k + edge - i * 2 - 1])
          if (k + edge - 1 <= board.length - edge && board[k] && board[k] === board[k + edge - 1]) {
            if (++countR === match) {
              // if (JSON.stringify(GameBoard.getPosibleMove(board)) === JSON.stringify(GameBoard.getPosibleMove())) {
              //   console.log(i, j, k, k + edge - i * 2 - 1);
              // }
              return _player1.sign === signR ? _player1 : _player2;
            }
            signR = board[k];
          } else {
            countR = 1;
          }
        }
      }
    }

    return false;
  };

  return {
    addBoxEventListener,
    checkGameOver,
    setTurn,
    setBoxes,
    setIsGameOver,
    _player2,
  };
})();

// Start Game
(() => {
  gameController.addBoxEventListener();
})();
