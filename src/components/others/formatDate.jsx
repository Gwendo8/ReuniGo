function FormatDate() {
  // cette fonction va permettre de formater une date
  const formatDate = (dateStr) => {
    // je créer un objet date avec la date passé en paramètre
    const date = new Date(dateStr);
    // la je formate le jour de la semaine en format 'long' qui donne par exemple : lundi / mardi ....
    const optionsDay = { weekday: "long" };
    // la je dis comment la date va être afficher c'est à dire jour mois année
    const optionsDate = { day: "numeric", month: "long", year: "numeric" };
    // la je formate le jour en fr et en un string avec comme option optionsDay
    const dayName = date.toLocaleDateString("fr-FR", optionsDay);
    // la je formate la date en fr et en un string avec comme options optionsDate
    const fullDate = date.toLocaleDateString("fr-FR", optionsDate);

    // La je formate l'heure et les minutes
    const formattedTime = date.toLocaleTimeString("fr-FR", {
      hour: "2-digit", // L'heure avec 2 chiffres
      minute: "2-digit", // Les minutes avec 2 chiffres
    });

    // et la je retourne le nom du jour, la date complète et les heures et minutes formatées
    return { dayName, fullDate, formattedTime };
  };
  return {
    formatDate,
  };
}

export default FormatDate;
