import { Link, useNavigate } from "react-router-dom";
import { useMemo, useRef, useState, useEffect } from "react";

import { MultiSelect } from "primereact/multiselect";
import { Slider } from "primereact/slider";

import { checkPoint, getPoints } from "../api/pointsApi";
import { addPoint, setPoints } from "../redux/pointsSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../api/authThunks";

const VB_MIN = -5.5;
const VB_SIZE = 11;

const th = { border: "1px solid #ddd", padding: 8, textAlign: "left" };
const td = { border: "1px solid #ddd", padding: 8 };

const ALLOWED = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
const X_OPTIONS = ALLOWED.map((v) => ({ label: String(v), value: v }));
const R_OPTIONS = X_OPTIONS;

export default function MainPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector((state) => state.points.items);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate("/", { replace: true });
    };

    const [rSel, setRSel] = useState([2]);
    const r = rSel.length === 1 ? rSel[0] : NaN;

    useEffect(() => {
        (async () => {
            try {
                const resp = await getPoints();
                const list = Array.isArray(resp) ? resp : resp?.points;
                dispatch(setPoints(list ?? []));
            } catch (e) {
                console.error("getPoints error:", e);
            }
        })();
    }, [dispatch]);

    return (
        <div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Link to="/">Обратно</Link>
                <button onClick={handleLogout}>Выйти</button>
            </div>

            <div style={{ marginTop: 16, display: "grid", gap: 12, maxWidth: 420 }}>
                <div>
                    <label>R (MultiSelect):</label>
                    <MultiSelect
                        value={rSel}
                        options={R_OPTIONS}
                        onChange={(e) => {
                            const arr = e.value ?? [];
                            setRSel(arr.length ? [arr[arr.length - 1]] : []);
                        }}
                        placeholder="Выбери R"
                        maxSelectedLabels={1}
                        display="chip"
                    />
                </div>
            </div>

            <ManualPointForm rSel={rSel} r={r} />
            <PlotWithRadiusAndClick r={r} />

            <PointsTable points={items} />
        </div>
    );
}

function AxisNumbers({ max = 5 }) {
    const values = useMemo(() => {
        const arr = [];
        for (let i = -max; i <= max; i++) arr.push(i);
        return arr;
    }, [max]);

    const fontSize = 0.35;

    return (
        <>
            {values.map((v) => (
                <text key={`xl${v}`} x={v} y={0.65} fontSize={fontSize} textAnchor="middle">
                    {v}
                </text>
            ))}
            {values.map((v) => (
                <text key={`yl${v}`} x={0.5} y={-v} fontSize={fontSize} dominantBaseline="middle">
                    {v}
                </text>
            ))}
        </>
    );
}

function Plot({ R, points = [], onPickPoint }) {
    const r = Math.max(0.1, Math.min(5, Number(R) || 1));
    const axisStroke = 0.06;
    const tickSize = 0.15;

    const ticks = useMemo(() => {
        const arr = [];
        for (let i = -5; i <= 5; i++) arr.push(i);
        return arr;
    }, []);

    const svgRef = useRef(null);

    const handleClick = (e) => {
        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;

        const x = VB_MIN + (px / rect.width) * VB_SIZE;
        const yDown = VB_MIN + (py / rect.height) * VB_SIZE;
        const y = -yDown;

        onPickPoint({ x, y });
    };

    return (
        <svg
            ref={svgRef}
            width="360"
            height="360"
            viewBox={`${VB_MIN} ${VB_MIN} ${VB_SIZE} ${VB_SIZE}`}
            onClick={handleClick}
            style={{ cursor: "crosshair", userSelect: "none" }}
        >
            <g transform="scale(1,-1)">
                <rect x={0} y={0} width={r / 2} height={r} fill="#4da3ff" opacity={0.8} />
                <polygon points={`${0},${0} ${-r / 2},${0} ${0},${r}`} fill="#4da3ff" opacity={0.8} />
                <path
                    d={`M 0 0 L 0 ${-r / 2} A ${r / 2} ${r / 2} 0 0 0 ${-r / 2} 0 Z`}
                    fill="#4da3ff"
                    opacity={0.8}
                />

                <line x1={-5.3} y1={0} x2={5.3} y2={0} stroke="black" strokeWidth={axisStroke} />
                <line x1={0} y1={-5.3} x2={0} y2={5.3} stroke="black" strokeWidth={axisStroke} />

                {ticks.map((x) => (
                    <line key={`xt${x}`} x1={x} y1={-tickSize} x2={x} y2={tickSize} stroke="black" strokeWidth={0.04} />
                ))}
                {ticks.map((y) => (
                    <line key={`yt${y}`} x1={-tickSize} y1={y} x2={tickSize} y2={y} stroke="black" strokeWidth={0.04} />
                ))}

                {Array.isArray(points) &&
                    points.map((p, i) => (
                        <circle
                            key={p.id ?? `${p.x}-${p.y}-${p.r}-${i}`}
                            cx={Number(p.x)}
                            cy={Number(p.y)}
                            r={0.12}
                            fill={p.hit ? "green" : "red"}
                            opacity={0.9}
                        />
                    ))}
            </g>

            <text x={5.15} y={-0.35} fontSize={0.45}>
                x
            </text>
            <text x={0.25} y={-5.15} fontSize={0.45}>
                y
            </text>
            <AxisNumbers max={5} />
        </svg>
    );
}

