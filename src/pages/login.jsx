/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import LoginFetch from "../hook/loginFetch";
import Input from "../components/inputs/input";

function Login() {
  const { sgid, password, error, setSgid, setPassword, handleLogin } =
    LoginFetch();

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
            Welcome Back !
          </h1>
          <p className="md:text-lg lg:text-xl font-light text-gray-700">
            Nous sommes ravis de vous revoir parmi nous. Connectez-vous pour
            reprendre vos activités et accéder à vos fonctionnalités.
          </p>
          <p className="md:text-sm lg:text-md text-gray-600">
            Si vous avez oublié votre mot de passe, cliquez sur "Mot de passe
            oublié".
          </p>
        </motion.div>
      </div>

      {/* Partie mobile uniquement (image + welcome back) */}
      <div className="md:hidden flex flex-col items-center mt-10">
        <img
          src="/img/heureux.png"
          alt="Developer Cartoon"
          className="w-64 mb-4"
        />
        <h1 className="text-4xl font-extrabold text-blue-900">
          Welcome Back !
        </h1>
      </div>

      {/* Formulaire de connexion */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 md:mt-20 lg:mt-20">
        {/* Titre affiché uniquement à partir de la taille md */}
        <h1 className="hidden md:block md:text-2xl lg:text-3xl font-semi-bold uppercase text-blue-900 mb-10">
          Connectez-vous
        </h1>

        <Input
          label="SGID"
          placeholder="Entrez votre SGID..."
          value={sgid}
          onChange={setSgid}
        />
        <Input
          label="Mot de passe"
          placeholder="Entrez votre mot de passe..."
          value={password}
          onChange={setPassword}
        />

        {/* lien mot de passe oublié */}
        <a
          href="/mdp-oublie"
          className="font-serif text-blue-900 hover:text-blue-800 text-sm mt-2"
        >
          Mot de passe oublié ?
        </a>

        {error && (
          <div className="text-red-500 text-center mt-3 text-sm">{error}</div>
        )}

        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white md:text-lg lg:text-xl px-28 md:px-28 lg:px-34 py-2 border rounded-xl cursor-pointer mt-5"
        >
          Connexion
        </button>

        {/* Inscription */}
        <div className="mt-8 w-full">
          <div className="border-t pt-6 text-center">
            <p className="text-sm text-gray-600 ">
              Vous n'avez pas encore de compte ?
            </p>
            <a
              href="/register"
              className="inline-block mt-2 px-6 py-2 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded-full transition duration-300"
            >
              Inscrivez-vous
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
