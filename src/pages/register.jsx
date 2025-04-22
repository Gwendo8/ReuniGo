import Input from "../components/inputs/input";
import RegisterFetch from "../hook/registerFetch";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

function Register() {
  const {
    firstname,
    setFirstname,
    lastname,
    setLastname,
    sgid,
    setSgid,
    mail,
    setMail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    handleRegister,
  } = RegisterFetch();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Partie gauche (affiché uniquement à partir de la taille md) */}
      <div className="hidden md:flex w-1/2 flex-col items-center bg-blue-200 text-gray-800 p-10 relative">
        {/* Image */}
        <img
          src="/img/heureux.png"
          alt="Developer Cartoon"
          className="md:w-64 lg:w-80 md:mt-40 lg:mt-32"
        />
        {/* Texte animé */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center space-y-6 z-10"
        >
          <h1 className="md:text-3xl lg:text-5xl font-extrabold text-blue-900">
            Welcome !
          </h1>
          <p className="md:text-lg lg:text-xl font-light text-gray-700">
            Rejoignez-nous dès aujourd’hui ! Créez votre compte pour accéder à
            toutes nos fonctionnalités et commencer votre expérience avec nous.
          </p>
          {/* Inscription */}
          <div className="mt-7 w-full">
            <div className="border-t pt-6 text-center">
              <p className="text-sm text-gray-600 ">
                Vous avez déjà un compte ?
              </p>
              <a
                href="/login"
                className="inline-block mt-2 px-6 py-2 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded-full transition duration-300"
              >
                Connectez-vous
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Partie mobile uniquement (image + welcome back) */}
      <div className="md:hidden flex flex-col items-center mt-10">
        <img
          src="/img/heureux.png"
          alt="Developer Cartoon"
          className="w-64 mb-4"
        />
        <h1 className="text-4xl font-extrabold text-blue-900">Welcome !</h1>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:mt-20 lg:mt-20">
        <h1 className="hidden md:block md:text-2xl lg:text-3xl font-semi-bold uppercase text-blue-900 mb-5">
          Inscrivez-vous
        </h1>
        <Input
          placeholder="Entrez votre nom..."
          label="Nom"
          value={lastname}
          onChange={setLastname}
        />
        <Input
          placeholder="Entrez votre prénom..."
          label="Prénom"
          value={firstname}
          onChange={setFirstname}
        />
        <Input
          placeholder="Entrez votre sgid..."
          label="SGID"
          value={sgid}
          onChange={setSgid}
        />
        <Input
          placeholder="Entrez votre email..."
          label="Email"
          value={mail}
          onChange={setMail}
        />
        <Input
          placeholder="Entrez votre mot de passe..."
          label="Mot de passe"
          value={password}
          onChange={setPassword}
        />
        <Input
          placeholder="Confirmer votre mot de passe..."
          label="Mot de passe"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        {error && (
          <div className="text-red-500 text-center mt-3 text-sm">{error}</div>
        )}
        <button
          onClick={handleRegister}
          className="bg-blue-600 hover:bg-blue-700 text-white md:text-lg lg:text-xl px-28 md:px-28 lg:px-34 py-2 border rounded-xl cursor-pointer"
        >
          Inscription
        </button>
        {/* Affichage du champ de connexion en dessous du bouton seulement en dessous de la taille md */}
        <div className="block md:hidden mt-6 text-center">
          <div className="border-t pt-6 text-center">
            <p className="text-sm text-gray-600">Vous avez déjà un compte ?</p>
            <a
              href="/login"
              className="inline-block mt-2 px-6 py-2 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded-full transition duration-300"
            >
              Connectez-vous
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
