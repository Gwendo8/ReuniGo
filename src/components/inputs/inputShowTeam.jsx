import { useId, useContext } from "react";
import { ThemeContext } from "../others/themeContext";

function InputShowTeam({
  placeholder,
  value,
  onChange,
  label,
  icon: Icon,
  type,
}) {
  const { theme } = useContext(ThemeContext);
  const id = useId();
  const inputType =
    type ||
    (label.toLowerCase().includes("mot de passe") ? "password" : "text");

  return (
    <div className="flex gap-3 items-center">
      <label
        htmlFor={id}
        className={`font-medium ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
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
        className={`focus:outline-none focus:ring-2 ${
          theme === "dark"
            ? "bg-transparent text-gray-200 placeholder-gray-400 focus:ring-cyan-500/20"
            : "focus:ring-gray-50 text-gray-800 border-gray-300 placeholder-gray-500"
        }`}
      />
    </div>
  );
}

export default InputShowTeam;
