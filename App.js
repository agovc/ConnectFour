import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss'

export default function App() {
    return (<ConnectFour />);
}

const BOARD_SIZE = { width: 7, height: 6};

function ConnectFour() {
    const initialBoard = Array(BOARD_SIZE.height).fill(Array(BOARD_SIZE.width).fill(null));
    const [board, setBoard] = useState(initialBoard);
    const [turn, setTurn] = useState(1);
    const [finalState, setFinalState] = useState(null);
    const styles = useStyles();

    const printBoard = () => {
        return board.map((rows, rowIndex) => {
            return (
                <div key={rowIndex} className={styles.rows}>
                    {rows.map((col, colIndex) => {
                        const value = board[rowIndex][colIndex];
                        return (
                            <Token key={`${rowIndex}-${colIndex}`} player={value}/>
                        )
                    })}
                </div>
            )

        })
    }

    const handleDropCLick = e => {
        const column = e.target.value;
        const currentBoard = [...board.map(rows => [...rows])];

        for (let i = BOARD_SIZE.height; i > 0; i--) {
            if (currentBoard[i-1][column] === null) {
                currentBoard[i-1][column] = turn;
                break;
            }
        }

        const newTurn = turn === 1 ? 2 : 1;
        setBoard(currentBoard);
        setTurn(newTurn);

        const finalState = window.connectFour.checkForWinner(currentBoard);
        setFinalState(finalState);
    };

    const handleRestartClick = () => {
        setBoard(initialBoard);
        const newTurn = turn === 1 ? 2 : 1;
        setTurn(newTurn);
        setFinalState(null);
    }

    const player = turn === 1 ? 'Yellow' : 'Red';
    const winner = finalState !== null && finalState === 1 ? 'Yellow won!' : finalState === 2 ? 'Red won!' : 'Draw!';

    return (
        <>
            <h1 className={styles.title}>
                {finalState === null ? `${player}'s turn` : winner}
            </h1>
            {finalState === null ? (
                <div className={styles.buttons}>
                    {board[0].map(( _, index) => {
                        return (
                            <button value={index} onClick={handleDropCLick} className={styles.button} key={index}>Drop</button>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.restart}>
                    <button className={styles.button} onClick={handleRestartClick}>Play again!</button>
                </div>
            )}
            <div className={styles.board}>{printBoard()}</div>
        </>
    );
}

function Token(props) {
    const { player } = props;
    const styles = useStyles();
    const playerClassname = player === 1 ? styles.playerOne : player === 2 ? styles.playerTwo : '';

    return (
        <div className={styles.container}>
            <div className={[styles.token, playerClassname].join(' ')}></div>
        </div>
    );
}

const useStyles = createUseStyles({
    title: {
        textAlign: "center"
    },
    board: {
        width: 80 * BOARD_SIZE.width,
        border: '1px solid gray',
    },
    rows: {
        display: 'flex'
    },
    container: {
        width: 80,
        height: 80,
        border: '1px solid gray',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    token: {
        height: '90%',
        width: '90%',
        borderRadius: 50,
    },
    playerOne: {
        backgroundColor: '#cad582',
    },
    playerTwo: {
        backgroundColor: '#c56844',
    },
    buttons: {
        width: 80 * BOARD_SIZE.width,
        display: 'flex',
        justifyContent: "space-between",
        margin: '20px 0 20px 0'
    },
    restart: {
        width: 80 * BOARD_SIZE.width,
        display: 'flex',
        justifyContent: "center",
        margin: '20px 0 20px 0'
    },
    button: {
        width: 76,
        height: 30
    }
});

const NUM_IN_ROW_WIN = 4;
window.connectFour = {
    deepClone: (arr) => JSON.parse(JSON.stringify(arr)),
    checkForWinner: (board) => {
        const checkVerticalWinner = (board) => {
            for (let x = 0; x < board.length; x++) {
                let maxNumInRow = 1;
                let lastToken = board[x][0];
                for (let y = 1; y < board[x].length; y++) {
                    const currentToken = board[x][y];
                    if (currentToken === lastToken && currentToken !== null) {
                        maxNumInRow++;
                        if (maxNumInRow === NUM_IN_ROW_WIN) {
                            return currentToken;
                        }
                    } else {
                        maxNumInRow = 1;
                    }
                    lastToken = currentToken;
                }
            }

            return null;
        }

        const checkHorizontalWinner = (board) => {
            for (let y = 0; y < board[0].length; y++) {
                let maxNumInRow = 1;
                let lastToken = board[0][y];
                for (let x = 1; x < board.length; x++) {
                    const currentToken = board[x][y];
                    if (currentToken === lastToken && currentToken !== null) {
                        maxNumInRow++;
                        if (maxNumInRow === NUM_IN_ROW_WIN) {
                            return currentToken;
                        }
                    } else {
                        maxNumInRow = 1;
                    }
                    lastToken = currentToken;
                }
            }

            return null;
        }

        const checkDiagonalWinner = (board) => {
            for (let x = 0; x < board.length; x++) {
                for (let y = 0; y < board[x].length; y++) {
                    const currentToken = board[x][y];

                    if (currentToken !== null && ((
                        x < board.length - 3 &&
                        y < board[x].length - 3 &&
                        currentToken === board[x+1][y+1] &&
                        currentToken === board[x+2][y+2] &&
                        currentToken === board[x+3][y+3]
                    ) || (
                        x >= 3 &&
                        currentToken === board[x-1][y+1] &&
                        currentToken === board[x-2][y+2] &&
                        currentToken === board[x-3][y+3]
                    ))) {
                        return currentToken;
                    }
                }
            }

            return null;
        }

        let hasEmptySpace = false;
        board.forEach((row) => hasEmptySpace = hasEmptySpace || row.findIndex((cell) => cell === null) >= 0)
        if (!hasEmptySpace) {
            return "draw";
        }
        return checkVerticalWinner(board) ||
            checkHorizontalWinner(board) ||
            checkDiagonalWinner(board);
    }
};