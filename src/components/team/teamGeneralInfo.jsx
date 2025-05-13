import InputShowTeam from "../inputs/inputShowTeam";
import ColorPicker from "./colorPicker";

function TeamGeneralInfo({
  team,
  localTeamName,
  setLocalTeamName,
  localColors,
  setLocalColors,
  colorPalette,
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Informations générales
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-gray-700 border border-gray-100">
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
