import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "@remix-run/react";

export default function WorkerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        role_id: 2, // Per defecte role_id és 2 (Treballador)
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updateWorkerInState, removeWorkerFromState } = useOutletContext<{
        updateWorkerInState: (worker: any) => void;
        removeWorkerFromState: (workerId: number) => void;
    }>();

    useEffect(() => {
        const fetchWorker = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost/api/workers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("No s'han pogut carregar els detalls del treballador.");
                }

                const data = await response.json();
                setFormData(data.data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchWorker();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            const response = await fetch(`http://localhost/api/workers/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("No s'ha pogut actualitzar el treballador.");
            }

            const updatedWorker = await response.json();
            updateWorkerInState(updatedWorker.data);

            alert("Treballador actualitzat correctament!");
            navigate("/dashboard/workers");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Segur que vols eliminar aquest treballador?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost/api/workers/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("No s'ha pogut eliminar el treballador.");
            }

            removeWorkerFromState(Number(id));

            alert("Treballador eliminat correctament!");
            navigate("/dashboard/workers");
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="text-black">
            <h1 className="text-2xl font-semibold mb-4">Editar Treballador</h1>
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
                    />
                </div>
                <div>
                    <label htmlFor="role_id" className="block font-medium">
                        Rol
                    </label>
                    <select
                        id="role_id"
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-white"
                    >
                        <option value={2}>Treballador</option>
                        <option value={3}>Administrador</option>
                    </select>
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
                        Eliminar Treballador
                    </button>
                </div>
            </form>
        </div>
    );
}
