import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth.jsx";
import { useEffect } from "react";

const Protected = ({ children }) => {
  const {
    user,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.auth);

  const { handleGetMe } = useAuth();
  useEffect(() => {
    handleGetMe();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        Loading...
      </div>
    );
  }

  if (!user && !authLoading) {
    console.log("User not found");
    return <Navigate to="/login" />;
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        {authError}
      </div>
    );
  }

  return children;
};

export default Protected;
