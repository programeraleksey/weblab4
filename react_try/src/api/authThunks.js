import { setLoading, setUser, setError, clearUser } from "../redux/authSlice";

export function fetchMe() {
    return async (dispatch) => {
        dispatch(setLoading());
        try {
            const res = await fetch("/api/auth/me", { credentials: "include" });
            const data = await res.json();
            console.log("fetchMe:", res.status, data);

            dispatch(setUser(data.authenticated ? { login: data.login } : null));
        } catch (e) {
            console.error("fetchMe failed:", e);
            dispatch(setError("cannot reach server"));
            dispatch(setUser(null));
        }
    };
}

export function login(loginValue, password) {
    return async (dispatch) => {
        dispatch(setLoading());
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: loginValue, password }),
            });

            if (!res.ok) {
                let msg = `login failed (${res.status})`;
                try {
                    const err = await res.json();
                    msg = err.error || msg;
                } catch { }
                dispatch(setError(msg));
                return;
            }

            dispatch(fetchMe());
        } catch (e) {
            console.error("login failed:", e);
            dispatch(setError("cannot reach server"));
        }
    };
}

export function logout() {
    return async (dispatch) => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } finally {
            dispatch(clearUser());
        }
    };
}

export function register(loginValue, password) {
    return async (dispatch) => {
        dispatch(setLoading());
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: loginValue, password }),
            });

            if (!res.ok) {
                let msg = `register failed (${res.status})`;
                try {
                    const err = await res.json();
                    msg = err.error || msg;
                } catch { }
                dispatch(setError(msg));
                return;
            }

            dispatch(login(loginValue, password));
        } catch (e) {
            console.error("register failed:", e);
            dispatch(setError("cannot reach server"));
        }
    };
}
