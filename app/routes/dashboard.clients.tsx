import { Link, Outlet, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useUser } from "~/context/UserContext";

export default function ClientsLayout() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { user } = useUser();
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage] = useState(8);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchClients = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost/api/clients`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("No s'han pogut carregar els clients.");
                }

                const data = await response.json();
                setClients(data.data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchClients();
    }, [navigate, user]);

    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);
    const totalPages = Math.ceil(clients.length / clientsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const updateClientInState = (updatedClient: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setClients((prevClients) =>
            prevClients.map((client) =>
                client.id === updatedClient.id ? updatedClient : client
            )
        );
    };

    const removeClientFromState = (clientId: number) => {
        if (user.role_id === 2) return; // Treballadors no poden eliminar clients
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setClients((prevClients) => prevClients.filter((client) => client.id !== clientId));
    };

    const addClientToState = (newClient: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setClients((prevClients) => [...prevClients, newClient]);
    };

    if (!user) {
        return null;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="flex">
            <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold text-black">Clients</h1>
                    {/* Mostrar botó d'afegir només si el rol ho permet */}
                    {user.role_id === 2 || user.role_id === 3 && (
                        <Link
                            to="/dashboard/clients/create"
                            className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                            title="Afegir un nou client"
                        >
                            +
                        </Link>
                    )}
                </div>
                <ul className="space-y-2">
                    {currentClients.map((client: any) => (
                        <li key={client.id} className="border p-2 rounded bg-white">
                            <Link
                                to={`/dashboard/clients/${client.id}`}
                                className="text-black hover:underline"
                            >
                                {client.first_name} {client.last_name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between items-center mt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-4 py-2 bg-gray-500 rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-gray-700">
                        Pàgina {currentPage} de {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-4 py-2 bg-gray-500 rounded disabled:opacity-50"
                    >
                        Següent
                    </button>
                </div>
            </div>
            <div className="w-2/3 bg-white p-4 overflow-y-auto h-min self-center">
                <Outlet
                    context={{
                        updateClientInState,
                        addClientToState,
                        removeClientFromState,
                        user, // Passar el context de l'usuari
                    }}
                />
            </div>
        </div>
    );
}
