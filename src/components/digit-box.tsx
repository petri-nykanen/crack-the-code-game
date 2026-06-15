import type { CSSProperties } from "react";
import { motion } from "framer-motion";

interface Props {
    digits?: number[];
    selectedDigits?: number[];
    onDigitClick?: (digit: number) => void;
}

/**
 * Render a row of clue digits and expose click callbacks for guess building.
 * @param props.digits Clue digits to render.
 * @param props.selectedDigits Currently selected guess digits.
 * @param props.onDigitClick Callback when a digit is clicked.
 */
const DigitBox = ({ digits = [], selectedDigits = [], onDigitClick }: Props) => {
    const selectedDigitStyle: CSSProperties = {
        border: "2px solid black",
        backgroundColor: "pink",
        marginLeft: "1%",
        fontSize: 50,
        padding: "1%",
        fontFamily: "sans-serif",
        boxShadow: "0 0 0.75rem purple",
        userSelect: "none",
    };

    const digitStyle: CSSProperties = {
        border: "2px solid black",
        backgroundColor: "white",
        marginLeft: "1%",
        fontSize: 50,
        padding: "1%",
        fontFamily: "sans-serif",
        userSelect: "none",
    };

    if (digits.length === 0) return null;

    const handleDigitClick = (digit: number) => {
        onDigitClick?.(digit);
    };

    return (
        <div
            style={{
                marginTop: "2%",
                marginBottom: "1%",
                display: "flex",
                justifyContent: "center",
            }}
        >
            {digits.map((digit, idx) => {
                const isSelected = selectedDigits.includes(digit);
                return (
                    <motion.div
                        key={`${digit}-${idx}`}
                        style={isSelected ? selectedDigitStyle : digitStyle}
                        onClick={() => handleDigitClick(digit)}
                        animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{
                            duration: 1,
                            ease: "easeInOut",
                            repeat: isSelected ? Number.POSITIVE_INFINITY : 0,
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
