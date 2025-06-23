import { useId, useContext } from "react";
import { User, Lock } from "lucide-react";
import { ThemeContext } from "../others/themeContext";

function Input({ placeholder, value, onChange, label, icon, className }) {
  const { theme } = useContext(ThemeContext);
  const id = useId();
  const isPassword = label.toLowerCase().includes("mot de passe");

  return (
    <div className="w-full px-4 mb-6">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-2 ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        {label}
      </label>
      <div
        className={`flex items-center border rounded-xl px-4 py-3 shadow-md focus-within:ring-2 transition-all duration-200 ${
          theme === "dark"
            ? "bg-gray-700 border-gray-600 focus-within:ring-cyan-400"
            : "bg-white border-gray-300 focus-within:ring-blue-500"
        } ${className || ""}`}
      >
        <span
          className={
            theme === "dark" ? "text-gray-400 mr-3" : "text-gray-500 mr-3"
          }
        >
          {icon || (isPassword ? <Lock size={20} /> : <User size={20} />)}
        </span>
        <input
          id={id}
          type={isPassword ? "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 bg-transparent border-none outline-none text-base ${
            theme === "dark"
              ? "text-white placeholder-gray-400"
              : "text-gray-800 placeholder-gray-400"
          }`}
        />
      </div>
    </div>
  );
}

export default Input;
