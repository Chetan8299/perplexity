import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../auth.slice.js";
import { login, register, getMe } from "../service/auth.api.js";

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async (username, email, password) => {
    try {
      dispatch(setLoading(true));
      await register(username, email, password);
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Registration failed. Please try again.",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async (email, password) => {
    try {
      dispatch(setLoading(true));
      const response = await login(email, password);
      dispatch(setUser(response.user));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message || "Login failed. Please try again.",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getMe();
      dispatch(setUser(response.user));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to get user data."),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
  };
};
