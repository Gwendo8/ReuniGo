import { useState } from "react";

// je met un paramètre onSearch qui va permettre de récupérer la valeur de la recherche
// que j'appelerais dans le composant parent userInfo
function SearchBar({ onSearch, placeholder }) {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="w-full md:max-w-md mx-auto md:mx-0 relative flex items-center">
      <span className="absolute right-4 text-gray-400 text-xs md:text-base">
        🔍
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={handleSearch}
        className="w-full px-4 pr-10 py-2 text-sm sm:text-base rounded-lg border border-gray-300 bg-white 
        focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all placeholder-gray-400 text-gray-800"
      />
    </div>
  );
}

export default SearchBar;
