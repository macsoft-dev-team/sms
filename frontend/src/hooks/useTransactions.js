import { useDispatch, useSelector } from "react-redux";
import { clearImportResult, createMovementThunk, downloadTransactionTemplate, fetchTransactionsThunk, uploadTransactionsExcelThunk } from "../store/slices/transactionSlice";

export function useTransactions() {
  const dispatch = useDispatch();
  const state = useSelector((store) => store.transactions);
  return {
    ...state,
    fetchTransactions: (params) => dispatch(fetchTransactionsThunk(params)).unwrap(),
    createMovement: (payload) => dispatch(createMovementThunk(payload)).unwrap(),
    uploadExcel: (file) => dispatch(uploadTransactionsExcelThunk(file)).unwrap(),
    downloadTemplate: downloadTransactionTemplate,
    clearImportResult: () => dispatch(clearImportResult()),
  };
}
