import { useDispatch, useSelector } from "react-redux";
import { clearInventoryFilters, fetchInventorySummaryThunk, fetchInventoryThunk, setInventoryFilter, setInventoryFilters } from "../store/slices/inventorySlice";

export function useInventories() {
  const dispatch = useDispatch();
  const state = useSelector((store) => store.inventory);
  return {
    ...state,
    fetchInventory: (params) => dispatch(fetchInventoryThunk(params)).unwrap(),
    fetchSummary: () => dispatch(fetchInventorySummaryThunk()).unwrap(),
    setFilter: (key, value) => dispatch(setInventoryFilter({ key, value })),
    setFilters: (values) => dispatch(setInventoryFilters(values)),
    clearFilters: () => dispatch(clearInventoryFilters()),
  };
}
