/**
 * Sum a numeric column without PostgREST aggregate functions (some projects
 * disallow aggregates via API/RLS).
 */
export function sumRows(rows, column) {
  if (!rows?.length) return 0;
  return rows.reduce((acc, row) => acc + Number(row[column] ?? 0), 0);
}
