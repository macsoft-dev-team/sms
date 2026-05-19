import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { getAuthToken } from "../api/token";
import { fetchInventorySummaryThunk, fetchInventoryThunk } from "../store/slices/inventorySlice";
import { fetchTransactionsThunk } from "../store/slices/transactionSlice";

export function useInventorySocket(enabled = true) {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.inventory.filters);

  useEffect(() => {
    if (!enabled) return undefined;
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token: getAuthToken() },
      transports: ["websocket", "polling"],
    });

    socket.emit("join:inventory");
    socket.on("inventory:changed", () => {
      dispatch(fetchInventoryThunk(filters));
      dispatch(fetchInventorySummaryThunk());
      dispatch(fetchTransactionsThunk({ limit: 10 }));
    });

    return () => socket.disconnect();
  }, [dispatch, enabled, filters]);
}
