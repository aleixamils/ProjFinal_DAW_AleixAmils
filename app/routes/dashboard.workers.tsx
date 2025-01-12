import { Link, Outlet, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useUser } from "~/context/UserContext";

export default function WorkersLayout() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { user } = useUser();
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [workersPerPage] = useState(8);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user || user.role_id !== 3) {
            navigate("/login");
            return;
        }

        const fetchWorkers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost/api/workers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("No s'han pogut carregar els treballadors.");
                }

                const data = await response.json();
                setWorkers(data.data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchWorkers();
    }, [navigate, user]);

    const indexOfLastWorker = currentPage * workersPerPage;
    const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
    const currentWorkers = workers.slice(indexOfFirstWorker, indexOfLastWorker);
    const totalPages = Math.ceil(workers.length / workersPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const updateWorkerInState = (updatedWorker: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setWorkers((prevWorkers) =>
            prevWorkers.map((worker) =>
                worker.id === updatedWorker.id ? updatedWorker : worker
            )
        );
    };

    const removeWorkerFromState = (workerId: number) => {
        setWorkers((prevWorkers) => prevWorkers.filter((worker) => worker.id !== workerId));
    };

    const addWorkerToState = (newWorker: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setWorkers((prevWorkers) => [...prevWorkers, newWorker]);
    };

    if (!user || user.role_id !== 3) {
        return null;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="flex">
            <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold text-black">Treballadors</h1>
                    <Link
                        to="/dashboard/workers/create"
                        className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        title="Afegir un nou treballador"
                    >
                        +
                    </Link>
                </div>
                <ul className="space-y-2">
                    {currentWorkers.map((worker: any) => (
                        <li key={worker.id} className="border p-2 rounded bg-white">
                            <Link
                                to={`/dashboard/workers/${worker.id}`}
                                className="text-black hover:underline"
                            >
                                {worker.first_name} {worker.last_name}
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
                <Outlet context={{ updateWorkerInState, addWorkerToState, removeWorkerFromState }} />
            </div>
        </div>
    );
}
