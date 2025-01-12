import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Perruqueria - Eina Interna" },
    { name: "description", content: "Accedeix a l'eina interna de gestió." },
  ];
};

export default function Index() {
  return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-50">
        <div className="flex flex-col items-center gap-8 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
          <header className="text-center">
            <img
                src="/ic_pelu.png"
                alt="Logo Perruqueria"
                className="w-32 h-32 mx-auto mb-4"
            />
            <h1 className="text-3xl font-extrabold text-gray-700">
              Benvingut a l&#39;Eina Interna
            </h1>
            <p className="text-gray-500 mt-2">
              Gestiona clients, cites i més des d&#39;aquí.
            </p>
          </header>
          <div className="flex w-full max-w-sm flex-col gap-6">
            <button
                className="w-full py-3 bg-pink-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-pink-600 focus:ring-4 focus:ring-pink-300"
                onClick={() => (window.location.href = "/login")}
            >
              Inicia Sessió
            </button>
            <button
                className="w-full py-3 bg-transparent text-pink-500 border border-pink-500 text-lg font-semibold rounded-lg hover:bg-pink-100 focus:ring-4 focus:ring-pink-300"
                onClick={() => (window.location.href = "/signup")}
            >
              Registra&#39;t
            </button>
          </div>
        </div>
      </div>
  );
}