"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { ImageUpload } from "./ImageUpload";
import { ProductCodeAutocomplete } from "./ProductCodeAutocomplete";

function buildSchema(fields) {
  const shape = {};
  for (const f of fields) {
    const name = f.name;
    if (f.type === "hidden") {
      shape[name] = z.any().optional();
    } else if (f.type === "integer") {
      const min = f.min != null ? f.min : f.required ? 1 : 0;
      shape[name] = z.preprocess((v) => {
        if (v === "" || v === null || v === undefined) return f.required ? undefined : (f.defaultValue ?? 0);
        const n = Number(v);
        return Number.isFinite(n) ? n : f.required ? undefined : (f.defaultValue ?? 0);
      }, f.required ? z.number().int().min(min) : z.number().int().min(min));
    } else if (f.type === "date") {
      shape[name] = z.string().min(1, "Required");
    } else if (f.type === "image_url") {
      shape[name] = z.union([z.string().url(), z.literal("")]).optional();
    } else {
      shape[name] = f.required ? z.string().min(1) : z.string().optional();
    }
  }
  return z.object(shape);
}

function buildDefaults(fields) {
  const d = {};
  const today = new Date().toISOString().slice(0, 10);
  for (const f of fields) {
    if (f.defaultValue !== undefined) d[f.name] = f.defaultValue;
    else if (f.type === "hidden") d[f.name] = 1;
    else if (f.type === "date") d[f.name] = today;
    else if (f.type === "integer" && !f.required) d[f.name] = f.defaultValue ?? 0;
    else if (f.type === "integer") d[f.name] = "";
    else d[f.name] = "";
  }
  return d;
}

export function EntryForm({ fields, onSubmit, isLoading, stockCheck, packWarning, accentColor }) {
  const schema = useMemo(() => buildSchema(fields), [fields]);
  const defaults = useMemo(() => buildDefaults(fields), [fields]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const codeField = stockCheck?.codeField || "product_code";
  const qtyField = stockCheck?.qtyField || "product_pcs_qty";
  // multiplierField: when set, effective qty sent to stock check = watch(qtyField) × watch(multiplierField)
  const multiplierField = stockCheck?.multiplierField ?? null;

  const codeVal = watch(codeField);
  const qtyVal = watch(qtyField);
  // Always call watch — pass a dummy key when multiplierField is absent so hook count stays stable.
  const multiplierRaw = watch(multiplierField ?? "__no_multiplier_field__");

  const debouncedCode = useDebouncedValue(String(codeVal ?? "").trim(), 300);
  const debouncedQty = useDebouncedValue(String(qtyVal ?? ""), 500);
  const debouncedMultiplier = useDebouncedValue(
    multiplierField != null ? String(multiplierRaw ?? "1") : "1",
    500
  );

  const [warn, setWarn] = useState(null);

  useEffect(() => {
    if (!stockCheck?.apiPath) {
      setWarn(null);
      return;
    }
    if (!debouncedCode) {
      setWarn(null);
      return;
    }
    const qtyNum = Number(debouncedQty);
    if (!Number.isFinite(qtyNum) || debouncedQty === "") {
      setWarn(null);
      return;
    }
    let cancelled = false;
    async function run() {
      try {
        const multiplierNum = Math.max(1, Number(debouncedMultiplier) || 1);
        const effectiveQty = multiplierField != null ? qtyNum * multiplierNum : qtyNum;
        const params = new URLSearchParams({
          product_code: debouncedCode,
          qty: String(effectiveQty),
          type: stockCheck.type,
        });
        const res = await fetch(`${stockCheck.apiPath}?${params}`, { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setWarn(null);
          return;
        }
        if (json.is_warning) {
          setWarn({
            current: json.current_stock,
            proposed: json.proposed_stock,
            unit: packWarning ? "boxes" : "pcs",
          });
        } else setWarn(null);
      } catch {
        if (!cancelled) setWarn(null);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [stockCheck, debouncedCode, debouncedQty, debouncedMultiplier, multiplierField, packWarning]);

  async function submit(values) {
    const cleaned = { ...values };
    for (const f of fields) {
      if (f.type === "hidden") {
        delete cleaned[f.name];
      } else if (f.type === "image_url") {
        const v = cleaned[f.name];
        cleaned[f.name] = v && v !== "" ? v : null;
      } else if (f.type === "integer" && !f.required && (cleaned[f.name] === "" || cleaned[f.name] == null)) {
        cleaned[f.name] = f.defaultValue ?? 0;
      }
    }
    await onSubmit(cleaned);
    reset(buildDefaults(fields));
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-4">
      {warn ? (
        <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          Warning: current stock is {warn.current} {warn.unit}. This entry will result in {warn.proposed} {warn.unit}{" "}
          (negative stock).
        </div>
      ) : null}

      {fields.map((field) => {
        if (field.type === "hidden") {
          return <input key={field.name} type="hidden" {...register(field.name)} />;
        }

        if (field.autocompletePath && field.name === "product_code") {
          return (
            <div key={field.name} className="block text-sm">
              <span className="font-medium text-zinc-800">{field.label}</span>
              <Controller
                name={field.name}
                control={control}
                render={({ field: f }) => (
                  <ProductCodeAutocomplete
                    value={f.value || ""}
                    onChange={f.onChange}
                    placeholder={field.placeholder}
                    onSelect={(p) => {
                      for (const fd of fields) {
                        if (Object.prototype.hasOwnProperty.call(p, fd.name)) {
                          setValue(fd.name, p[fd.name] ?? (fd.type === "integer" || fd.type === "hidden" ? 0 : ""));
                        }
                      }
                      setValue("product_code", p.product_code);
                      setValue("product_name", p.product_name ?? "");
                    }}
                    apiPath={field.autocompletePath}
                    disabled={isLoading}
                  />
                )}
              />
              {errors[field.name] ? <p className="mt-1 text-xs text-red-600">{errors[field.name].message}</p> : null}
            </div>
          );
        }

        if (field.type === "image_url") {
          return (
            <div key={field.name} className="block text-sm">
              <span className="font-medium text-zinc-800">{field.label}</span>
              <Controller
                name={field.name}
                control={control}
                render={({ field: f }) => <ImageUpload value={f.value || ""} onChange={f.onChange} disabled={isLoading} />}
              />
              {errors[field.name] ? <p className="mt-1 text-xs text-red-600">{errors[field.name].message}</p> : null}
            </div>
          );
        }

        const inputType = field.type === "integer" ? "number" : field.type === "date" ? "date" : "text";
        const inputMode = field.type === "integer" ? "numeric" : undefined;
        const errorId = `${field.name}-error`;
        return (
          <label key={field.name} className="block text-sm">
            <span className="font-medium text-zinc-800">{field.label}</span>
            <input
              id={field.name}
              type={inputType}
              inputMode={inputMode}
              step={field.type === "integer" ? 1 : undefined}
              placeholder={field.placeholder}
              disabled={isLoading}
              aria-describedby={errors[field.name] ? errorId : undefined}
              className="mt-2 min-h-[44px] w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-zinc-300"
              {...register(field.name)}
            />
            {errors[field.name] ? (
              <p id={errorId} className="mt-1 text-xs text-red-600" role="alert">
                {errors[field.name].message}
              </p>
            ) : null}
          </label>
        );
      })}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 min-h-[44px] w-full rounded-xl px-4 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: accentColor || "#18181b" }}
      >
        {isLoading ? "Saving…" : "Save entry"}
      </button>
    </form>
  );
}
