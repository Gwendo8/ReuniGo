function borderColorMeeting(meetingDateString, meetingTime) {
  const meetingDate = new Date(meetingDateString);
  const endMeetingDate = new Date(meetingDate);
  endMeetingDate.setMinutes(
    meetingDate.getMinutes() + Number(meetingTime || 0)
  );
  const now = new Date();

  if (meetingDate > now) {
    return "border-l-4 border-l-orange-300";
  } else if (meetingDate <= now && endMeetingDate >= now) {
    return "border-l-4 border-l-green-500";
  } else if (endMeetingDate < now) {
    return "border-l-4 border-l-red-500";
  }
}

export default borderColorMeeting;
