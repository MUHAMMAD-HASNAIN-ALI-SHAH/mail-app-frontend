import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";

function App() {
  const { verify, isAuthenticatedLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    verify();
  }, [verify]);

  if (isAuthenticatedLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/signin"
        element={!isAuthenticated ? <SignIn /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Navigate to="/signin" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
