import { useDispatch, useSelector } from "react-redux";
import { ADMIN_ROLES, STAFF_ROLES } from "../constants/rbac";
import { clearAuthError, fetchMeThunk, loginThunk, logout, updateProfileThunk } from "../store/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const role = auth.user?.role;

  return {
    ...auth,
    isAdmin: ADMIN_ROLES.includes(role),
    isStaff: STAFF_ROLES.includes(role),
    login: (payload) => dispatch(loginThunk(payload)).unwrap(),
    fetchMe: () => dispatch(fetchMeThunk()).unwrap(),
    updateProfile: (payload) => dispatch(updateProfileThunk(payload)).unwrap(),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearAuthError()),
  };
}
