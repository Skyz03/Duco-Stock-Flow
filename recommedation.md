🟢 General recommendations

1. Add product_id foreign keys everywhere; stop denormalizing name/pic/origin onto transactions.
2. Unique constraint on product_code per company.
3. No monetary fields anywhere — if the client ever wants sales value / profit, you'll need unit_price / cost. Worth asking now.
4. Audit fields — you have created_at; consider updated_at and (if multi-user) created_by.
5. DB-level check constraints — quantities >= 0, and consider enforcing non-negative stock at write time, not just the UI warning.
