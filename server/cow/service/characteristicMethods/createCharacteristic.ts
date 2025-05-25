import { CowCharacteristic, CowCharacteristicModel } from '../../model';

import { CreateCharacteristicSchema } from '../../validation/schemas';

export async function createCharacteristic(
  characteristicData: CreateCharacteristicSchema
) {
  const newCharacteristic: CowCharacteristic =
    await CowCharacteristicModel.create(characteristicData);
  return newCharacteristic;
}
