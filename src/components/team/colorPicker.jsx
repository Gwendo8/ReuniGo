import { useContext } from "react";
import { ThemeContext } from "../others/themeContext";

function ColorPicker({ value, onChange, colorPalette }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div>
      <label
        className={`font-medium block mb-2 ${
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        }`}
      >
        Couleur de l'équipe :
      </label>
      <div className="flex flex-wrap gap-2 items-center">
        <div
          className={`flex flex-wrap gap-2 p-2 rounded-lg border mr-2 ${
            theme === "dark"
              ? "bg-slate-600 border-slate-500"
              : "bg-white border-gray-200"
          }`}
        >
          {colorPalette.map((color) => (
            <button
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              className={`w-7 h-7 rounded-md transition-transform ${
                value === color
                  ? `ring-2 ring-offset-1 ${
                      theme === "dark" ? "ring-gray-300" : "ring-gray-400"
                    } scale-110`
                  : "hover:scale-110"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-8 h-8 p-0 border-none rounded-md cursor-pointer ${
              theme === "dark" ? "bg-slate-600" : "bg-white"
            }`}
          />
          <div
            className="w-8 h-8 rounded-md"
            style={{ backgroundColor: value }}
          ></div>
          <span
            className={`font-mono text-sm px-2 py-1 rounded ${
              theme === "dark"
                ? "bg-slate-600 text-gray-200"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;
