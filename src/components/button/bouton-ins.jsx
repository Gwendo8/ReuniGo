import { useContext } from "react";
import { ThemeContext } from "../others/themeContext";

function BoutonInsc({ value, children, ...props }) {
  const { theme } = useContext(ThemeContext);

  return (
    <button
      className={`px-6 py-2 rounded-xl font-medium border-2 transition-all duration-300 ${
        theme === "dark"
          ? "border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20"
          : "bg-white border-2 border-[#17428C] text-[#17428C] hover:bg-gray-50"
      }`}
      {...props}
    >
      {children}
      <span>{value}</span>
    </button>
  );
}

export default BoutonInsc;
