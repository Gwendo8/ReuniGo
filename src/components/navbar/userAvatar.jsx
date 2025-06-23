import { useContext } from "react";
import { ThemeContext } from "../others/themeContext";

function UserAvatar({ firstname, lastname, email }) {
  const { theme } = useContext(ThemeContext);
  const initials = `${firstname[0]}${lastname[0]}`;

  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 flex items-center justify-center text-white rounded-full font-bold text-lg uppercase ${
          theme === "dark"
            ? "bg-gradient-to-r from-cyan-500 to-blue-600"
            : "bg-gradient-to-r from-[#00ADE1] to-[#17428C]"
        }`}
      >
        {initials}
      </div>
      <div>
        <span
          className={`block text-lg font-medium ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          {firstname} {lastname}
        </span>
        {email && (
          <span
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {email}
          </span>
        )}
      </div>
    </div>
  );
}

export default UserAvatar;
