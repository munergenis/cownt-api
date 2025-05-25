import { CowBreed, CowBreedModel } from '../../model';

export async function getAllBreeds() {
  const breeds: CowBreed[] = await CowBreedModel.find({});
  return breeds;
}
