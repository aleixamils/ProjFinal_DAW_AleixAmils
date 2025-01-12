// app/routes/dashboard.tsx
import { Outlet, NavLink, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { UserProvider, useUser } from "~/context/UserContext";

function DashboardContent() {
    const navigate = useNavigate();
    // @ts-ignore
    const { user, setUser } = useUser();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            const response = await fetch("http://localhost/api/user", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate, setUser]);

    if (!user) {
        return <p>Carregant...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md">
                <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <img src="/ic_pelu.png" alt="Logo" className="h-12" />
                        <h1 className="text-xl font-bold text-gray-700">Dashboard</h1>
                    </div>
                    <nav
                        className="flex items-center gap-6"
                        role="navigation"
                        aria-label="Barra de navegació principal"
                    >
                        <ul className="flex gap-4">
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-blue-600 underline"
                                            : "text-gray-700 hover:text-blue-500"
                                    }
                                >
                                    Agenda
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/clients"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-blue-600 underline"
                                            : "text-gray-700 hover:text-blue-500"
                                    }
                                >
                                    Clients
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/profile"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-blue-600 underline"
                                            : "text-gray-700 hover:text-blue-500"
                                    }
                                >
                                    Perfil
                                </NavLink>
                            </li>
                            {user.role_id === 3 && (
                                <>
                                    <li>
                                        <NavLink
                                            to="/dashboard/workers"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "text-blue-600 underline"
                                                    : "text-gray-700 hover:text-blue-500"
                                            }
                                        >
                                            Treballadors
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard/services"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "text-blue-600 underline"
                                                    : "text-gray-700 hover:text-blue-500"
                                            }
                                        >
                                            Serveis
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/login");
                        }}
                        className="text-red-500 hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="p-6 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default function DashboardLayout() {
    return (
        <UserProvider>
            <DashboardContent />
        </UserProvider>
    );
}
