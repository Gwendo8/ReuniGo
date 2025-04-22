import MeetingFetch from "../../hook/meetingFetch";

function NextMeeting() {
  const { meeting } = MeetingFetch();
  // Ici je trie les réunions pour savoir quelle sera la prochaine à venir
  const upcomingMeetings = meeting
    // D'abord je filtre les réunions pour ne garder que celles qui sont dans le futur comparé à la date actuelle
    // je transforme la date de la réunion en objet Date pour pouvoir la comparer avec la date actuelle
    .filter((m) => new Date(m.meeting_date) > new Date())
    // ensuite je trie les réunions par date croissante
    // je dis que si la réunion a est plus proche que la réunion b, alors je dois la mettre avant
    .sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date));
  // et du coup ici je récupère la première réunion de la liste triée
  const nextMeeting = upcomingMeetings[0];
  return {
    nextMeeting,
  };
}

export default NextMeeting;
