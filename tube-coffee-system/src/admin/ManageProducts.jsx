import { useEffect, useState } from "react";
import { ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { listAll, createRecord, updateRecord, deleteRecord } from "../lib/firestore";
import { money } from "../lib/format";

const empty = { name: "", description: "", price: "", category: "Hot Coffee", image: "", available: true };

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(empty);
  const [edit, setEdit] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    Promise.all([listAll("products"), listAll("categories")])
      .then(([p, c]) => {
        setProducts(p);
        setCats(c);
      })
      .catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const data = { ...form, price: Number(form.price) };
      if (edit && edit !== "new") await updateRecord("products", edit, data);
      else await createRecord("products", data);

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
    if (confirm("Delete this product?")) {
      await deleteRecord("products", id);
      load();
    }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <Header
        title="Products"
        action={() => {
          setForm(empty);
          setEdit("new");
        }}
      />
      
      <div className="mb-5 relative max-w-sm">
        <Search className="absolute left-3 top-3.5 text-stone-400" size={18} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-xl border bg-white py-3 pl-10 pr-4"
          placeholder="Search products..."
        />
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white card-shadow">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="p-4">Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Available</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image || "/assets/popular-drink.jpg"} className="h-11 w-11 rounded-lg object-cover" alt="" />
                    <div>
                      <b>{p.name}</b>
                      <p className="max-w-xs truncate text-xs text-stone-400">{p.description}</p>
                    </div>
                  </div>
                </td>
                <td>{p.category}</td>
                <td className="font-bold">{money(p.price)}</td>
                <td>{p.available !== false ? "Yes" : "No"}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setEdit(p.id);
                      setForm({ ...p, price: String(p.price) });
                    }}
                    className="mr-2 rounded-lg p-2 hover:bg-stone-100"
                  >
                    <Pencil size={17} />
                  </button>
                  <button onClick={() => remove(p.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                    <Trash2 size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <Modal title={edit === "new" ? "Add product" : "Edit product"} close={() => setEdit(null)}>
          <form onSubmit={save} className="grid gap-4">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border px-4 py-3"
              placeholder="Product name"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-xl border px-4 py-3"
              placeholder="Description"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                type="number"
                min="0"
                step=".01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="rounded-xl border px-4 py-3"
                placeholder="Price"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-xl border px-4 py-3"
              >
                {(cats.length
                  ? cats.map((c) => c.name)
                  : ["Hot Coffee", "Iced Coffee", "Espresso", "Tea", "Smoothies", "Desserts"]
                ).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
              />{" "}
              Available
            </label>

            <div className="grid gap-1">
              <label className="text-xs font-bold text-stone-500">Image URL</label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="rounded-xl border px-4 py-3 text-sm"
                placeholder="https://example.com/coffee-image.jpg"
              />
            </div>

            <button disabled={busy} className="rounded-xl bg-[#f4b400] px-4 py-3 font-black">
              {busy ? "Saving..." : "Save product"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Header({ title, action }) {
  return (
    <div className="mb-7 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="mt-2 text-stone-500">Create and maintain your menu.</p>
      </div>
      <button onClick={action} className="flex items-center gap-2 rounded-xl bg-[#2b2118] px-4 py-3 text-sm font-bold text-white">
        <Plus size={17} /> Add
      </button>
    </div>
  );
}

function Modal({ title, close, children }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-7">
        <div className="mb-6 flex justify-between">
          <h2 className="text-2xl font-black">{title}</h2>
          <button onClick={close}>
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}