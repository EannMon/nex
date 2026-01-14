import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import MainLayout from "@/components/MainLayout";
import type { User } from "@/data/users";

export function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    if (!currentUser) {
        return <LoginForm onLogin={handleLogin} />;
    }

    return <MainLayout user={currentUser} onLogout={handleLogout} />;
}

export default App;