import { createContext, useState } from "react";

// le useContext est utile quand on doit partager des informations entre les différentes pages
// par exemple pour le thème de l'application

// la on créer un contexte pour le thème
// un context permet de partages des données entre les composants sans avoir a passer manuellement les données via des props
// la le contexte créer est ThemeContext et il va servir a partager le thème de l'application (sombre ou clair)
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

// on passe un paramètre children qui va répresenter tout le contenu qui sera inclus à l'intérieur du composant ThemeContextProvider
// en gros sa gère les propriétées enfant donc les composants (page) qui seront inclus dans le ThemeContextProvider
// donc la ça va permettre de partager le thème de l'application entre toutes la pages qui seront inclus dans le ThemeContextProvider
// qui se trouve dans le fichier main.jsx pour voir quel page est inclus dedans
export function ThemeContextProvider({ children }) {
  // On récupère le thème du localStorage ou on utilise "light" par défaut
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // On sauvegarde le thème dans le localStorage
    localStorage.setItem("theme", newTheme);
  };

  return (
    // donc la on retourne notre contexte qu'on a créer avec le createContext et on retourne également le provider
    // le provider va permettre de partager le contexte entre les composants enfants
    // donc de partager les données entre les différentes pages
    // la value c'est l'objet qu'on veut partager avec ces pages
    // Ici on va partager le thème et la fonction pour changer le thème
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* du coup la on passe le paramtre children qui va permettre de récupérer tout le contenu qui sera inclus à l'intérieur du composant ThemeContextProvider */}
      {children}
    </ThemeContext.Provider>
  );
}
