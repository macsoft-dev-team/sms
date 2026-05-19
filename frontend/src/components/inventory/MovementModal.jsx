import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import { transactionTypes } from "../../constants/rbac";

const emptyLine = { productCode: "", serialNo: "", qty: 1, note: "" };

export default function MovementModal({ open, onClose, products, locations, customers, onSubmit }) {
  const [type, setType] = useState("INBOUND");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [note, setNote] = useState("");
  const [lines, setLines] = useState([{ ...emptyLine }]);

  const updateLine = (index, field, value) => setLines((prev) => prev.map((line, i) => i === index ? { ...line, [field]: value } : line));
  const addLine = () => setLines((prev) => [...prev, { ...emptyLine }]);
  const removeLine = (index) => setLines((prev) => prev.length === 1 ? prev : prev.filter((_, i) => i !== index));

  const submit = () => {
    const validLines = lines.filter((line) => line.productCode && Number(line.qty) > 0);
    onSubmit({ type, fromLocation, toLocation, customerCode, note, lines: validLines });
    setLines([{ ...emptyLine }]);
  };

  return (
    <Modal open={open} onClose={onClose} title="Inward / Outward / Transfer" subtitle="Bulk stock movement with optional serial numbers." size="full">
      <div className="space-y-4">
        <div className="grid gap-3 rounded-md bg-slate-50 p-3 md:grid-cols-5">
          <Select label="Movement" value={type} onChange={(e) => setType(e.target.value)}>{transactionTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</Select>
          {type !== "INBOUND" && <Select label="From" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)}><option value="">Select</option>{locations.map((l) => <option key={l.id} value={l.code || l.name}>{l.code} - {l.name}</option>)}</Select>}
          {type !== "OUTBOUND" && <Select label="To" value={toLocation} onChange={(e) => setToLocation(e.target.value)}><option value="">Select</option>{locations.map((l) => <option key={l.id} value={l.code || l.name}>{l.code} - {l.name}</option>)}</Select>}
          {type === "OUTBOUND" && <Select label="Customer" value={customerCode} onChange={(e) => setCustomerCode(e.target.value)}><option value="">Optional</option>{customers.map((c) => <option key={c.id} value={c.code}>{c.code} - {c.name}</option>)}</Select>}
          <Input label="Note" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="space-y-3">
          {lines.map((line, index) => (
            <div key={index} className="rounded-md border border-slate-200 p-3">
              <div className="mb-3 flex items-center justify-between"><p className="text-sm font-bold text-slate-700">Line {index + 1}</p><Button variant="ghost" onClick={() => removeLine(index)}><Trash2 size={16} /> Remove</Button></div>
              <div className="grid gap-3 md:grid-cols-4">
                <Select label="Product" value={line.productCode} onChange={(e) => updateLine(index, "productCode", e.target.value)}><option value="">Select product</option>{products.map((p) => <option key={p.id} value={p.code}>{p.code} - {p.name}</option>)}</Select>
                <Input label="Serial Optional" value={line.serialNo} onChange={(e) => updateLine(index, "serialNo", e.target.value)} />
                <Input label="Qty" type="number" min="1" value={line.qty} onChange={(e) => updateLine(index, "qty", e.target.value)} />
                <Input label="Line Note" value={line.note} onChange={(e) => updateLine(index, "note", e.target.value)} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-2"><Button variant="secondary" onClick={addLine}><Plus size={16} /> Add line</Button><Button onClick={submit}><Save size={16} /> Save movement</Button></div>
      </div>
    </Modal>
  );
}
