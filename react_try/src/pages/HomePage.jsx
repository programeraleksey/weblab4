import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTime } from "../api/timeApi";
import { login, logout, register } from "../api/authThunks";
import "./pages.css";

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
            } catch {
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

    function handleGoogleLogin() {
        window.location.href = "/oauth2/authorization/google";
    }

    const disabled = auth.status === "loading";

    return (
        <div className="page">
            <div className="container">
                <h2 className="homeHeader">{time ?? "Загружаю..."}</h2>

                <div className="homeBody">
                    {auth.user ? (
                        <div className="authCard">
                            <div>
                                Вы вошли как: <b>{auth.user.login}</b>
                            </div>

                            <div className="row rowWrap" style={{ marginTop: 10 }}>
                                <Link to="/main">Перейти в Main</Link>
                                <button onClick={() => dispatch(logout())} disabled={disabled}>
                                    Выйти
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="authCard">
                            <h3 className="authTitle">Вход</h3>

                            <div className="stack">
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

                                <div>
                                    <div className="dividerRow">
                                        <div className="dividerLine" />
                                        <span className="dividerText">или</span>
                                        <div className="dividerLine" />
                                    </div>

                                    <button
                                        className="fullWidth"
                                        onClick={handleGoogleLogin}
                                        disabled={disabled}
                                        style={{ marginTop: 10 }}
                                    >
                                        Continue with Google
                                    </button>
                                </div>

                                {auth.error ? <div className="errorText">{auth.error}</div> : null}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
