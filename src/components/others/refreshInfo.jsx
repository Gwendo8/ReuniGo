/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

// la je créer un context
// un context permet de partager des données entre plusieurs composants
const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCloseCard = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    // je fournis le compteur et la fonction au context créer
    <RefreshContext.Provider value={{ refreshTrigger, handleCloseCard }}>
      {children}
    </RefreshContext.Provider>
  );
};

// et je met ce contexte dans un hook personnalisé
export const useRefresh = () => useContext(RefreshContext);
