import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { listAll, createRecord, updateRecord, deleteRecord } from "../lib/firestore";

const empty = { title: "", description: "", available: true };

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(empty);
  const [edit, setEdit] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => listAll("services").then(setServices).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setBusy(true);
    try {
      const data = { ...form, title: form.title.trim(), description: form.description.trim() };
      if (edit) await updateRecord("services", edit, data);
      else await createRecord("services", data);
      setForm(empty);
      setEdit(null);
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this service?")) return;
    await deleteRecord("services", id);
    load();
  };

  return <div>
    <div className="mb-7">
      <h1 className="text-3xl font-black">Services</h1>
      <p className="mt-2 text-stone-500">Add, update, enable, or remove the services shown on the public website.</p>
    </div>

    <form onSubmit={save} className="mb-8 rounded-3xl bg-white p-6 card-shadow">
      <div className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
        <label className="grid gap-2 text-sm font-bold">Service name
          <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" placeholder="e.g. Delivery" />
        </label>
        <label className="grid gap-2 text-sm font-bold">Description
          <input required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" placeholder="Describe this service" />
        </label>
        <button disabled={busy} className="flex items-center justify-center gap-2 rounded-xl bg-[#f4b400] px-5 py-3 font-black">
          {edit ? <Pencil size={17} /> : <Plus size={17} />}{edit ? "Update" : "Add"}
        </button>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} /> Show this service on the website</label>
      {edit && <button type="button" onClick={() => { setEdit(null); setForm(empty); }} className="mt-3 text-sm font-bold text-stone-500">Cancel editing</button>}
    </form>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service, index) => <div key={service.id} className="rounded-3xl bg-white p-6 card-shadow">
        <div className="flex items-start justify-between gap-4">
          <span className="text-3xl font-black text-[#f4b400]">{String(index + 1).padStart(2, "0")}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${service.available !== false ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>{service.available !== false ? "Visible" : "Hidden"}</span>
        </div>
        <h2 className="mt-5 text-xl font-black">{service.title}</h2>
        <p className="mt-2 min-h-14 leading-6 text-stone-500">{service.description}</p>
        <div className="mt-5 flex justify-end gap-2 border-t pt-4">
          <button onClick={() => { setEdit(service.id); setForm({ title: service.title || "", description: service.description || "", available: service.available !== false }); }} className="rounded-lg p-2 hover:bg-stone-100"><Pencil size={17} /></button>
          <button onClick={() => remove(service.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>
        </div>
      </div>)}
    </div>
    {!services.length && <div className="rounded-3xl border border-dashed border-stone-300 p-12 text-center text-stone-500">No services yet. Add your first service above.</div>}
  </div>;
}
