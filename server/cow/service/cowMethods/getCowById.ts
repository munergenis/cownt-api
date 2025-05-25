import CowModel, { Cow } from '../../model';

export async function getCowById(cowId: string) {
  const cow: Cow | null = await CowModel.findById(cowId).populate([
    'breed',
    'characteristics',
    'father',
    'mother',
    'children',
  ]);
  return cow;
}
