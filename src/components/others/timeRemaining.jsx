function TimeRemaining() {
  // cette fonction permet de calculer le temps restant avant le début de la prochaine réunion
  // elle prend en paramètre une date au format string
  const getTimeRemaining = (dateString) => {
    // je récupère la date actuelle
    const now = new Date();
    // je tranforme la date de la réunion en objet Date
    const target = new Date(dateString);
    // je calcule la différence entre la date de la réunion et la date actuelle
    const diff = target - now;
    if (diff <= 0) return "Déjà commencée";
    // la je calcule le nombre d'heures restantes
    // je divise la différence par le nombre de millisecondes dans une heure (1000 milisecondes * 60 secondes * 60 minutes)
    // et je fais un arrondi à l'entier inférieur
    const hours = Math.floor(diff / (1000 * 60 * 60));
    // la je calcule le nombre de minutes restantes
    // je divise la différence par le nombre de millisecondes dans une minute
    // et je fais un arrondi à l'entier inférieur
    // je fais le modulo de la différence par le nombre de millisecondes dans une heure
    // pour ne garder que le reste de la division
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min restantes`;
  };
  return {
    getTimeRemaining,
  };
}

export default TimeRemaining;
