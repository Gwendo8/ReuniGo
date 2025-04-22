function BoutonInsc({ value, children, ...props }) {
  return (
    <button
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center"
      {...props}
    >
      {children}
      <span>{value}</span>
    </button>
  );
}

export default BoutonInsc;
