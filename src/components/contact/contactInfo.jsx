import { useContext } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaUsers,
} from "react-icons/fa";
import { ThemeContext } from "../others/themeContext";

function ContactInfo() {
  const { theme } = useContext(ThemeContext);

  const contactItems = [
    {
      icon: (
        <FaUsers
          className={theme === "dark" ? "text-cyan-400" : "text-blue-500"}
        />
      ),
      title: "Support technique",
      content: "Pour toute question technique ou assistance",
      email: "support@entreprise.com",
      phone: "03 83 80 67 89",
    },
    {
      icon: (
        <FaEnvelope
          className={theme === "dark" ? "text-cyan-400" : "text-blue-500"}
        />
      ),
      title: "Contact général",
      content: "Pour les demandes générales",
      email: "privacycontact.sgpam.fr@saint-gobain.com",
      phone: "03 83 80 73 50",
    },
    {
      icon: (
        <FaClock
          className={theme === "dark" ? "text-cyan-400" : "text-blue-500"}
        />
      ),
      title: "Horaires d'assistance",
      content: "Lundi - Vendredi: 8h00 - 18h00",
    },
  ];

  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden ${
        theme === "dark"
          ? "bg-slate-800/95 border border-slate-700/50"
          : "bg-white"
      }`}
    >
      <div
        className={`p-5 text-white ${
          theme === "dark"
            ? "bg-gradient-to-r from-cyan-600 to-blue-600"
            : "bg-gradient-to-r from-blue-600 to-blue-400"
        }`}
      >
        <h2 className="text-xl font-bold">Informations de contact</h2>
        <p
          className={`text-sm mt-1 ${
            theme === "dark" ? "text-cyan-100" : "text-blue-100"
          }`}
        >
          Nos équipes sont à votre disposition
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full ${
                  theme === "dark" ? "bg-cyan-500/20" : "bg-blue-50"
                }`}
              >
                {item.icon}
              </div>
              <div>
                <h3
                  className={`font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {item.content}
                </p>

                {item.email && (
                  <div className="flex items-center mt-2 text-sm">
                    <FaEnvelope
                      className={`mr-2 ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <a
                      href={`mailto:${item.email}`}
                      className={`hover:underline ${
                        theme === "dark" ? "text-cyan-400" : "text-blue-600"
                      }`}
                    >
                      {item.email}
                    </a>
                  </div>
                )}

                {item.phone && (
                  <div className="flex items-center mt-1 text-sm">
                    <FaPhone
                      className={`mr-2 ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <a
                      href={`tel:${item.phone.replace(/\s/g, "")}`}
                      className={`hover:underline ${
                        theme === "dark" ? "text-cyan-400" : "text-blue-600"
                      }`}
                    >
                      {item.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-8 pt-6 ${
            theme === "dark"
              ? "border-t border-gray-600"
              : "border-t border-gray-100"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full ${
                theme === "dark" ? "bg-cyan-500/20" : "bg-blue-50"
              }`}
            >
              <FaMapMarkerAlt
                className={theme === "dark" ? "text-cyan-400" : "text-blue-500"}
              />
            </div>
            <div>
              <h3
                className={`font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Adresse
              </h3>
              <p
                className={`text-sm mt-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                21 Avenue Camille Cavalier
                <br />
                54700 Pont-A-Mousson, France
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center text-sm hover:underline mt-2 ${
                  theme === "dark" ? "text-cyan-400" : "text-blue-600"
                }`}
              >
                Voir sur la carte →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
