import { CowCharacteristic, CowCharacteristicModel } from '../../model';

import { UpdateCharacteristicSchema } from '../../validation/schemas';

export async function updateCharacteristic(
  characteristicId: string,
  characteristicData: UpdateCharacteristicSchema
) {
  const updatedCharacteristic: CowCharacteristic | null =
    await CowCharacteristicModel.findByIdAndUpdate(
      characteristicId,
      characteristicData,
      { returnDocument: 'after' }
    );
  return updatedCharacteristic;
}
