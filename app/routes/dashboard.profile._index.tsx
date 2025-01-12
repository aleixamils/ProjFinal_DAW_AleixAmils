import { useUser } from "~/context/UserContext";

export default function UserProfile() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { user } = useUser();

    if (!user) {
        return <p className="text-red-500">No s&#39;han pogut carregar les dades de l&#39;usuari.</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4 text-black">Perfil de l&#39;Usuari</h1>
            <div className="space-y-4 text-black">
                <p><strong>Nom:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.role === 3 ? "Administrador" : "Usuari Estàndard"}</p>
            </div>
        </div>
    );
}
