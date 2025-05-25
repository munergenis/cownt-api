import { CowBreed, CowBreedModel } from '../../model';

import { UpdateBreedSchema } from '../../validation/schemas';

export async function updateBreed(
  breedId: string,
  breedData: UpdateBreedSchema
) {
  const updatedBreed: CowBreed | null = await CowBreedModel.findByIdAndUpdate(
    breedId,
    breedData,
    { returnDocument: 'after' }
  );
  return updatedBreed;
}
