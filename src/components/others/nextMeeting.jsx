import MeetingFetch from "../../hook/meetingFetch";
import getStatus from "./getStatus";
import { useRefresh } from "./refreshInfo";
import { useEffect } from "react";

function NextMeeting() {
  const { refreshTrigger } = useRefresh();
  const { meeting, fetchData } = MeetingFetch();

  useEffect(() => {
    fetchData();
  }, [refreshTrigger, fetchData]);

  // Ici je cherche la réunion qui est en cours
  // je fais un tableau avec toutes les réunions qui sont en cours
  const currentMeeting = meeting.find((m) => getStatus(m) === "En cours");

  // Si il y a une réunion en cours, je la retourne
  if (currentMeeting) {
    return { nextMeeting: currentMeeting };
  }
  // Sinon je cherche la réunion qui est à venir
  // Ici je trie les réunions pour savoir quelle sera la prochaine à venir
  const upcomingMeetings = meeting
    // je filtre les réunions pour ne garder que celles qui sont à venir
    // et je fais un tableau avec toutes les réunions qui sont à venir
    .filter((m) => getStatus(m) === "À venir")
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
