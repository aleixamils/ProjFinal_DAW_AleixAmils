// app/routes/dashboard.services.create.tsx
import { useState } from "react";
import { useNavigate } from "@remix-run/react";

export default function CreateService() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        duration: "", // Afegit el camp duration
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            console.log(formData);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost/api/services", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            console.log(response);
            if (!response.ok) {
                throw new Error("No s'ha pogut crear el servei. Si us plau, torna-ho a intentar.");
            }

            alert("Servei creat correctament!");
            navigate("/dashboard/services");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-black">
            <h1 className="text-2xl font-semibold mb-4">Crear Nou Servei</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                        step="0.01"
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
                        {isSubmitting ? "Creant..." : "Crear Servei"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/services")}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel·lar
                    </button>
                </div>
            </form>
        </div>
    );
}
