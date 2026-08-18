export const money = n => `$${Number(n || 0).toFixed(2)}`;
export const dateTime = value => {
  if (!value) return "—";
  const date = value?.toDate ? value.toDate() : new Date(value);
  return new Intl.DateTimeFormat("en-US",{dateStyle:"medium",timeStyle:"short"}).format(date);
};
export const statusClass = status => ({
 Pending:"bg-amber-100 text-amber-800", Preparing:"bg-blue-100 text-blue-800", Ready:"bg-violet-100 text-violet-800",
 Completed:"bg-emerald-100 text-emerald-800", Cancelled:"bg-red-100 text-red-800"
}[status] || "bg-stone-100 text-stone-700");
