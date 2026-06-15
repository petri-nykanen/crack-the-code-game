import { useEffect, useState } from "react";
import DigitBox from "./components/digit-box";
import "./app.css";

type ClueType =
    | "none"
    | "two_wrong"
    | "one_right_place"
    | "one_wrong_place"
    | "two_right_place";

interface Clue {
    digits: number[];
    type: ClueType;
}

interface Puzzle {
    secret: number[];
    clues: Clue[];
}

/**
 * Top-level app component.
 */
function App() {
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [guessDigits, setGuessDigits] = useState<number[]>([]);
    const [youWin, setYouWin] = useState(false);

    const compareSecret = (
        secret: number[],
        guess: number[],
    ): { correctPlace: number; wrongPlace: number } => {
        let correctPlace = 0;
        let wrongPlace = 0;
        const secretUsed = [false, false, false];
        const guessUsed = [false, false, false];

        for (let i = 0; i < 3; i++) {
            if (secret[i] === guess[i]) {
                correctPlace++;
                secretUsed[i] = true;
                guessUsed[i] = true;
            }
        }

        for (let i = 0; i < 3; i++) {
            if (guessUsed[i]) continue;
            for (let j = 0; j < 3; j++) {
                if (secretUsed[j]) continue;
                if (guess[i] === secret[j]) {
                    wrongPlace++;
                    secretUsed[j] = true;
                    guessUsed[i] = true;
                    break;
                }
            }
        }

        return { correctPlace, wrongPlace };
    };

    const matchesClueType = (
        secret: number[],
        guess: number[],
        type: ClueType,
    ): boolean => {
        const { correctPlace, wrongPlace } = compareSecret(secret, guess);
        switch (type) {
            case "none":
                return correctPlace === 0 && wrongPlace === 0;
            case "two_wrong":
                return correctPlace === 0 && wrongPlace === 2;
            case "one_right_place":
                return correctPlace === 1 && wrongPlace === 0;
            case "one_wrong_place":
                return correctPlace === 0 && wrongPlace === 1;
            case "two_right_place":
                return correctPlace === 2 && wrongPlace === 0;
            default:
                return false;
        }
    };

    const allUniqueTriples = (): number[][] => {
        const out: number[][] = [];
        for (let a = 0; a <= 9; a++) {
            for (let b = 0; b <= 9; b++) {
                if (b === a) continue;
                for (let c = 0; c <= 9; c++) {
                    if (c === a || c === b) continue;
                    out.push([a, b, c]);
                }
            }
        }
        return out;
    };

    const TRIPLES = allUniqueTriples();

    const solveCandidates = (clues: Clue[]): number[][] => {
        return TRIPLES.filter((candidate) =>
            clues.every((clue) => matchesClueType(candidate, clue.digits, clue.type)),
        );
    };

    const validCluesForType = (secret: number[], type: ClueType): number[][] => {
        return TRIPLES.filter((t) => matchesClueType(secret, t, type));
    };

    const pickCluesForSecret = (secret: number[]): Clue[] | null => {
        const allTypes: ClueType[] = [
            "none",
            "two_wrong",
            "one_right_place",
            "one_wrong_place",
            "two_right_place",
        ];

        for (let attempt = 0; attempt < 2000; attempt++) {
            const shuffled = [...allTypes].sort(() => Math.random() - 0.5);
            const types = shuffled.slice(0, 4);

            const clues: Clue[] = [];
            let valid = true;
            for (const type of types) {
                const pool = validCluesForType(secret, type);
                if (pool.length === 0) {
                    valid = false;
                    break;
                }
                clues.push({ digits: pool[Math.floor(Math.random() * pool.length)], type });
            }
            if (!valid) continue;

            const union = new Set<number>();
            for (const clue of clues) clue.digits.forEach((d) => union.add(d));
            const allPresent = secret.every((d) => union.has(d));
            if (!allPresent) continue;

            const candidates = solveCandidates(clues);
            if (candidates.length === 1) return clues;
        }
        return null;
    };

    const generatePuzzle = (): Puzzle => {
        const secrets = TRIPLES.slice().sort(() => Math.random() - 0.5);
        for (const secret of secrets) {
            const clues = pickCluesForSecret(secret);
            if (clues) return { secret, clues };
        }
        const fallbackSecret = [0, 1, 5];
        const fallbackClues: Clue[] = [
            { digits: [4, 7, 6], type: "none" },
            { digits: [5, 6, 0], type: "two_wrong" },
            { digits: [0, 4, 6], type: "one_right_place" },
            { digits: [5, 4, 7], type: "one_wrong_place" },
        ];
        return { secret: fallbackSecret, clues: fallbackClues };
    };

    const handleClueClick = (digit: number) => {
        setGuessDigits((previous) => {
            if (previous.includes(digit)) {
                return previous.filter((item) => item !== digit);
            }
            if (previous.length >= 3) return previous;
            return [...previous, digit];
        });
    };

    const clearGuess = () => setGuessDigits([]);

    const guess = () => {
        if (!puzzle) return;
        if (guessDigits.length !== 3) return;
        if (guessDigits.every((n, i) => n === puzzle.secret[i])) setYouWin(true);
    };

    useEffect(() => {
        setPuzzle(generatePuzzle());
    }, []);

    const regenerate = () => {
        setGuessDigits([]);
        setYouWin(false);
        setPuzzle(generatePuzzle());
    };

    return (
        <div
            style={{
                margin: "auto",
                textAlign: "center",
                marginTop: "10%",
                width: "50%",
            }}
        >
            {puzzle?.clues.map((c, idx) => (
                <div key={idx}>
                    <div style={{ fontWeight: 600 }}>
                        {(() => {
                            switch (c.type) {
                                case "none":
                                    return "None of the numbers are correct:";
                                case "two_wrong":
                                    return "Two numbers are correct, but in wrong places:";
                                case "one_right_place":
                                    return "One of the numbers is correct and in correct place:";
                                case "one_wrong_place":
                                    return "One of the numbers is correct, but in wrong place:";
                                case "two_right_place":
                                    return "Two numbers are correct and in correct places:";
                                default:
                                    return "Clue:";
                            }
                        })()}
                    </div>
                    <DigitBox digits={c.digits} selectedDigits={guessDigits} onDigitClick={handleClueClick} />
                    <br />
                </div>
            ))}

            <div style={{ margin: "1rem 0" }}>
                <input value={guessDigits.join("")} readOnly />
                <button onClick={clearGuess} style={{ marginLeft: "0.5rem" }}>
                    Clear
                </button>
            </div>
            <button onClick={guess}>Guess</button>
            <br />
            {youWin ? (
                <>
                    Correct: {puzzle?.secret.join("")}
                    <br />
                </>
            ) : null}
            <button onClick={regenerate}>TEST</button>
        </div>
    );
}

export default App;
