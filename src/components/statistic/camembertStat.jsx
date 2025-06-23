import { useContext } from "react";
import { ThemeContext } from "../others/themeContext";

const CamembertStat = ({ data, total }) => {
  const { theme } = useContext(ThemeContext);

  if (total === 0) {
    return (
      <div
        className={`h-48 w-48 mx-auto flex items-center justify-center ${
          theme === "dark" ? "text-gray-500" : "text-gray-400"
        }`}
      >
        Aucune donnée
      </div>
    );
  }
  // La je vérifie si tous les utilisateurs sont présents
  const onlyPresent = data
    .filter((item) => item.label !== "Présents")
    .every((item) => item.value === 0);

  if (onlyPresent) {
    // Si il y'a 100% de présence, je dessine un camembert avec un seul segment
    return (
      <div className="relative h-48 w-48 mx-auto">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="40" fill="#3cba92" />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill={theme === "dark" ? "#1e293b" : "white"}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-cyan-400" : "text-[#2a6b5d]"
              }`}
            >
              {total}
            </p>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Total
            </p>
          </div>
        </div>
      </div>
    );
  }
  let cumulativePercentage = 0;
  return (
    <div className="relative h-48 w-48 mx-auto">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {data.map((item, index) => {
          // Sinon je dessine un cambert avec plusieurs segments mais je vérifie si la valeur est supérieur à 0
          if (item.value === 0) return null;

          const percentage = (item.value / total) * 100;
          const startAngle = (cumulativePercentage / 100) * 360;
          const endAngle = ((cumulativePercentage + percentage) / 100) * 360;

          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

          const largeArcFlag = percentage > 50 ? 1 : 0;

          const pathData = `
            M 50 50
            L ${x1} ${y1}
            A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
            Z
          `;

          cumulativePercentage += percentage;
          return <path key={index} d={pathData} fill={item.color} />;
        })}
        <circle
          cx="50"
          cy="50"
          r="25"
          fill={theme === "dark" ? "#1e293b" : "white"}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-cyan-400" : "text-[#2a6b5d]"
            }`}
          >
            {total}
          </p>
          <p
            className={`text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Total
          </p>
        </div>
      </div>
    </div>
  );
};

export default CamembertStat;
