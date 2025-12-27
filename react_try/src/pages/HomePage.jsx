import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTime } from "../api/timeApi";
import { login, logout, register } from "../api/authThunks";

function HomePage() {
    const [time, setTime] = useState(null);
    const dispatch = useDispatch();
    const auth = useSelector((s) => s.auth);

    const [loginValue, setLoginValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    useEffect(() => {
        async function loadTime() {
            try {
                const t = await getTime();
                setTime(t);
            } catch (e) {
                setTime(null);
            }
        }
        loadTime();
        const id = setInterval(loadTime, 13000);
        return () => clearInterval(id);
    }, []);

    function handleLogin() {
        const l = (loginValue ?? "").trim();
        const p = passwordValue ?? "";
        if (!l || !p) return;
        dispatch(login(l, p));
    }

    function handleRegister() {
        const l = (loginValue ?? "").trim();
        const p = passwordValue ?? "";
        if (!l || !p) return;
        dispatch(register(l, p));
    }

    const disabled = auth.status === "loading";

    return (
        <div style={{ padding: 16 }}>
            <h2>{time ?? "Загружаю..."}</h2>

            {auth.user ? (
                <div style={{ marginTop: 16 }}>
                    <div>Вы вошли как: <b>{auth.user.login}</b></div>

                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <Link to="/main">Перейти в Main</Link>
                        <button onClick={() => dispatch(logout())} disabled={disabled}>
                            Выйти
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: 16, maxWidth: 320 }}>
                    <h3>Вход</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <input
                            placeholder="Логин"
                            value={loginValue}
                            onChange={(e) => setLoginValue(e.target.value)}
                            disabled={disabled}
                        />
                        <input
                            placeholder="Пароль"
                            type="password"
                            value={passwordValue}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            disabled={disabled}
                        />

                        <button onClick={handleLogin} disabled={disabled}>
                            Войти
                        </button>

                        <button onClick={handleRegister} disabled={disabled}>
                            Зарегистрироваться
                        </button>

                        {auth.error ? <div style={{ color: "crimson" }}>{auth.error}</div> : null}
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
