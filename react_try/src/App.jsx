import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchMe } from "./api/authThunks";

import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import RequireAuth from "./RequireAuth";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/main"
        element={
          <RequireAuth>
            <MainPage />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
