import { useDispatch, useSelector } from "react-redux";
import { createUserThunk, fetchUsersThunk, updateUserThunk } from "../store/slices/userSlice";

export function useUsers() {
  const dispatch = useDispatch();
  const state = useSelector((store) => store.users);
  return {
    ...state,
    fetchUsers: (params) => dispatch(fetchUsersThunk(params)).unwrap(),
    createUser: (payload) => dispatch(createUserThunk(payload)).unwrap(),
    updateUser: (id, payload) => dispatch(updateUserThunk({ id, payload })).unwrap(),
  };
}
