// app/routes/dashboard.services.$id.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@remix-run/react";

export default function ServiceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        duration: "", // Afegit el camp duration
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost/api/services/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("No s'han pogut carregar els detalls del servei.");
                }

                const data = await response.json();
                setFormData({
                    name: data.data.name,
                    description: data.data.description,
                    price: data.data.price,
                    duration: data.data.duration, // Afegim la durada al formulari
                });

            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchService();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost/api/services/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("No s'ha pogut actualitzar el servei.");
            }

            alert("Servei actualitzat correctament!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Segur que vols eliminar aquest servei?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost/api/services/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("No s'ha pogut eliminar el servei.");
            }

            alert("Servei eliminat correctament!");
            navigate("/dashboard/services");
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!formData.name) {
        return <p>Carregant detalls del servei...</p>;
    }

    return (
        <div className="text-black">
            <h1 className="text-2xl font-semibold mb-4">Editar Servei</h1>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-medium">
                        Nom del Servei
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-white"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block font-medium">
                        Descripció
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-white"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price" className="block font-medium">
                        Preu (€)
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-white"
                        required
                        min="0"
                        step="0.01" // Permet decimals
                    />
                </div>
                <div>
                    <label htmlFor="duration" className="block font-medium">
                        Durada (minuts)
                    </label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-white"
                        required
                        min="0"
                        step="0.01" // Permet decimals
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
                        {isSubmitting ? "Actualitzant..." : "Guardar Canvis"}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Eliminar Servei
                    </button>
                </div>
            </form>
        </div>
    );
}
