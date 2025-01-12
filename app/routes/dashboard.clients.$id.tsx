import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "@remix-run/react";
import { useUser } from "~/context/UserContext";

export default function ClientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useUser(); // Afegim el context de l'usuari
    const { updateClientInState, removeClientFromState } = useOutletContext<{
        updateClientInState: (client: any) => void;
        removeClientFromState: (clientId: number) => void;
    }>();

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost/api/clients/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("No s'han pogut carregar els detalls del client.");
                }

                const data = await response.json();
                setFormData(data.data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchClient();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.first_name || !formData.last_name) {
            setError("El nom i cognoms no poden quedar buits.");
            setIsSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost/api/clients/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("No s'ha pogut actualitzar el client.");
            }

            const updatedClient = await response.json();
            updateClientInState(updatedClient.data);
            alert("Client actualitzat correctament!");
            navigate("/dashboard/clients");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Segur que vols eliminar aquest client?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost/api/clients/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("No s'ha pogut eliminar el client.");
            }

            removeClientFromState(Number(id));
            alert("Client eliminat correctament!");
            navigate("/dashboard/clients");
        } catch (err: any) {
            setError(err.message);
        }
    };


    const isReadonly = Number(user?.role_id) === 2; // Condició millorada

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="text-black">
            <h1 className="text-2xl font-semibold mb-4">Detalls del Client</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label htmlFor="first_name" className="block font-medium">
                        Nom
                    </label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-white"
                        readOnly={isReadonly} // Camps només de lectura per rol 2
                        disabled={isReadonly} // Bloqueja completament l'input
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
                        value={formData.last_name || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-white"
                        readOnly={isReadonly}
                        disabled={isReadonly}
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
                        value={formData.email || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-white"
                        readOnly={isReadonly}
                        disabled={isReadonly}
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
                        value={formData.phone || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-white"
                        readOnly={isReadonly}
                        disabled={isReadonly}
                    />
                </div>
                {!isReadonly && (
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
                            {isSubmitting ? "Actualitzant..." : "Guardar Canvis"}
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Eliminar Client
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
