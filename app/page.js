export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Project Next.js Pertama!
        </h1>
        <p className="text-gray-600 mb-6">
          Ini mirip dengan sistem Blade di Laravel, tapi menggunakan JavaScript dan Tailwind CSS.
        </p>
        
        <button 
          onClick={() => alert('Berhasil!')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
        >
          Klik Saya
        </button>
      </div>
    </div>
  );
}