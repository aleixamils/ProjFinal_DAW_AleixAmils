// app/routes/dashboard/appointments.create.tsx
import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { useUser } from "~/context/UserContext";
import AppointmentForm from "~/components/AppointmentForm";

export default function CreateAppointment() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { user } = useUser();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState({
        client_id: "",
        client_name: "",
        client_phone: "",
        worker_id: "",
        reservation_date: "",
        notes: "",
        work_area: "",
        status: "Pendent",
        services: []
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (field: string, value: string) => {
        setAppointment((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        // Validació bàsica
        if (!appointment.worker_id || !appointment.reservation_date || appointment.services.length === 0 || (!appointment.client_id && !appointment.client_name)) {
            setError("Omple tots els camps obligatoris.");
            return;
        }

        const token = localStorage.getItem("token");
        setIsSaving(true);

        try {
            const response = await fetch("http://localhost/api/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(appointment),
            });

            console.log(response);
            if (!response.ok) {
                throw new Error("No s'ha pogut crear la cita.");
            }

            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-10 text-gray-800">
            <h1 className="text-2xl font-semibold text-gray-700 mb-4">
                Crear Nova Cita
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <AppointmentForm
                appointment={appointment}
                onChange={handleInputChange}
                onSave={handleSave}
                onBack={() => navigate("/dashboard")}
                isSaving={isSaving}
                mode="create"
            />
        </div>
    );
}
