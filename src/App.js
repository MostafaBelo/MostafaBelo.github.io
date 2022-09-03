import classes from "./App.module.css";
import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

import menuIcon from "./menu.svg";

import contents from "./Contents.json";
import puzzles from "./Puzzles(main).json";
import { useSwipeable } from "react-swipeable";

let currentMove = 0;
let difficulties = ["Basic", "Intermediate", "Advanced"];

function App() {
    const [currentPuzzle, setCurrentPuzzle] = useState(0);

    const [game, setGame] = useState(new Chess(puzzles[currentPuzzle].fen));
    const [moveStatus, setMoveStatus] = useState(0);

    const [hints, setHints] = useState([]);

    const [isSideOpen, SetIsSideOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState([-1, -1]);

    // let IsPromotion = (from, to, piece) => {
    //     if (piece === "wP" || piece === "bP") {
    //         if (to[1] === "1" || to[1] === "8") return true;
    //     }
    //     return false;
    // };

    let makeMove = (move) => {
        const gameCopy = { ...game };
        const result = gameCopy.move(move);
        // console.log(result);
        if (result) setGame(gameCopy);
    };

    let IsMoveCorrect = (playedMove, correctMove) => {
        const gameCopy1 = new Chess(game.fen());
        const gameCopy2 = new Chess(game.fen());
        gameCopy1.move(playedMove);
        gameCopy2.move(correctMove);
        return gameCopy1.fen() === gameCopy2.fen();
    };

    let updateCurrentMove = () => {
        currentMove++;
        if (currentMove === puzzles[currentPuzzle].moves.length) {
            setMoveStatus(2);
        }
    };

    let PieceMoved = (source, target, piece) => {
        // console.log(IsPromotion(source, target, piece));
        let move = { from: source, to: target };
        let isCorrect = IsMoveCorrect(
            move,
            puzzles[currentPuzzle].moves[currentMove]
        );
        if (isCorrect) {
            setMoveStatus(1);
            updateCurrentMove();
        }

        makeMove(move);

        // playing enemy move
        if (isCorrect) {
            setTimeout(() => {
                makeMove(puzzles[currentPuzzle].moves[currentMove]);
                updateCurrentMove();
                setTimeout(() => {
                    setMoveStatus((prev) => {
                        if (prev !== 2) return 0;
                        else return 2;
                    });
                }, 500);
            }, 200);
        } else {
            setMoveStatus(-1);
        }
    };

    let clicked = () => {
        if (moveStatus === -1) {
            // wrong
            console.log(puzzles[currentPuzzle].moves);
            const gameCopy = { ...game };
            gameCopy.undo();
            setGame(gameCopy);
            setMoveStatus(0);
        } else if (moveStatus === 0) {
            // hint
            const gameCopy = { ...game };
            gameCopy.move(puzzles[currentPuzzle].moves[currentMove]);
            let HintMove = gameCopy.undo();
            setHints([[HintMove.from, HintMove.to]]);
        } else if (moveStatus === 2) {
            // load next puzzle
            setMoveStatus(0);
            setCurrentPuzzle((prev) => {
                const gameCopy = { ...game };
                gameCopy.load(puzzles[prev + 1].fen);
                setGame(gameCopy);
                currentMove = 0;
                return prev + 1;
            });
        }
    };

    let changePuzzle = (puzzleNumber) => {
        setMoveStatus(0);
        setCurrentPuzzle((prev) => {
            const gameCopy = { ...game };
            gameCopy.load(puzzles[puzzleNumber - 1].fen);
            setGame(gameCopy);
            currentMove = 0;
            return puzzleNumber - 1;
        });

        CloseSideBar();
    };

    let OpenSideBar = () => {
        SetIsSideOpen(true);
    };

    let CloseSideBar = () => {
        setCurrentMenu([-1, -1]);
        SetIsSideOpen(false);
    };

    let cards = [];

    console.log("reload");
    if (currentMenu[0] === -1) {
        console.log("reload 1");
        for (let i = 0; i < contents.length; i++) {
            cards.push(
                <div
                    className={`
            ${classes.MenuCard}
            ${classes.ContentCard}
            `}
                    onClick={() => {
                        setCurrentMenu((prev) => {
                            let newMenu = [...prev];
                            newMenu[0] = i;
                            return newMenu;
                        });
                    }}
                    key={i}
                >
                    {contents[i].Title}
                </div>
            );
        }
    } else if (currentMenu[1] === -1) {
        console.log("reload 2");
        for (let i = 0; i < 3; i++) {
            cards.push(
                <div
                    className={`
              ${classes.MenuCard}
              ${classes.ContentCard}
              `}
                    onClick={() => {
                        setCurrentMenu((prev) => {
                            let newMenu = [...prev];
                            newMenu[1] = i;
                            return newMenu;
                        });
                    }}
                    key={i}
                >
                    {difficulties[i]}
                </div>
            );
        }
    } else {
        console.log("reload 3");
        let start =
            contents[currentMenu[0]][difficulties[currentMenu[1]] + "_Start"];
        let end =
            contents[currentMenu[0]][difficulties[currentMenu[1]] + "_End"];
        for (let i = start; i <= end; i++) {
            cards.push(
                <div
                    className={`
      ${classes.MenuCard}
      ${classes.PuzzleCard}
      `}
                    onClick={() => {
                        changePuzzle(i);
                    }}
                    key={i}
                >
                    {i}
                </div>
            );
        }
    }

    let onSwipe = (e) => {
        CloseSideBar();
    };

    const config = {
        delta: 10, // min distance(px) before a swipe starts. *See Notes*
        preventScrollOnSwipe: false, // prevents scroll during swipe (*See Details*)
        trackTouch: true, // track touch input
        trackMouse: false, // track mouse input
        rotationAngle: 0, // set a rotation angle
        swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
        touchEventOptions: { passive: true }, // options for touch listeners (*See Details*)
    };

    const swipehandler = useSwipeable({
        onSwipedLeft: onSwipe,
        ...config,
    });

    return (
        <div className={classes.App}>
            <div
                className={`${classes.overlay} ${
                    !isSideOpen && classes.overlayHidden
                }`}
                onClick={CloseSideBar}
            >
                <div
                    className={`
                    ${classes.SideBar}
                    ${!isSideOpen && classes.sideHidden}
                    ${
                        currentMenu[1] === -1
                            ? classes.SideMenu
                            : classes.SidePuzzles
                    }
                    `}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    {...swipehandler}
                >
                    {cards}
                </div>
            </div>
            <Chessboard
                id="Board"
                position={game.fen()}
                arePiecesDraggable={true}
                onPieceDrop={PieceMoved}
                boardOrientation={puzzles[currentPuzzle].turn}
                customArrows={hints}
                boardWidth={350}
            />
            <div className={classes.msg}>
                <div
                    className={`
                    ${classes.button}
                    ${(moveStatus === 1 || moveStatus === 2) && classes.Correct}
                    ${moveStatus === -1 && classes.Wrong}
                    `}
                    onClick={clicked}
                >
                    {moveStatus === 2 && "Next Puzzle"}
                    {moveStatus === 1 && "Correct"}
                    {moveStatus === 0 && "Hint"}
                    {moveStatus === -1 && "Retry"}
                </div>
            </div>

            <img
                onClick={OpenSideBar}
                src={menuIcon}
                alt="menu-icon"
                className={classes.menuIcon}
            />
        </div>
    );
}

export default App;
