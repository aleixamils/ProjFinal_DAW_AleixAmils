import { useState } from "react";
import { useNavigate, useOutletContext } from "@remix-run/react";

export default function CreateClient() {
    const navigate = useNavigate();
    const { addClientToState } = useOutletContext<{
        addClientToState: (client: any) => void;
    }>();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost/api/clients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("No s'ha pogut crear el client.");
            }

            const newClient = await response.json();
            addClientToState(newClient.data); // Afegim el nou client a l'estat global

            alert("Client creat correctament!");
            navigate("/dashboard/clients");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-black">
            <h1 className="text-2xl font-semibold mb-4">Crear Nou Client</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="first_name" className="block font-medium">
                        Nom
                    </label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-black"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="last_name" className="block font-medium">
                        Cognoms
                    </label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-black"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block font-medium">
                        Correu Electrònic
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-black"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block font-medium">
                        Telèfon
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-black"
                    />
                </div>
                <div className="flex gap-4 mt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded ${
                            isSubmitting
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                    >
                        {isSubmitting ? "Creant..." : "Crear Client"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/clients")}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel·lar
                    </button>
                </div>
            </form>
        </div>
    );
}
