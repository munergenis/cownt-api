import { CowCharacteristic, CowCharacteristicModel } from '../../model';

export async function getAllCharacteristics() {
  const characteristics: CowCharacteristic[] =
    await CowCharacteristicModel.find({});
  return characteristics;
}
