import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import customerReducer from "./slices/customerSlice";
import inventoryReducer from "./slices/inventorySlice";
import transactionReducer from "./slices/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    products: productReducer,
    customers: customerReducer,
    inventory: inventoryReducer,
    transactions: transactionReducer,
  },
});
