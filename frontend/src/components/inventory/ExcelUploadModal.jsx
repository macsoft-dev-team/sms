import { useState } from "react";
import { Download, Upload } from "lucide-react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

export default function ExcelUploadModal({ open, onClose, onDownloadTemplate, onUpload }) {
  const [file, setFile] = useState(null);
  const submit = () => { if (file) onUpload(file); };
  return (
    <Modal open={open} onClose={onClose} title="Excel Upload" subtitle="Download the backend template, fill rows, and upload." size="lg">
      <div className="space-y-4">
        <div className="grid gap-3 rounded-md bg-slate-50 p-4 md:grid-cols-2">
          <Button variant="secondary" onClick={onDownloadTemplate}><Download size={16} /> Download Template</Button>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            <Upload size={16} /> Select Excel / CSV
            <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
        </div>
        {file && <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-600">Selected file: <span className="font-bold text-slate-900">{file.name}</span></div>}
        <div className="flex justify-end gap-2"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button disabled={!file} onClick={submit}>Upload and Import</Button></div>
      </div>
    </Modal>
  );
}
