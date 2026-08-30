export const WEEKS_PER_MONTH = 4.33;

export type RoiInputs = {
  people: number;
  rate: number;
  hours: number;
  /** Error / rework rate in % */
  errors: number;
  /** Monthly budget for the solution in EUR */
  budget: number;
  /** Efficiency gain from AI in % */
  efficiency: number;
  /** Error-rate reduction in % */
  errorReduction: number;
  /** Implementation ramp-up in weeks */
  ramp: number;
};

export type RoiResult = {
  hoursSaved: number;
  monthly: number;
  roiYear: number;
  payback: number | null;
};

/** Ramp completion factor at a point in time (weeks since start). */
function rampFactor(weeks: number, ramp: number) {
  return ramp > 0 ? Math.min(1, weeks / ramp) : 1;
}

export function computeRoi({
  people,
  rate,
  hours,
  errors,
  budget,
  efficiency,
  errorReduction,
  ramp,
}: RoiInputs): RoiResult {
  const baseHours = people * hours * WEEKS_PER_MONTH;
  const effHours = baseHours * (efficiency / 100);
  const errorHours = baseHours * (errors / 100) * (errorReduction / 100);
  const hoursSaved = Math.min(baseHours, effHours + errorHours);
  const monthly = hoursSaved * rate;
  const net = monthly - budget;
  const roiYear = budget > 0 ? (net / budget) * 100 : 0;

  // Payback: savings ramp up linearly over `ramp` weeks; find the first month
  // where cumulative net is non-negative. Each month contributes the AVERAGE
  // ramp factor across that month (not the optimistic month-end value).
  let payback: number | null = null;
  let cumulative = 0;
  for (let month = 1; month <= 36; month++) {
    const factor =
      (rampFactor((month - 1) * WEEKS_PER_MONTH, ramp) +
        rampFactor(month * WEEKS_PER_MONTH, ramp)) /
      2;
    cumulative += monthly * factor - budget;
    if (cumulative >= 0) {
      payback = month;
      break;
    }
  }

  return { hoursSaved, monthly, roiYear, payback };
}
