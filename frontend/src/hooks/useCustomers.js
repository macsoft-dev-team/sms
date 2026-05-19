import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCustomerThunk, fetchCustomersThunk, updateCustomerThunk } from "../store/slices/customerSlice";

export function useCustomers() {
  const dispatch = useDispatch();
  const state = useSelector((store) => store.customers);
  const grouped = useMemo(() => state.items.reduce((acc, customer) => {
    const key = customer.groupName || "Ungrouped";
    acc[key] = acc[key] || [];
    acc[key].push(customer);
    return acc;
  }, {}), [state.items]);

  return {
    ...state,
    grouped,
    fetchCustomers: (params) => dispatch(fetchCustomersThunk(params)).unwrap(),
    createCustomer: (payload) => dispatch(createCustomerThunk(payload)).unwrap(),
    updateCustomer: (id, payload) => dispatch(updateCustomerThunk({ id, payload })).unwrap(),
  };
}
