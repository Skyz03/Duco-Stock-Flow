export function StockTable({ rows, columns, accentColor }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm shadow-zinc-200/40">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950">Stock overview</h2>
          <p className="text-sm text-zinc-500">Grouped by product code with low stock warnings.</p>
        </div>
        <div className="h-3 w-24 rounded-full" style={{ backgroundColor: accentColor }} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium text-zinc-700">{column.replace(/_/g, " ")}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {rows.map((row) => (
              <tr key={row.product_code} className={Number(row.net_stock) <= 0 ? "bg-red-50" : "hover:bg-zinc-50"}>
                {columns.map((column) => (
                  <td key={`${row.product_code}-${column}`} className="px-4 py-3 text-zinc-700">{row[column] ?? "-"}</td>
                ))}
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-zinc-500">
                  No stock data available.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
