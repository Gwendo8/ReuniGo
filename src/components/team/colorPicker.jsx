function ColorPicker({ value, onChange, colorPalette }) {
  return (
    <div>
      <label className="font-medium text-gray-700 block mb-2">
        Couleur de l'équipe :
      </label>
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg border border-gray-200 mr-2">
          {colorPalette.map((color) => (
            <button
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              className={`w-7 h-7 rounded-md transition-transform ${
                value === color
                  ? "ring-2 ring-offset-1 ring-gray-400 scale-110"
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
            className="w-8 h-8 p-0 border-none rounded-md cursor-pointer"
          />
          <div
            className="w-8 h-8 rounded-md"
            style={{ backgroundColor: value }}
          ></div>
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;
