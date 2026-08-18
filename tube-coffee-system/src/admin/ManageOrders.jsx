import { useEffect, useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Trash2, 
  XCircle, 
  ChefHat, 
  Truck,
  DollarSign
} from "lucide-react";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch all orders from Firestore
  const loadOrders = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const list = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort newest first
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(list);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Update order status (Pending, Preparing, Delivery, Completed, Cancelled)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const ref = doc(db, "orders", orderId);
      await updateDoc(ref, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Toggle Payment Status (Paid / Unverified)
  const togglePaymentStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Pending Verification" : "Paid";
    try {
      const ref = doc(db, "orders", orderId);
      await updateDoc(ref, { paymentStatus: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newStatus } : o))
      );
    } catch (err) {
      alert("Failed to update payment status: " + err.message);
    }
  };

  // Delete Order
  const removeOrder = async (orderId) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } catch (err) {
        alert("Failed to delete order: " + err.message);
      }
    }
  };

  const filteredOrders = orders.filter((o) => {
    const nameMatch = (o.customerName || "Guest").toLowerCase().includes(q.toLowerCase());
    const idMatch = o.id?.toLowerCase().includes(q.toLowerCase());
    const matchesSearch = nameMatch || idMatch;

    const matchesFilter =
      filter === "all" ||
      o.status === filter ||
      o.paymentStatus === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Manage Orders</h1>
          <p className="mt-1 text-sm text-stone-500">
            Verify payments, track kitchen workflow, and dispatch deliveries.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 rounded-xl bg-stone-100 px-4 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-200"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-3.5 text-stone-400" size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Search customer or Order ID..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "Pending", "Preparing", "Delivery", "Completed", "Paid"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition ${
                filter === s
                  ? "bg-[#2b2118] text-white"
                  : "border bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-3xl bg-white border border-stone-100 shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="p-4">Customer</th>
              <th>Items</th>
              <th>Total & Payment</th>
              <th>Receipt</th>
              <th>Order Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-stone-400">
                  No orders match your criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-stone-50/50">
                  {/* Customer Info */}
                  <td className="p-4">
                    <b className="text-stone-900 block">{o.customerName || "Customer"}</b>
                    <span className="font-mono text-[10px] text-stone-400">#{o.id.slice(0, 8)}</span>
                    <p className="max-w-xs truncate text-xs text-stone-400 mt-1">
                      {o.deliveryAddress || "Pickup"}
                    </p>
                  </td>

                  {/* Items List */}
                  <td className="py-4">
                    <div className="text-xs space-y-1">
                      {o.items && o.items.length > 0 ? (
                        o.items.map((item, idx) => (
                          <div key={idx} className="text-stone-700 font-medium">
                            {item.quantity || 1}x {item.name}
                          </div>
                        ))
                      ) : (
                        <span className="text-stone-400 italic">No item details</span>
                      )}
                    </div>
                  </td>

                  {/* Total & Payment Toggle */}
                  <td className="py-4">
                    <span className="font-black text-stone-900 block">
                      ${Number(o.totalAmount || o.total || 0).toFixed(2)}
                    </span>
                    <button
                      onClick={() => togglePaymentStatus(o.id, o.paymentStatus)}
                      title="Click to toggle Paid/Unverified status"
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold mt-1 transition ${
                        o.paymentStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                    >
                      <DollarSign size={10} />
                      {o.paymentStatus === "Paid" ? "Paid" : "Unverified"}
                    </button>
                  </td>

                  {/* Receipt Link */}
                  <td>
                    {o.receiptUrl ? (
                      <a
                        href={o.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline text-xs"
                      >
                        View Receipt <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-xs text-stone-400">N/A</span>
                    )}
                  </td>

                  {/* Dropdown Order Status Selector */}
                  <td>
                    <select
                      value={o.status || "Pending"}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-bold focus:outline-none ${
                        o.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : o.status === "Delivery" || o.status === "Out for Delivery"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : o.status === "Preparing"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : o.status === "Cancelled"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <option value="Pending">Pending ⏳</option>
                      <option value="Preparing">Preparing ☕</option>
                      <option value="Delivery">Out for Delivery 🛵</option>
                      <option value="Completed">Completed ✅</option>
                      <option value="Cancelled">Cancelled ❌</option>
                    </select>
                  </td>

                  {/* Action Shortcuts */}
                  <td className="p-4 text-right space-x-1">
                    <button
                      title="Set to Preparing"
                      onClick={() => handleStatusChange(o.id, "Preparing")}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <ChefHat size={16} />
                    </button>
                    <button
                      title="Set to Out for Delivery"
                      onClick={() => handleStatusChange(o.id, "Delivery")}
                      className="rounded-lg p-2 text-purple-600 hover:bg-purple-50"
                    >
                      <Truck size={16} />
                    </button>
                    <button
                      title="Set to Completed"
                      onClick={() => handleStatusChange(o.id, "Completed")}
                      className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      title="Delete document"
                      onClick={() => removeOrder(o.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}