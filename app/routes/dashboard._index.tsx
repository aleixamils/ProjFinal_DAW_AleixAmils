// app/routes/dashboard/agenda.tsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import caLocale from "@fullcalendar/core/locales/ca";
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import {useUser} from "~/context/UserContext";

export default function Agenda() {

    // @ts-ignore
    const { user } = useUser();
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchEvents = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost/api/reservations/worker/${user.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.ok) {
                const data = await response.json();
                
                setEvents(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    data.data.map((appointment) => ({
                        id: appointment.id,
                        client: appointment.client_registered ?? appointment.client_name,
                        worker: appointment.worker,
                        title: appointment.client_registered
                            ? `${appointment.client_registered.first_name} ${appointment.client_registered.last_name} - ${appointment.worker.first_name} ${appointment.worker.last_name}`
            : `${appointment.client_name} - ${appointment.worker.first_name} ${appointment.worker.last_name}`,
                start: appointment.reservation_date,
                    extendedProps: {
                    status: appointment.status,
                },
                    }))
                );
            }
        };

        fetchEvents();
    }, [user]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md text-black">
            <h2 className="text-lg font-semibold text-gray-700">
                Cites programades
            </h2>
            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                    interactionPlugin,
                ]}
                locale={caLocale}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'createReservation dayGridMonth,timeGridWeek,timeGridDay'
                }}
                buttonText={{
                    today: 'Avui',
                    month: 'Mes',
                    week: 'Setmana',
                    day: 'Dia',
                    next: 'Següent',
                    prev: 'Anterior',
                    nextYear: 'Any següent',
                    prevYear: 'Any anterior'
                }}
                titleFormat={{
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }}
                views={{
                    timeGridWeek: {
                        type: 'timeGridWeek',
                        slotMinTime: '06:00',
                        slotMaxTime: '22:00',
                    },
                    timeGridDay: {
                        type: 'timeGridDay',
                        slotMinTime: '06:00',
                        slotMaxTime: '22:00'
                    }
                }}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: '08:00',
                    endTime: '18:00',
                }}
                height="78vh"
                nowIndicator={true}
                events={events} // Assigna els esdeveniments carregats
                editable={true}
                eventDurationEditable={false}
                customButtons={{
                    createReservation: {
                        text: "+",
                        hint: "Crear una nova reserva",
                        click: function () {
                            navigate("/dashboard/appointments/create")
                        }
                    }
                }}
                eventClick={(info) => {
                    navigate(`/dashboard/appointments/${info.event.id}`);
                }}
                eventDrop={(info) => {

                    const updatedEvent = {
                        // @ts-ignore
                        start: info.event.start.toISOString(),
                    };
                    console.log(updatedEvent),
                    fetch(`http://localhost/api/reservations/${info.event.id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },

                        body: JSON.stringify(updatedEvent),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (!data.success) {
                                alert(
                                    "No s'ha pogut actualitzar l'esdeveniment."
                                );
                                window.location.reload();
                            }
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                        });
                }}
            />
        </div>
    );
}
