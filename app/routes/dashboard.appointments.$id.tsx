// app/routes/dashboard/appointments.$id.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import { useUser } from "~/context/UserContext";
import AppointmentForm from "~/components/AppointmentForm";

export default function AppointmentDetails() {
    // @ts-ignore
    const { user } = useUser();
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchAppointment = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(
                    `http://localhost/api/reservations/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!response.ok) {
                    throw new Error("No s'han pogut carregar els detalls de la cita.");
                }

                const data = await response.json();
                console.log("Appointment id")
                console.log(data);
                setAppointment(data.data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchAppointment();
    }, [user, id]);

    const handleInputChange = (field: string, value: string) => {

        setAppointment((prev) => ({
            // @ts-ignore
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        setIsSaving(true);

        const formattedAppointment = {
            // @ts-ignore
            ...appointment,
            // @ts-ignore
            reservation_date: new Date(appointment.reservation_date).toISOString().slice(0, 19).replace('T', ' '),
            // @ts-ignore
            client_name: appointment.client_id ? null : appointment.client_name,
            // @ts-ignore
            client_phone: appointment.client_id ? null : appointment.client_phone,
            // @ts-ignore
            services: appointment.services || [],
        };

        console.log("URL:", `http://localhost:8000/api/reservations`);
        console.log("Request body:", JSON.stringify(formattedAppointment, null, 2));
        console.log("Token:", token);

        try {

            const response = await fetch(
                // @ts-ignore
                `http://localhost:8000/api/reservations/${appointment.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formattedAppointment),
                }
            );

            const responseText = await response.text();
            console.log("API Response Text:", responseText);

            if (!response.ok) {
                throw new Error("No s'han pogut guardar els canvis.");
            }

            navigate("/dashboard");
        } catch (err: any) {
            console.error("Error while saving:", err);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };



    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(
                `http://localhost/api/reservations/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!response.ok) {
                throw new Error("No s'ha pogut eliminar la cita.");
            }

            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!appointment) {
        return <p className="text-center mt-6">Carregant detalls de la cita...</p>;
    }

    // @ts-ignore
    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-10 text-gray-800">
            <h1 className="text-2xl font-semibold text-gray-700 mb-4">
                Edita Detalls de la Cita
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <AppointmentForm
                appointment={appointment}
                // @ts-ignore
                onChange={handleInputChange}
                onSave={handleSave}
                onDelete={handleDelete}
                onBack={() => navigate("/dashboard")}
                isSaving={isSaving}
                mode="edit"
            />
        </div>
    );
}
