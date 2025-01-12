// app/context/UserContext.tsx
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

// @ts-ignore
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);


    return (
        // @ts-ignore
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
