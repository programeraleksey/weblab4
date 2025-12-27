
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './index.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Provider } from "react-redux";

import { store } from "./redux/store";
import App from "./App.jsx";



ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <header>
        <h1>Поляков Алексей Леонидович</h1>
        <h2>P3209</h2>
        <h3>Вариант 2265</h3>
      </header>
      <App />
    </BrowserRouter>
  </Provider>
);