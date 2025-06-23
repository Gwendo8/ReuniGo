import { useContext } from "react";
import { ThemeContext } from "../others/themeContext";

function BoutonCo({ value }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`px-6 py-2 rounded-xl font-medium transition ${
        theme === "dark"
          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
          : "bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white"
      }`}
    >
      {value}
    </div>
  );
}

export default BoutonCo;
