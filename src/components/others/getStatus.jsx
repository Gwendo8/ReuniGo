function getStatus(meeting) {
  const now = new Date();
  // la je déclare une variable start avec la date de la réunion
  const start = new Date(meeting.meeting_date);
  // ensuite je délcare une variable end qui est la fin de la réunion
  const end = new Date(start);
  // j'ajoute a cette variable le nombre qu'il y'a de minutes de saisies dans la réunion
  end.setMinutes(start.getMinutes() + Number(meeting.meeting_time || 0));

  if (start > now) return "À venir";
  if (start <= now && end >= now) return "En cours";
  return "Passé";
}

export default getStatus;
