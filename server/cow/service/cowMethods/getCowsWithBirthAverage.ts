import CowModel, { Cow } from '../../model';
import {
  calculateBirthAverages,
  calculateOverallAverage,
} from '../utils/helpers';

import { transformLeanDoc } from '../utils/transform';

type ExtendedCow = object & {
  birthAverageDays: number | null;
  lastIntervalDays: number;
};
interface CowWithChildren extends Omit<Cow, 'children'> {
  children: Cow[];
}

export async function getCowsWithBirthAverage(): Promise<{
  cows: Array<
    object & {
      birthAverageDays: number | null;
      lastIntervalDays: number;
    }
  >;
  averageOfAverages: number | null;
}> {
  // ---------------------------------------------------------------
  // 1. Query: female cows with at least one child and no absence flag
  // ---------------------------------------------------------------
  const cows = await CowModel.find({
    children: { $exists: true, $not: { $size: 0 } },
    absence: null,
    sex: 'f',
  })
    .populate('children', 'birthDate')
    .lean<CowWithChildren[]>();

  const results: ExtendedCow[] = [];
  const validAverages: number[] = [];

  // ---------------------------------------------------------------
  // 2. Iterate: apply calculation helpers per cow
  // ---------------------------------------------------------------
  for (const rawCow of cows) {
    const cow = transformLeanDoc(rawCow);
    const children = cow.children.map((child) => transformLeanDoc(child));

    // Extract and sort birth timestamps
    const birthTimestamps = children
      .map((child) => Number(child.birthDate))
      .sort((a, b) => a - b);

    // Use pure function to get stats
    const { overallAverageDays, lastIntervalDays } =
      calculateBirthAverages(birthTimestamps);

    // Collect enriched cow record
    results.push({
      ...cow,
      children,
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
