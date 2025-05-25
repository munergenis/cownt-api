import { CowBreed, CowBreedModel } from '../../model';

import { CreateBreedSchema } from '../../validation/schemas';

export async function createBreed(breedData: CreateBreedSchema) {
  const newBreed: CowBreed = await CowBreedModel.create(breedData);
  return newBreed;
}
