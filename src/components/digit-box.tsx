import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
	digits: number;
}

const DigitBox = (props: Props) => {
	const { digits } = props;

	const selectedDigitStyle = {
		border: "2px solid black",
		backgroundColor: "pink",
		marginLeft: "1%",
		fontSize: 50,
		padding: "1%",
		fontFamily: "sans-serif",
		boxShadow: "0 0 0.75rem purple",
		userSelect: "none",
	};

	const digitStyle = {
		border: "2px solid black",
		backgroundColor: "white",
		marginLeft: "1%",
		fontSize: 50,
		padding: "1%",
		fontFamily: "sans-serif",
		userSelect: "none",
	};

	const inactiveDigitStyle = {
		border: "2px solid black",
		color:"darkgray",
		backgroundColor: "gray",
		marginLeft: "1%",
		fontSize: 50,
		padding: "1%",
		fontFamily: "sans-serif",
		userSelect: "none",
	};

	const [selectedDigit, setSelectedDigit] = useState([]);
	const [inactiveDigit, setInactiveDigit] = useState([]);

	const handleDigitSelect = (digit: number) => {
		setSelectedDigit([...selectedDigit, digit]);

		if (selectedDigit.find((containsDigit) => digit === containsDigit)) {
			console.log(
				selectedDigit.filter((containsDigit) => digit !== containsDigit),
			);
			setSelectedDigit(
				selectedDigit.filter((containsDigit) => digit !== containsDigit),
			);
		}
	};

	const handleDigitDeactivation = (digit: number) => {
		setInactiveDigit([...inactiveDigit, digit]);

		if (inactiveDigit.find((containsDigit) => digit === containsDigit)) {
			console.log(
				inactiveDigit.filter((containsDigit) => digit !== containsDigit),
			);
			setInactiveDigit(
				inactiveDigit.filter((containsDigit) => digit !== containsDigit),
			);
		}
	};

	useEffect(() => {
		console.log(selectedDigit);
	}, [selectedDigit]);

	return (
		<div
			style={{
				marginTop: "2%",
				marginBottom: "1%",
				display: "flex",
				justifyContent: "center",
			}}
		>
			{digits
				?.toString()
				.split(",")
				.map((digit) => {
					return (
						<motion.div
							key={null}
							style={
								selectedDigit.find((containsDigit) => digit === containsDigit)
									? selectedDigitStyle
									: inactiveDigit.find(
												(containsDigit) => digit === containsDigit,
											)
										? inactiveDigitStyle
										: digitStyle
							}
							onClick={() => handleDigitSelect(digit)}
							onContextMenu={(e) => {
								e.preventDefault();
								handleDigitDeactivation(digit);
							}}
							animate={
								selectedDigit.find((containsDigit) => digit === containsDigit)
									? { scale: [1, 1.2, 1] }
									: { scale: 1 }
							}
							transition={{
								duration: 1,
								ease: "easeInOut",
								repeat: selectedDigit.find(
									(containsDigit) => digit === containsDigit,
								)
									? Number.POSITIVE_INFINITY
									: 0,
							}}
						>
							{digit}
						</motion.div>
					);
				})}
		</div>
	);
};

export default DigitBox;
