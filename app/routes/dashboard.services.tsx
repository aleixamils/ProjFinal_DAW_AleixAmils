import { Link, Outlet, useNavigate, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useUser } from "~/context/UserContext";

export default function ServicesLayout() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { user } = useUser(); // Extreu l'usuari del UserContext
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Validació de l'usuari i del rol
        if (!user || user.role_id !== 3) {
            navigate("/login"); // Redirigir si no està autenticat o no és admin
            return;
        }

        const page = Number(searchParams.get("page")) || 1;
        setCurrentPage(page);

        const fetchServices = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost/api/services?page=${page}&limit=8`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!response.ok) {
                    throw new Error("No s'han pogut carregar els serveis.");
                }

                const data = await response.json();
                setServices(data.data.data);
                setTotal(data.data.total);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchServices();
    }, [navigate, searchParams, user]);

    const totalPages = Math.ceil(total / 8);

    const handlePageChange = (newPage: number) => {
        navigate(`/dashboard/services?page=${newPage}`);
    };

    if (!user || user.role_id !== 3) {
        return null; // Esperem a la validació d'autenticació
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="flex">
            {/* Llista de serveis (esquerra) */}
            <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold text-black">Serveis</h1>
                    <Link
                        to="/dashboard/services/create"
                        className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        title="Afegir un nou servei"
                    >
                        +
                    </Link>
                </div>
                <ul className="space-y-2">
                    {services.map((service: any) => (
                        <li key={service.id} className="border p-2 rounded bg-white">
                            <Link
                                to={`/dashboard/services/${service.id}?page=${currentPage}`}
                                className="text-black hover:underline"
                            >
                                {service.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                {/* Paginació */}
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

            {/* Outlet (dreta) */}
            <div className="w-2/3 bg-white p-4 overflow-y-auto h-min self-center">
                <Outlet />
            </div>
        </div>
    );
}