function PlotWithRadiusAndClick({ r }) {
    const dispatch = useDispatch();
    const points = useSelector((state) => state.points.items);

    const [picked, setPicked] = useState(null);
    const [err, setErr] = useState(null);

    const handlePickPoint = async (pt) => {
        setPicked(pt);

        if (!Number.isFinite(r) || r <= 0) {
            setErr("Выбери ровно один R > 0 (MultiSelect сверху).");
            return;
        }
        setErr(null);

        const payload = { x: pt.x, y: pt.y, r: Number(r) };

        try {
            const result = await checkPoint(payload);
            dispatch(addPoint(result));
            console.log("server(click):", result);
        } catch (e) {
            console.error("server error:", e);
        }
    };

    return (
        <div style={{ marginTop: 12 }}>
            <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, width: "fit-content" }}>
                <Plot R={r} points={points} onPickPoint={handlePickPoint} />
            </div>

            {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
        </div>
    );
}

function PointsTable({ points }) {
    const arr = Array.isArray(points) ? points : [];
    if (arr.length === 0) return <div style={{ marginTop: 12 }}>Точек пока нет.</div>;

    return (
        <table style={{ borderCollapse: "collapse", marginTop: 12, minWidth: 420 }}>
            <thead>
                <tr>
                    <th style={th}>#</th>
                    <th style={th}>x</th>
                    <th style={th}>y</th>
                    <th style={th}>r</th>
                    <th style={th}>hit</th>
                </tr>
            </thead>
            <tbody>
                {arr.map((p, i) => (
                    <tr key={p.id ?? `${p.x}-${p.y}-${p.r}-${i}`}>
                        <td style={td}>{i + 1}</td>
                        <td style={td}>{Number(p.x).toFixed(3)}</td>
                        <td style={td}>{Number(p.y).toFixed(3)}</td>
                        <td style={td}>{Number(p.r).toFixed(3)}</td>
                        <td style={td}>{p.hit ? "✅" : "❌"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function ManualPointForm({ rSel, r }) {
    const dispatch = useDispatch();

    const [xSel, setXSel] = useState([0]);
    const [y, setY] = useState(0);
    const [error, setError] = useState(null);

    const send = async () => {
        if (xSel.length !== 1) {
            setError("X: выбери ровно одно значение (MultiSelect).");
            return;
        }
        if (!Number.isFinite(r) || rSel.length !== 1) {
            setError("R: выбери ровно одно значение (MultiSelect).");
            return;
        }
        if (r <= 0) {
            setError("R должен быть положительным.");
            return;
        }
        if (!Number.isFinite(y) || y < -3 || y > 5) {
            setError("Y вне диапазона (-3..5).");
            return;
        }

        setError(null);

        const payload = {
            x: xSel[0],
            y: Number(y),
            r: Number(r),
        };

        try {
            const result = await checkPoint(payload);
            dispatch(addPoint(result));
            console.log("sent(form):", payload, "got:", result);
        } catch (e) {
            console.error("send error:", e);
        }
    };

    return (
        <div style={{ marginTop: 16, display: "grid", gap: 12, maxWidth: 420 }}>
            <div>
                <label>X (MultiSelect):</label>
                <MultiSelect
                    value={xSel}
                    options={X_OPTIONS}
                    onChange={(e) => {
                        const arr = e.value ?? [];
                        setXSel(arr.length ? [arr[arr.length - 1]] : []);
                    }}
                    placeholder="Выбери X"
                    maxSelectedLabels={1}
                    display="chip"
                />
            </div>

            <div>
                <label>Y (Slider): {y}</label>
                <Slider value={y} onChange={(e) => setY(e.value)} min={-3} max={5} />
            </div>

            {error && <div style={{ color: "red" }}>{error}</div>}

            <button onClick={send}>Отправить</button>
        </div>
    );
}
