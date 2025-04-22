function borderColorMeeting(meetingDateString) {
  const meetingDate = new Date(meetingDateString);
  const endMeetingDate = new Date(meetingDate);
  endMeetingDate.setMinutes(meetingDate.getMinutes() + 15);
  const now = new Date();

  if (meetingDate > now) {
    return "border-l-orange-300";
  } else if (meetingDate <= now && endMeetingDate >= now) {
    return "border-l-green-500";
  } else {
    return "border-l-red-500";
  }
}

export default borderColorMeeting;
