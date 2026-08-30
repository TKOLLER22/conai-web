"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";

const WEEKS_PER_MONTH = 4.33;

type FieldProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
};

function Field({ label, value, onChange, min, max, step = 1 }: FieldProps) {
  const id = label.replace(/\W+/g, "-").toLowerCase();
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-sm text-fg-muted">
          {label}
        </label>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
          className="w-24 rounded-lg border border-line bg-ink-800 px-3 py-1.5 text-right font-mono text-sm tabular-nums focus:border-brand-400 focus:outline-none"
          aria-label={label}
        />
      </div>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-brand-500"
      />
    </div>
  );
}

export default function Calculator() {
  const t = useTranslations("pricing.roi");
  const tCta = useTranslations("common.cta");
  const locale = useLocale();

  const [people, setPeople] = useState(4);
  const [rate, setRate] = useState(15);
  const [hours, setHours] = useState(8);
  const [errors, setErrors] = useState(5);
  const [budget, setBudget] = useState(400);
  const [efficiency, setEfficiency] = useState(30);
  const [errorReduction, setErrorReduction] = useState(50);
  const [ramp, setRamp] = useState(4);

  const result = useMemo(() => {
    const baseHours = people * hours * WEEKS_PER_MONTH;
    const effHours = baseHours * (efficiency / 100);
    const errorHours = baseHours * (errors / 100) * (errorReduction / 100);
    const hoursSaved = Math.min(baseHours, effHours + errorHours);
    const monthly = hoursSaved * rate;
    const net = monthly - budget;
    const roiYear = budget > 0 ? (net / budget) * 100 : 0;

    // Payback: linear ramp-up over `ramp` weeks, month where cumulative net ≥ 0.
    let payback: number | null = null;
    let cumulative = 0;
    for (let month = 1; month <= 36; month++) {
      const rampFactor = ramp > 0 ? Math.min(1, (month * WEEKS_PER_MONTH) / ramp) : 1;
      cumulative += monthly * rampFactor - budget;
      if (cumulative >= 0) {
        payback = month;
        break;
      }
    }

    return { hoursSaved, monthly, roiYear, payback };
  }, [people, rate, hours, errors, budget, efficiency, errorReduction, ramp]);

  const nf = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale],
  );
  const eur = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
      <div className="flex flex-col gap-8">
        <Field label={t("inputs.people")} value={people} onChange={setPeople} min={1} max={50} />
        <Field label={t("inputs.rate")} value={rate} onChange={setRate} min={5} max={100} />
        <Field label={t("inputs.hours")} value={hours} onChange={setHours} min={1} max={40} />
        <Field label={t("inputs.errors")} value={errors} onChange={setErrors} min={0} max={30} />
        <Field label={t("inputs.budget")} value={budget} onChange={setBudget} min={100} max={5000} step={50} />

        <details className="group rounded-2xl border border-line p-6">
          <summary className="cursor-pointer list-none font-mono text-xs uppercase tracking-[0.14em] text-fg-muted transition-colors hover:text-fg">
            {t("advanced.title")}{" "}
            <span aria-hidden className="inline-block transition-transform group-open:rotate-90">
              →
            </span>
          </summary>
          <div className="mt-7 flex flex-col gap-8">
            <Field label={t("advanced.efficiency")} value={efficiency} onChange={setEfficiency} min={5} max={80} />
            <Field label={t("advanced.errorReduction")} value={errorReduction} onChange={setErrorReduction} min={0} max={90} />
            <Field label={t("advanced.ramp")} value={ramp} onChange={setRamp} min={0} max={12} />
          </div>
        </details>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-ink-850 p-8 md:p-10">
          <div
            aria-hidden
            className="aura-brand absolute -right-1/2 -top-1/2 h-[40rem] w-[40rem] opacity-40"
          />
          <p className="relative font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
            {t("results.title")}
          </p>
          <dl className="relative mt-8 flex flex-col gap-7">
            <div>
              <dt className="text-sm text-fg-muted">{t("results.hours")}</dt>
              <dd className="text-display mt-1 text-4xl">{nf.format(result.hoursSaved)} h</dd>
            </div>
            <div>
              <dt className="text-sm text-fg-muted">{t("results.monthly")}</dt>
              <dd className="text-display text-gradient-brand mt-1 text-5xl md:text-6xl">
                {eur.format(result.monthly)}
              </dd>
            </div>
            <div className="flex gap-12">
              <div>
                <dt className="text-sm text-fg-muted">{t("results.roi")}</dt>
                <dd className="text-display mt-1 text-3xl">
                  {result.roiYear > 0 ? "+" : ""}
                  {nf.format(result.roiYear)} %
                </dd>
              </div>
              <div>
                <dt className="text-sm text-fg-muted">{t("results.payback")}</dt>
                <dd className="text-display mt-1 text-3xl">
                  {result.payback
                    ? t("results.paybackValue", { months: result.payback })
                    : t("results.paybackNever")}
                </dd>
              </div>
            </div>
          </dl>
          <div className="relative mt-10">
            <Button href="/book-audit">{tCta("bookAudit")}</Button>
          </div>
        </div>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-fg-faint">
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}
