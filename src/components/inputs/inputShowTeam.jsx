import { useId } from "react";

function InputShowTeam({
  placeholder,
  value,
  onChange,
  label,
  icon: Icon,
  type,
}) {
  const id = useId();
  const inputType =
    type ||
    (label.toLowerCase().includes("mot de passe") ? "password" : "text");

  return (
    <div className="flex gap-3">
      <label htmlFor={id} className="font-medium text-gray-700">
        {Icon && <Icon className="inline-block mr-2 text-blue-600" />}
        {label}
      </label>
      <input
        type={inputType}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className=" focus:outline-none focus:ring-2 focus:ring-gray-50"
      />
    </div>
  );
}

export default InputShowTeam;
