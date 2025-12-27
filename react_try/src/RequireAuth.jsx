import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
    const { status, user } = useSelector((s) => s.auth);

    if (status === "loading") {
        return <div style={{ padding: 16 }}>Загружаю...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}
