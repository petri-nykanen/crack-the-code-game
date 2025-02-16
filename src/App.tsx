import { useEffect, useRef, useState } from "react";
import DigitBox from "./components/digit-box";
import "./app.css";

interface DigitsToGuess {
	correct: number[];
	incorrect: number[];
	firstGuess: number[];
	secondGuess: number[];
	thirdGuess: number[];
}

function App() {
	const [digits, setDigits] = useState<DigitsToGuess>();
	const guessRef = useRef<HTMLInputElement>(null);
	const [youWin, setYouWin] = useState(false);

	/**One of the numbers is correct, but in wrong place*/
	const formFirstClue = (
		correctArr: number[],
		incorrectArr: number[],
	): number[] => {
		const correctDigit =
			correctArr[Math.floor(Math.random() * correctArr.length)];
		const incorrectDigit =
			incorrectArr[Math.floor(Math.random() * incorrectArr.length)];
		const clueArr = [
			correctDigit,
			incorrectDigit,
			Math.floor(Math.random() * 9),
		];

		//1st if: check that correct digit isn't in the same spot as in the clue array
		if (clueArr.indexOf(correctDigit) === correctArr.indexOf(correctDigit))
			return formFirstClue(correctArr, incorrectArr);
		//2nd if: check that digits are unique and not from correct array
		if (Array.from(new Set(clueArr.concat(correctArr))).length < 5)
			return formFirstClue(correctArr, incorrectArr);
		return clueArr;
	};

	/**One of the numbers is correct, but in wrong place*/
	const formSecondClue = (
		correctArr: number[],
		incorrectArr: number[],
	): number[] => {
		const correctDigit =
			correctArr[Math.floor(Math.random() * correctArr.length)];
		const incorrectDigit =
			incorrectArr[Math.floor(Math.random() * incorrectArr.length)];
		const clueArr = [
			correctDigit,
			incorrectDigit,
			Math.floor(Math.random() * 9),
		];

		//1st if: check that correct digit isn't in the same spot as in the clue array
		if (clueArr.indexOf(correctDigit) !== correctArr.indexOf(correctDigit))
			return formSecondClue(correctArr, incorrectArr);
		//2nd if: check that digits are unique and not from correct array
		if (Array.from(new Set(clueArr.concat(correctArr))).length < 5)
			return formSecondClue(correctArr, incorrectArr);
		return clueArr;
	};

	/**One of the numbers is correct, but in wrong place*/
	const formThirdClue = (
		correctArr: number[],
		incorrectArr: number[],
	): number[] => {
		const correctDigit =
			correctArr[Math.floor(Math.random() * correctArr.length)];
		const correctDigit2 =
			correctArr[Math.floor(Math.random() * correctArr.length)];

		if (correctDigit === correctDigit2)
			return formThirdClue(correctArr, incorrectArr);

		const incorrectDigit =
			incorrectArr[Math.floor(Math.random() * incorrectArr.length)];
		const clueArr = [correctDigit, incorrectDigit, correctDigit2];

		if (clueArr.indexOf(correctDigit) === correctArr.indexOf(correctDigit))
			return formThirdClue(correctArr, incorrectArr);
		if (clueArr.indexOf(correctDigit2) === correctArr.indexOf(correctDigit2))
			return formThirdClue(correctArr, incorrectArr);

		// //1st if: check that correct digit isn't in the same spot as in the clue array
		// if ((clueArr.indexOf(correctDigit) !== correctArr.indexOf(correctDigit))) return formThirdClue(correctArr, incorrectArr)
		// //2nd if: check that digits are unique and not from correct array
		// if (Array.from(new Set(clueArr.concat(correctArr))).length < 5) return formThirdClue(correctArr, incorrectArr)
		return clueArr;
	};

	/**
	 * Validates that the puzzle is possible
	 * Digits must be deducible, this functions prevents having to guess or 50/50 situations with digit placements
	 */
	// const validateClues

	const guess = () => {
		const parsed = Number(digits?.correct.join(""));
		if (parsed === Number(guessRef.current?.value)) setYouWin(true);
	};

	/**
	 * Generates correct and incorrect 3 digits
	 */
	const generateDigits = () => {
		const nums = new Set<number>();
		// const randomNumber = (Math.random() * 9) + 1;

		while (nums.size !== 6) {
			nums.add(Math.floor(Math.random() * 10));
		}

		const numsArr: number[] = Array.from(nums);
		const correctDigits = numsArr.slice(0, 3);
		const incorrectDigits = numsArr.slice(3, 6);
		// const firstClue = Array.from(correctDigits)
		const firstClue = formFirstClue(correctDigits, incorrectDigits);
		const secondClue = formSecondClue(correctDigits, incorrectDigits);
		const thirdClue = formThirdClue(correctDigits, incorrectDigits);

		setDigits({
			...digits,
			correct: correctDigits,
			incorrect: incorrectDigits,
			firstGuess: firstClue,
			secondGuess: secondClue,
			thirdGuess: thirdClue,
		});
	};

	useEffect(() => {
		generateDigits();
	}, []);

	return (
		<div
			style={{
				margin: "auto",
				textAlign: "center",
				marginTop: "10%",
				width: "50%"
			}}
		>
			One of the numbers is correct, but in wrong place:{" "}
			<DigitBox digits={digits?.firstGuess} />
			<br />
			One of the numbers is correct and in correct place:{" "}
			<DigitBox digits={digits?.secondGuess} />
			<br />
			Two numbers are correct, but in wrong places:{" "}
			<DigitBox digits={digits?.thirdGuess} />
			<br />
			None of the numbers are correct: <DigitBox digits={digits?.incorrect} />
			<br />
			<input ref={guessRef} />
			<br />
			<button onClick={() => guess()}>Guess</button>
			<br />
			{youWin ? (
				<>
					Correct: {digits?.correct}
					<br />
				</>
			) : (
				<></>
			)}
			<button onClick={generateDigits}>TEST</button>
		</div>
	);
}

export default App;
