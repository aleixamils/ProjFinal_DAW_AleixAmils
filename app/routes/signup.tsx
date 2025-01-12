import type { MetaFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        { title: "Registra't - Perruqueria" },
        { name: "description", content: "Crea un compte com a treballador." },
    ];
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const first_name = formData.get("first_name");
    const last_name = formData.get("last_name");
    const username = formData.get("username");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");

    // Validem els camps obligatoris
    if (!first_name || !last_name || !password) {
        return json({ error: "Els camps Nom, Cognoms i Contrasenya són obligatoris." }, { status: 400 });
    }

    try {
        // Crida a l'API per registrar un nou treballador
        const response = await fetch("http://localhost/api/workers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ first_name, last_name, username, email, phone, password, role_id: 2 }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            return json({ error: errorResponse.message || "No s'ha pogut completar el registre." }, { status: 400 });
        }

        return redirect("/login");
    } catch (error: any) {
        return json({ error: "S'ha produït un error en el registre." }, { status: 500 });
    }
};

export default function Signup() {
    const actionData = useActionData();

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-50">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-700 text-center">
                    Registra&#39;t com a Treballador
                </h1>
                <p className="text-sm text-gray-500 text-center mt-2">
                    Crea un compte per començar a gestionar clients i cites.
                </p>
                <Form method="post" className="mt-6 flex flex-col gap-4">
                    {/* Mostrem errors si n'hi ha */}
                    {actionData?.error && (
                        <p className="text-red-500 text-sm">{actionData.error}</p>
                    )}
                    <input
                        type="text"
                        name="first_name"
                        placeholder="Nom"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Cognoms"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Nom d'Usuari "
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Correu Electrònic "
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Telèfon (opcional)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contrasenya"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-pink-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-pink-600 focus:ring-4 focus:ring-pink-300"
                    >
                        Registra&#39;t
                    </button>
                </Form>
                <p className="text-sm text-center text-gray-500 mt-4">
                    Ja tens un compte?{" "}
                    <a href="/login" className="text-pink-500 hover:underline">
                        Inicia Sessió
                    </a>
                </p>
            </div>
        </div>
    );
}
