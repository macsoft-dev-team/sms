import { useDispatch, useSelector } from "react-redux";
import {
  createProductThunk,
  fetchLocationsThunk,
  fetchProductsThunk,
  updateProductThunk,
} from "../store/slices/productSlice";

export function useProducts() {
  const dispatch = useDispatch();
  const state = useSelector((store) => store.products);

  return {
    ...state,
    fetchProducts: (params) => dispatch(fetchProductsThunk(params)).unwrap(),
    createProduct: (payload) => dispatch(createProductThunk(payload)).unwrap(),
    updateProduct: (id, payload) => dispatch(updateProductThunk({ id, payload })).unwrap(),
    fetchLocations: (params) => dispatch(fetchLocationsThunk(params)).unwrap(),
  };
}