import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaUsers,
} from "react-icons/fa";

function ContactInfo() {
  const contactItems = [
    {
      icon: <FaUsers className="text-blue-500" />,
      title: "Support technique",
      content: "Pour toute question technique ou assistance",
      email: "support@entreprise.com",
      phone: "03 83 80 67 89",
    },
    {
      icon: <FaEnvelope className="text-blue-500" />,
      title: "Contact général",
      content: "Pour les demandes générales",
      email: "privacycontact.sgpam.fr@saint-gobain.com",
      phone: "03 83 80 73 50",
    },
    {
      icon: <FaClock className="text-blue-500" />,
      title: "Horaires d'assistance",
      content: "Lundi - Vendredi: 8h00 - 18h00",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-5 text-white">
        <h2 className="text-xl font-bold">Informations de contact</h2>
        <p className="text-blue-100 text-sm mt-1">
          Nos équipes sont à votre disposition
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full">{item.icon}</div>
              <div>
                <h3 className="font-medium text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.content}</p>

                {item.email && (
                  <div className="flex items-center mt-2 text-sm">
                    <FaEnvelope className="text-gray-400 mr-2" />
                    <a
                      href={`mailto:${item.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.email}
                    </a>
                  </div>
                )}

                {item.phone && (
                  <div className="flex items-center mt-1 text-sm">
                    <FaPhone className="text-gray-400 mr-2" />
                    <a
                      href={`tel:${item.phone.replace(/\s/g, "")}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-full">
              <FaMapMarkerAlt className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Adresse</h3>
              <p className="text-gray-600 text-sm mt-1">
                21 Avenue Camille Cavalier
                <br />
                54700 Pont-A-Mousson, France
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:underline mt-2"
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
