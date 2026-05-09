"use client";
import { useEffect, useMemo, useState } from "react";

export function EntryManager({ title, apiBase, fields, columns, accentColor }) {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(() => {
    const initial = {};
    fields.forEach((field) => {
      initial[field.name] = field.type === "date" ? new Date().toISOString().slice(0, 10) : "";
    });
    return initial;
  });
  const [error, setError] = useState("");

  const pageSize = 20;
  const inputStyle = { borderColor: "var(--app-border)", backgroundColor: "var(--app-surface-muted)", color: "var(--app-text)" };

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(pageSize));
    if (search) params.set("search", search);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return params.toString();
  }, [search, from, to, page]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}?${queryString}`, { cache: "no-store" });
        const json = await res.json();
        setEntries(json.data || []);
        setTotal(json.count || 0);
      } catch (err) {
        setError("Unable to load entries.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [apiBase, queryString]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {};
    for (const field of fields) {
      let value = form[field.name];
      if (field.type === "integer") {
        value = value !== "" ? parseInt(value, 10) : null;
      }
      if (field.type === "date") {
        value = value || new Date().toISOString().slice(0, 10);
      }
      if (value !== null && value !== "") {
        payload[field.name] = value;
      }
      if (field.required && (value === null || value === "")) {
        setError(`${field.label || field.name} is required.`);
        return;
      }
    }

    setError("");
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || "Unable to save entry.");
      }
      setForm((prev) => {
        const next = { ...prev };
        fields.forEach((field) => {
          next[field.name] = field.type === "date" ? new Date().toISOString().slice(0, 10) : "";
        });
        return next;
      });
      setPage(1);
      const json = await res.json();
      setEntries((prev) => [json.data, ...prev].slice(0, pageSize));
    } catch (err) {
      setError(err.message || "Unable to save entry.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      const res = await fetch(`${apiBase}?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Unable to delete entry.");
      setEntries((current) => current.filter((item) => item.id !== id));
      setTotal((current) => Math.max(0, current - 1));
    } catch (err) {
      setError(err.message || "Unable to delete entry.");
    }
  };

  const exportCsv = () => {
    const exportParams = new URLSearchParams();
    if (search) exportParams.set("search", search);
    if (from) exportParams.set("from", from);
    if (to) exportParams.set("to", to);
    window.open(`${apiBase}/export?${exportParams.toString()}`, "_blank");
  };

  return (
    <div
      className="rounded-3xl p-6"
      style={{
        backgroundColor: "var(--app-surface)",
        border: "1px solid var(--app-border)",
        boxShadow: "var(--app-shadow)",
      }}
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: "var(--app-text)" }}>{title}</h2>
          <p className="text-sm" style={{ color: "var(--app-text-muted)" }}>
            Manage entries and track updates for {title.toLowerCase()}.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          Export CSV
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className="block">
            <span className="text-sm font-medium" style={{ color: "var(--app-text)" }}>
              {field.label || field.name.replace(/_/g, " ")}
            </span>
            <input
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
              style={{ ...inputStyle, "--tw-ring-color": `${accentColor}66` }}
              type={field.type === "integer" ? "number" : field.type === "date" ? "date" : field.type === "image_url" ? "url" : "text"}
              value={form[field.name] || ""}
              onChange={(event) => handleChange(field.name, event.target.value)}
              placeholder={field.placeholder || "Enter value"}
              required={field.required}
            />
          </label>
        ))}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            Add entry
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search product code or name"
          className="rounded-2xl border px-4 py-3 text-sm outline-none"
          style={inputStyle}
        />
        <input
          type="date"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          className="rounded-2xl border px-4 py-3 text-sm outline-none"
          style={inputStyle}
        />
        <input
          type="date"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          className="rounded-2xl border px-4 py-3 text-sm outline-none"
          style={inputStyle}
        />
      </div>

      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="mt-8 overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--app-border)" }}>
        <table className="min-w-full divide-y text-left text-sm" style={{ borderColor: "var(--app-border)" }}>
          <thead style={{ backgroundColor: `${accentColor}12` }}>
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium" style={{ color: "var(--app-text)" }}>
                  {column.replace(/_/g, " ")}
                </th>
              ))}
              <th className="px-4 py-3 font-medium" style={{ color: "var(--app-text)" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--app-border)" }}>
            {!entries.length && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-sm" style={{ color: "var(--app-text-muted)" }}>
                  {loading ? "Loading entries…" : "No entries found."}
                </td>
              </tr>
            )}
            {entries.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50/70">
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3" style={{ color: "var(--app-text)" }}>
                    {String(item[column] ?? "-")}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(item.id)} className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm" style={{ color: "var(--app-text-muted)" }}>
        <p>{total} entries found</p>
        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-full border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50" style={{ borderColor: "var(--app-border)" }}>
            Prev
          </button>
          <button disabled={page * pageSize >= total} onClick={() => setPage((current) => current + 1)} className="rounded-full border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50" style={{ borderColor: "var(--app-border)" }}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
