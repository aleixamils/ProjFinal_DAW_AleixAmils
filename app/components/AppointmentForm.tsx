import React, { useState, useEffect } from "react";

export default function AppointmentForm({
                                            appointment,
                                            onChange,
                                            onSave,
                                            onDelete,
                                            onBack,
                                            isSaving,
                                            mode,
                                        }: {
    appointment: any;
    onChange: (field: string, value: any) => void;
    onSave: () => void;
    onDelete?: () => void;
    onBack: () => void;
    isSaving: boolean;
    mode: "edit" | "create";
}) {
    const [services, setServices] = useState([]);
    const [clients, setClients] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [searchClientTerm, setSearchClientTerm] = useState("");
    const [searchWorkerTerm, setSearchWorkerTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [combinedClients, setCombinedClients] = useState([]); // Llista combinada de clients i treballadors

    useEffect(() => {
        // Carrega serveis, clients i treballadors
        const fetchServices = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost/api/services?page=${currentPage}&limit=5`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.ok) {
                const data = await response.json();
                setServices(data.data.data || []);
                setTotalPages(data.data.last_page || 1);
            }
        };

        const fetchClients = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost/api/clients", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                const clientsData = data.data.map((c: any) => ({
                    id: c.id,
                    name: `${c.first_name} ${c.last_name}`,
                }));
                setClients(clientsData);
            }
        };

        const fetchWorkers = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost/api/workers", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                const workersData = data.data.map((w: any) => ({
                    id: w.id,
                    name: `${w.first_name} ${w.last_name}`,
                }));
                setWorkers(workersData);
            }
        };

        fetchServices();
        fetchClients();
        fetchWorkers();
    }, [currentPage]);

    // Combina clients i treballadors
    useEffect(() => {
        const combined = [...clients, ...workers];
        setCombinedClients(combined);
    }, [clients, workers]);

    // Inicialitza el terme de cerca del client
    useEffect(() => {
        if (appointment.client_id && combinedClients.length > 0) {
            const matchedClient = combinedClients.find(
                (client) => client.id === appointment.client_id
            );
            if (matchedClient) {
                setSearchClientTerm(matchedClient.name);
            }
        }
    }, [appointment.client_id, combinedClients]);

    // Inicialitza el terme de cerca del treballador
    useEffect(() => {
        if (appointment.worker_id && workers.length > 0) {
            const matchedWorker = workers.find((worker) => worker.id === appointment.worker_id);
            if (matchedWorker) {
                setSearchWorkerTerm(matchedWorker.name);
            }
        }
    }, [appointment.worker_id, workers]);

    const handleClientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchClientTerm(term);

        const matchedClient = combinedClients.find(
            (client) => client.name.toLowerCase() === term.toLowerCase()
        );

        if (matchedClient) {
            onChange("client_id", matchedClient.id);
        } else {
            onChange("client_id", "");
        }
    };

    const handleWorkerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchWorkerTerm(term);

        const matchedWorker = workers.find(
            (worker) => worker.name.toLowerCase() === term.toLowerCase()
        );

        if (matchedWorker) {
            onChange("worker_id", matchedWorker.id);
        } else {
            onChange("worker_id", null);
        }
    };

    const handleServiceChange = (serviceId: number) => {
        const selectedServices = appointment.services || [];
        if (selectedServices.includes(serviceId)) {
            onChange(
                "services",
                selectedServices.filter((id: number) => id !== serviceId)
            );
        } else {
            onChange("services", [...selectedServices, serviceId]);
        }
    };

    const reservationDateValue =
        appointment.reservation_date &&
        !isNaN(new Date(appointment.reservation_date).getTime())
            ? new Date(appointment.reservation_date).toISOString().slice(0, 16)
            : "";

    return (
        <form className="space-y-4">
            {/* Cerca Client */}
            <div>
                <label htmlFor="clientSearch" className="block text-gray-700">
                    Cerca Client
                </label>
                <input
                    type="text"
                    id="clientSearch"
                    value={searchClientTerm}
                    onChange={handleClientSearch}
                    placeholder="Escriu el nom del client..."
                    className="w-full p-2 border rounded-md text-white"
                    list="clients"
                />
                <datalist id="clients">
                    {combinedClients.map((client: any) => (
                        <option key={client.id} value={client.name} />
                    ))}
                </datalist>
            </div>

            {/* Nom i Telèfon del Client */}
            {mode === "create" && (
                <>
                    <div>
                        <label htmlFor="clientName" className="block text-gray-700">
                            Nom del Client
                        </label>
                        <input
                            type="text"
                            id="clientName"
                            value={appointment.client_name || ""}
                            onChange={(e) => onChange("client_name", e.target.value)}
                            placeholder="Nom del client"
                            className="w-full p-2 border rounded-md text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="clientPhone" className="block text-gray-700">
                            Telèfon del Client
                        </label>
                        <input
                            type="tel"
                            id="clientPhone"
                            value={appointment.client_phone || ""}
                            onChange={(e) => onChange("client_phone", e.target.value)}
                            placeholder="Telèfon del client"
                            className="w-full p-2 border rounded-md text-white"
                        />
                    </div>
                </>
            )}

            {/* Treballador */}
            <div>
                <label htmlFor="workerSearch" className="block text-gray-700">
                    Cerca Treballador
                </label>
                <input
                    type="text"
                    id="workerSearch"
                    value={searchWorkerTerm}
                    onChange={handleWorkerSearch}
                    placeholder="Escriu el nom del treballador..."
                    className="w-full p-2 border rounded-md text-white"
                    list="workers"
                />
                <datalist id="workers">
                    {workers.map((worker: any) => (
                        <option key={worker.id} value={worker.name} />
                    ))}
                </datalist>
            </div>

            {/* Data i Hora */}
            <div>
                <label htmlFor="reservationDate" className="block text-gray-700">
                    Data i Hora
                </label>
                <input
                    type="datetime-local"
                    id="reservationDate"
                    value={reservationDateValue}
                    onChange={(e) => onChange("reservation_date", e.target.value)}
                    className="w-full p-2 border rounded-md text-white"
                />
            </div>

            {/* Selecció de Serveis amb Paginació */}
            <div>
                <label className="block text-gray-700">Serveis</label>
                <div className="space-y-2">
                    {services.map((service: any) => (
                        <div key={service.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`service-${service.id}`}
                                checked={appointment.services?.includes(service.id)}
                                onChange={() => handleServiceChange(service.id)}
                                className="mr-2"
                            />
                            <label htmlFor={`service-${service.id}`}>{service.name}</label>
                        </div>
                    ))}
                </div>
                {/* Botons de Paginació */}
                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-gray-700">
                        Pàgina {currentPage} de {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                    >
                        Següent
                    </button>
                </div>
            </div>

            {/* Estat */}
            <div>
                <label htmlFor="status" className="block text-gray-700">
                    Estat
                </label>
                <select
                    id="status"
                    value={appointment.status || ""}
                    onChange={(e) => onChange("status", e.target.value)}
                    className="w-full p-2 border rounded-md text-white"
                >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Notes */}
            <div>
                <label htmlFor="notes" className="block text-gray-700">
                    Notes
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    value={appointment.notes || ""}
                    onChange={(e) => onChange("notes", e.target.value)}
                    placeholder="Afegeix notes aquí"
                    className="w-full p-2 border rounded-md text-white"
                />
            </div>

            {/* Botons */}
            <div className="flex gap-4 mt-6">
                <button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving}
                    className={`py-2 px-4 rounded-md ${
                        isSaving
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                >
                    {isSaving ? "Guardant..." : mode === "edit" ? "Guardar Canvis" : "Crear Cita"}
                </button>
                {mode === "edit" && onDelete && (
                    <button
                        type="button"
                        onClick={onDelete}
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    >
                        Eliminar
                    </button>
                )}
                <button
                    type="button"
                    onClick={onBack}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                    Tornar
                </button>
            </div>
        </form>
    );
}
