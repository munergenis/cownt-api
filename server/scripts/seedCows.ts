import { COW_SHORT_CODE_LAST_CHARS_NUM, ORIGIN, SEX } from '../consts';
import mongoose, { Types } from 'mongoose';

import CowModel from '../cow/model';
import { connectDB } from '../db/config';

async function seedCows() {
  // Conectar a la base de datos
  await connectDB();

  // IDs reales de caracteres disponibles
  const charCoixera = new Types.ObjectId('67db3e158f0cd15fbf235583');
  const charMalCaracter = new Types.ObjectId('67dc0e98d58885ca877e6a0a');
  const charMalaLlet = new Types.ObjectId('67dc0ec2d58885ca877e6a0b');
  const charBerguerGros = new Types.ObjectId('67dc0eead58885ca877e6a0c');

  // IDs reales de razas disponibles
  const breedCreuada = new Types.ObjectId('67db806a5c3ac17f8dc736b3');
  const breedLlimosina = new Types.ObjectId('67dc0de2d58885ca877e6a07');
  const breedSalers = new Types.ObjectId('67dc0e65d58885ca877e6a08');
  const breedXarolesa = new Types.ObjectId('67dc0e73d58885ca877e6a09');

  // IDs fijos para relaciones padre/madre
  const cow1Id = new Types.ObjectId('60d5ec49f1d2f8b0e4c5a1f1');
  const cow2Id = new Types.ObjectId('60d5ec49f1d2f8b0e4c5a1f2');
  const cow3Id = new Types.ObjectId('60d5ec49f1d2f8b0e4c5a1f3');
  const cow4Id = new Types.ObjectId('60d5ec49f1d2f8b0e4c5a1f4');
  const cow5Id = new Types.ObjectId('60d5ec49f1d2f8b0e4c5a1f5');
  const cow6Id = new Types.ObjectId('60d5ec49f1d2f8b0e4c5a1f6');

  try {
    // Limpiar colección
    await CowModel.deleteMany({});

    // Datos de prueba con IDs reales
    const cowsData = [
      {
        _id: cow1Id,
        longCode: 'COW0000000001',
        breed: breedCreuada,
        sex: SEX.F,
        birthDate: String(new Date('2022-11-10').getTime()),
        weight: '500',
        origin: ORIGIN.BOUGHT,
        buyPrice: 1100,
        salePrice: null,
        absence: null,
        startReprodDate: String(new Date('2024-02-15').getTime()),
        birthAverage: null,
        characteristics: [charBerguerGros],
        mother: null,
        father: null,
        children: [cow4Id, cow5Id],
      },
      {
        _id: cow2Id,
        longCode: 'COW0000000002',
        breed: breedSalers,
        sex: SEX.M,
        birthDate: String(new Date('2021-06-05').getTime()),
        weight: '620',
        origin: ORIGIN.BOUGHT,
        buyPrice: 1400,
        salePrice: null,
        absence: null,
        startReprodDate: null,
        birthAverage: null,
        characteristics: [charMalCaracter],
        mother: null,
        father: null,
        children: [cow4Id],
      },
      {
        _id: cow3Id,
        longCode: 'COW0000000003',
        breed: breedCreuada,
        sex: SEX.M,
        birthDate: String(new Date('2023-03-20').getTime()),
        weight: '475',
        origin: ORIGIN.BOUGHT,
        buyPrice: null,
        salePrice: null,
        absence: null,
        startReprodDate: null,
        birthAverage: null,
        characteristics: [charCoixera, charMalCaracter],
        mother: null,
        father: null,
        children: [cow5Id],
      },
      {
        _id: cow4Id,
        longCode: 'COW0000000004',
        breed: breedCreuada,
        sex: SEX.F,
        birthDate: String(new Date('2025-01-15').getTime()),
        weight: '320',
        origin: ORIGIN.BORN,
        buyPrice: null,
        salePrice: null,
        absence: null,
        startReprodDate: String(new Date('2025-07-15').getTime()),
        birthAverage: null,
        characteristics: [charMalaLlet],
        mother: cow1Id,
        father: cow2Id,
        children: [cow6Id],
      },
      {
        _id: cow5Id,
        longCode: 'COW0000000005',
        breed: breedCreuada,
        sex: SEX.M,
        birthDate: String(new Date('2025-08-15').getTime()),
        weight: '320',
        origin: ORIGIN.BORN,
        buyPrice: null,
        salePrice: null,
        absence: null,
        startReprodDate: String(new Date('2026-02-15').getTime()),
        birthAverage: '8.3',
        characteristics: [],
        mother: cow1Id,
        father: cow2Id,
        children: [cow6Id],
      },
      {
        _id: cow6Id,
        longCode: 'COW0000000006',
        breed: breedCreuada,
        sex: SEX.F,
        birthDate: String(new Date('2025-08-15').getTime()),
        weight: '320',
        origin: ORIGIN.BORN,
        buyPrice: null,
        salePrice: null,
        absence: null,
        startReprodDate: String(new Date('2026-02-15').getTime()),
        birthAverage: '8.3',
        characteristics: [charMalaLlet],
        mother: cow4Id,
        father: cow5Id,
        children: [],
      },
    ];

    // Agregar shortCode y guardar
    const cowsWithShort = cowsData.map((cow) => ({
      ...cow,
      shortCode: cow.longCode.slice(-COW_SHORT_CODE_LAST_CHARS_NUM),
    }));

    await CowModel.insertMany(cowsWithShort);
    console.log('🎉 Seed de cows completado con datos reales');
  } catch (error) {
    console.error('Error durante el seed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedCows();
