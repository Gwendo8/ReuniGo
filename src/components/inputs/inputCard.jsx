import { useId } from "react";

function InputCard({ placeholder, value, onChange, label, icon: Icon }) {
  const id = useId();
  const isPassword = label.toLowerCase().includes("mot de passe");

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-md md:text-lg text-gray-800 mb-2">
        {Icon && <Icon className="inline-block mr-2 text-blue-600" />}
        {label}
      </label>
      <input
        type={isPassword ? "password" : "text"}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 md:p-3 rounded-md bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default InputCard;
