"use client";

export function DataTable({ columns, data, isLoading, onDelete, rowClassName }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200">
      <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
        <thead className="bg-zinc-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 font-medium text-zinc-700 ${col.headerClassName || ""}`}>
                {col.header}
              </th>
            ))}
            {onDelete ? (
              <th className="px-4 py-3 font-medium text-zinc-700">Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-zinc-200" />
                    </td>
                  ))}
                  {onDelete ? (
                    <td className="px-4 py-3">
                      <div className="h-8 w-16 animate-pulse rounded bg-zinc-200" />
                    </td>
                  ) : null}
                </tr>
              ))
            : null}
          {!isLoading && !data.length ? (
            <tr>
              <td colSpan={columns.length + (onDelete ? 1 : 0)} className="px-4 py-10 text-center text-zinc-500">
                No entries found.
              </td>
            </tr>
          ) : null}
          {!isLoading &&
            data.map((row) => (
              <tr key={row.id || row.product_code} className={rowClassName ? rowClassName(row) : "hover:bg-zinc-50/80"}>
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-zinc-800 ${col.className || ""}`}>
                    {col.key === "product_pic" ? (
                      row.product_pic ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={row.product_pic} alt="" className="h-10 w-10 rounded-md object-cover ring-1 ring-zinc-200" />
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )
                    ) : col.render ? (
                      col.render(row)
                    ) : (
                      String(row[col.key] ?? "—")
                    )}
                  </td>
                ))}
                {onDelete ? (
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                      className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
