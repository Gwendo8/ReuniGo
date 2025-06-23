import { useState, useContext } from "react";
import { ThemeContext } from "./themeContext";

// je met un paramètre onSearch qui va permettre de récupérer la valeur de la recherche
// que j'appelerais dans le composant parent userInfo
function SearchBar({ onSearch, placeholder }) {
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="w-full md:max-w-md mx-auto md:mx-0 relative flex items-center">
      <span
        className={`absolute right-4 text-xs md:text-base ${
          theme === "dark" ? "text-gray-400" : "text-gray-400"
        }`}
      >
        🔍
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={handleSearch}
        className={`w-full px-4 pr-10 py-2 text-sm sm:text-base rounded-lg border focus:outline-none focus:ring-2 transition-all ${
          theme === "dark"
            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-400"
            : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-blue-300"
        }`}
      />
    </div>
  );
}

export default SearchBar;
