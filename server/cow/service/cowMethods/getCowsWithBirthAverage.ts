import CowModel, { Cow } from '../../model';
import {
  calculateBirthAverages,
  calculateOverallAverage,
} from '../utils/helpers';

type ExtendedCow = object & {
  birthAverageDays: number | null;
  lastIntervalDays: number;
};
interface CowWithChildren extends Omit<Cow, 'children'> {
  children: Cow[];
}

export async function getCowsWithBirthAverage(): Promise<{
  cows: Array<
    object & { birthAverageDays: number | null; lastIntervalDays: number }
  >;
  averageOfAverages: number | null;
}> {
  // ---------------------------------------------------------------
  // 1. Query: cows with at least one child and no absence flag
  // ---------------------------------------------------------------
  const cows = await CowModel.find({
    children: { $exists: true, $not: { $size: 0 } },
    absence: null,
  })
    .populate('children')
    .lean<CowWithChildren[]>();

  const results: ExtendedCow[] = [];
  const validAverages: number[] = [];

  // ---------------------------------------------------------------
  // 2. Iterate: apply calculation helpers per cow
  // ---------------------------------------------------------------
  for (const cow of cows) {
    // Extract and sort birth timestamps
    const birthTimestamps = cow.children
      .map((child) => Number(child.birthDate))
      .sort((a, b) => a - b);

    // Use pure function to get stats
    const { overallAverageDays, lastIntervalDays } =
      calculateBirthAverages(birthTimestamps);

    // Collect enriched cow record
    results.push({
      ...cow,
      birthAverageDays: overallAverageDays,
      lastIntervalDays,
    });

    // Track non-null averages for final aggregate
    if (overallAverageDays !== null) {
      validAverages.push(overallAverageDays);
    }
  }

  // ---------------------------------------------------------------
  // 3. Compute final aggregate average across cows
  // ---------------------------------------------------------------
  const averageOfAverages = calculateOverallAverage(validAverages);

  return { cows: results, averageOfAverages };
}
