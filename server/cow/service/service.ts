import {
  createBreed,
  deleteBreed,
  getAllBreeds,
  updateBreed,
} from './breedMethods';
import {
  createCharacteristic,
  deleteCharacteristic,
  getAllCharacteristics,
  updateCharacteristic,
} from './characteristicMethods';
import {
  createCow,
  deleteCow,
  getAllCows,
  getCowById,
  getCowsWithBirthAverage,
  updateCow,
} from './cowMethods';

const service = {
  // Cow methods
  getAllCows,
  getCowById,
  createCow,
  deleteCow,
  updateCow,

  // Statistics methods
  getCowsWithBirthAverage,

  // Breed methods
  getAllBreeds,
  createBreed,
  deleteBreed,
  updateBreed,

  // Characteristic methods
  getAllCharacteristics,
  createCharacteristic,
  deleteCharacteristic,
  updateCharacteristic,
};

export default service;
