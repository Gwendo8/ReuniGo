import { useId, useContext } from "react";
import { ThemeContext } from "../others/themeContext";

function InputCard({ placeholder, value, onChange, label, icon: Icon, type }) {
  const { theme } = useContext(ThemeContext);
  const id = useId();
  const inputType =
    type ||
    (label.toLowerCase().includes("mot de passe") ? "password" : "text");

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className={`text-md md:text-lg mb-2 ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        {Icon && (
          <Icon
            className={`inline-block mr-2 ${
              theme === "dark" ? "text-cyan-400" : "text-blue-600"
            }`}
          />
        )}
        {label}
      </label>
      <input
        type={inputType}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`p-2 md:p-3 rounded-md border focus:outline-none focus:ring-2 transition-colors ${
          theme === "dark"
            ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:ring-cyan-400 focus:border-cyan-400"
            : "bg-gray-50 text-gray-700 border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
        }`}
      />
    </div>
  );
}

export default InputCard;
