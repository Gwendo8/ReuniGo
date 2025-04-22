import Meetings from "../components/meeting/meeting";
import Navbar from "../components/navbar/navbar";

function Meeting() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4 font-sans">
      <Navbar />
      <h1 className="text-xl lg:text-2xl text-left ml-10 text-emerald-600 mb-10 mt-12 font-bold">
        Mon tableau de réunion
      </h1>
      <Meetings />
    </div>
  );
}

export default Meeting;
