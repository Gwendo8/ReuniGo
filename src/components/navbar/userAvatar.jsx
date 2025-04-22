function UserAvatar({ firstname, lastname, email }) {
  const initials = `${firstname[0]}${lastname[0]}`;
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-[#00ADE1] to-[#17428C] text-white rounded-full font-bold text-lg uppercase">
        {initials}
      </div>
      <div>
        <span className="block text-lg font-medium text-gray-800">
          {firstname} {lastname}
        </span>
        {email && <span className="text-sm text-gray-500">{email}</span>}
      </div>
    </div>
  );
}

export default UserAvatar;
