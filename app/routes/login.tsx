import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const meta: MetaFunction = () => {
    return [
        { title: "Inicia Sessió - Perruqueria" },
        { name: "description", content: "Accedeix al teu compte de perruqueria." },
    ];
};

export default function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard"); // Si ja està loguejat, redirigeix al dashboard
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            if (!response.ok) {
                throw new Error("Credencials incorrectes");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token); // Guarda el token al localStorage
            navigate("/dashboard"); // Redirigeix a una ruta protegida
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-50">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
                <img
                    src="/ic_pelu.png"
                    alt="Logo Perruqueria"
                    className="w-32 h-32 mx-auto mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-700 text-center">
                    Inicia Sessió
                </h1>
                <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <input
                        type="email"
                        placeholder="Correu electrònic"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <input
                        type="password"
                        placeholder="Contrasenya"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-pink-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-pink-600 focus:ring-4 focus:ring-pink-300"
                    >
                        Inicia Sessió
                    </button>
                </form>
                <p className="text-sm text-center text-gray-500 mt-4">
                    No tens compte?{' '}
                    <a href="/signup" className="text-pink-500 hover:underline">
                        Registre't
                    </a>
                </p>
            </div>
        </div>
    );
}
