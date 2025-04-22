import { useId } from "react";
import { User, Lock } from "lucide-react";

function Input({ placeholder, value, onChange, label }) {
  const id = useId();
  const isPassword = label.toLowerCase().includes("mot de passe");

  return (
    <div className="w-full px-4 mb-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-800 mb-2"
      >
        {label}
      </label>
      <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-md focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
        <span className="text-gray-500 mr-3">
          {isPassword ? <Lock size={20} /> : <User size={20} />}
        </span>
        <input
          id={id}
          type={isPassword ? "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-base"
        />
      </div>
    </div>
  );
}

export default Input;
