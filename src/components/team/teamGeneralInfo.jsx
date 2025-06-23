import { useContext } from "react";
import InputShowTeam from "../inputs/inputShowTeam";
import ColorPicker from "./colorPicker";
import { ThemeContext } from "../others/themeContext";

function TeamGeneralInfo({
  team,
  localTeamName,
  setLocalTeamName,
  localColors,
  setLocalColors,
  colorPalette,
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <div>
      <h3
        className={`text-lg font-semibold mb-2 ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Informations générales
      </h3>
      <div
        className={`p-4 rounded-lg space-y-3 border ${
          theme === "dark"
            ? "bg-slate-700 text-gray-200 border-slate-600"
            : "bg-gray-50 text-gray-700 border-gray-100"
        }`}
      >
        <InputShowTeam
          value={localTeamName}
          label="Nom :"
          placeholder="Nom de l'équipe"
          onChange={setLocalTeamName}
        />
        <ColorPicker
          value={localColors}
          onChange={setLocalColors}
          colorPalette={colorPalette}
        />
        <InputShowTeam
          value={team.leadername || "Aucun leader"}
          label="Leader :"
          placeholder="Nom du leader"
        />
      </div>
    </div>
  );
}

export default TeamGeneralInfo;
