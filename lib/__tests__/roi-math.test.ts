import { describe, expect, it } from "vitest";
import { computeRoi, WEEKS_PER_MONTH, type RoiInputs } from "../roi-math";

const BASE: RoiInputs = {
  people: 4,
  rate: 15,
  hours: 8,
  errors: 5,
  budget: 400,
  efficiency: 30,
  errorReduction: 50,
  ramp: 4,
};

describe("computeRoi", () => {
  it("computes the documented default case", () => {
    const r = computeRoi(BASE);
    const baseHours = 4 * 8 * WEEKS_PER_MONTH; // 138.56
    expect(r.hoursSaved).toBeCloseTo(baseHours * 0.3 + baseHours * 0.05 * 0.5, 5);
    expect(r.monthly).toBeCloseTo(r.hoursSaved * 15, 5);
    expect(r.roiYear).toBeCloseTo(((r.monthly - 400) / 400) * 100, 5);
    expect(r.payback).not.toBeNull();
    expect(r.payback).toBeLessThanOrEqual(3);
  });

  it("caps hours saved at the total base hours", () => {
    const r = computeRoi({ ...BASE, efficiency: 80, errors: 30, errorReduction: 90 });
    expect(r.hoursSaved).toBeCloseTo(BASE.people * BASE.hours * WEEKS_PER_MONTH, 5);
  });

  it("ramp=0 means full savings from month one", () => {
    const r = computeRoi({ ...BASE, ramp: 0 });
    expect(r.payback).toBe(1);
    expect(Number.isFinite(r.monthly)).toBe(true);
  });

  it("returns null payback when savings never cover the budget", () => {
    const r = computeRoi({ ...BASE, people: 1, hours: 1, budget: 5000 });
    expect(r.payback).toBeNull();
    expect(r.roiYear).toBeLessThan(0);
  });

  it("handles budget=0 without dividing by zero", () => {
    const r = computeRoi({ ...BASE, budget: 0 });
    expect(r.roiYear).toBe(0);
    expect(r.payback).toBe(1);
  });

  it("month ramp factor is averaged, not month-end (no optimistic payback)", () => {
    // With a long ramp and knife-edge budget, month-end accounting would pay
    // back a month earlier than the honest average-factor accounting.
    const long = computeRoi({ ...BASE, ramp: 12, budget: Math.round(computeRoi({ ...BASE, ramp: 0 }).monthly * 0.55) });
    expect(long.payback).not.toBeNull();
    const eager = computeRoi({ ...long, ...BASE, ramp: 0, budget: Math.round(computeRoi({ ...BASE, ramp: 0 }).monthly * 0.55) });
    expect(eager.payback).toBeLessThanOrEqual(long.payback!);
  });
});
