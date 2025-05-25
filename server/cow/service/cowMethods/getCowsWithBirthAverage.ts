import CowModel from '../../model';

export const getCowsWithBirthAverage = async () => {
  const cows = await CowModel.find({
    children: { $exists: true, $not: { $size: 0 } },
    absence: null,
  })
    .populate('children')
    .lean();

  const cowsWithAvg = [];

  for (const cow of cows) {
    // const children = await CowModel.find({
    //   _id: { $in: cow.children },
    // })
    //   .select('birthDate')
    //   .lean();

    const timeStamps = cow.children.map((ch) => Number(ch.birthDate));
    if (timeStamps.length === 1) continue;

    let diffsSum = 0;
    let avgCounts = 1;
    let tempAvgMs = 0;

    const diffs: number[] = [];
    for (let i = 1; i < timeStamps.length; i++) {
      diffs.push(timeStamps[i] - timeStamps[i - 1]);
      avgCounts++;
    }
    diffsSum = diffs.reduce((acc, curr) => acc + curr, 0);
    tempAvgMs = diffsSum / avgCounts;

    const lastBirth = timeStamps[timeStamps.length - 1];
    const lastInterval = Date.now() - lastBirth;

    if (lastInterval > tempAvgMs) {
      avgCounts++;
      diffsSum += lastInterval;
    }

    const avgMs = diffsSum / avgCounts;
    const avgDays = Math.round(avgMs / (1000 * 60 * 60 * 24));
    cowsWithAvg.push({ ...cow, birthAverage: avgDays } as never);
  }

  const averageOfAverages = Math.round(
    cowsWithAvg.reduce(
      (acc, { birthAverage }) => acc + birthAverage,
      0 / cowsWithAvg.length
    )
  );

  return { cows: cowsWithAvg, averageOfAverages };
};
