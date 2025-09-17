// src/components/ResetButton/ResetButton.tsx
import "./ResetButton.scss";
import { RotateCcw } from "lucide-react";

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton = ({ onReset }: ResetButtonProps) => {
  return (
    <button
      className="reset-button"
      onClick={onReset}
      aria-label="Reset Session"
    >
      <RotateCcw size={16} />
      <span>Reset Session</span>
    </button>
  );
};

export default ResetButton;
