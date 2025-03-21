import { z } from "zod";
import CowModel, { CowBreedModel, CowCharacteristicModel } from "../model";
import { ABSENCE, ORIGIN, SEX } from "../../consts";
import { Types } from "mongoose";

// Cow Create/Update Schemas
export type CreateCowSchema = z.infer<typeof createCowSchema>;
export const createCowSchema = z
  .object({
    longCode: z
      .string()
      .min(10)
      .max(16)
      .refine(validateLongCode, "longCode already exists"),
    breed: z
      .string()
      .refine(
        async (id) => await checkBreedExistsById(id, true),
        "Breed does not exist"
      ),
    sex: z.nativeEnum(SEX),
    birthDate: z
      .string()
      .optional()
      .refine(
        validateDate,
        "birthDate must be a valid date timestamp in milliseconds"
      ),
    weight: z.string().min(1).max(10).optional(),
    origin: z.nativeEnum(ORIGIN),
    buyPrice: z.number().nonnegative().int().optional(),
    salePrice: z.number().nonnegative().int().optional(),
    absence: z.nativeEnum(ABSENCE).nullable(),
    startReprodDate: z
      .string()
      .optional()
      .refine(
        validateDate,
        "startReprodDate must be a valid date timestamp in milliseconds"
      ),
    characteristics: z
      .array(
        z
          .string()
          .refine(
            async (id) => await checkCharacteristicExistsById(id, true),
            "characteristic does not exist"
          )
      )
      .optional(),
    father: z
      .string()
      .optional()
      .refine(validateCowExists, "Cow does not exist"),
    mother: z
      .string()
      .optional()
      .refine(validateCowExists, "Cow does not exist"),
    children: z
      .array(z.string().refine(validateCowExists, "Cow does not exist"))
      .optional(),
  })
  .refine(
    ({ mother, origin }) => validateMotherAndOrigin(mother, origin),
    "Both parents must be passed if origin is 'born' and null if origin is 'bought'"
  );

export type UpdateCowSchema = z.infer<typeof updateCowSchema>;
export const updateCowSchema = z.object({
  weight: z.string().min(1).max(10).nullable().optional(),
  buyPrice: z.number().nonnegative().int().nullable().optional(),
  salePrice: z.number().nonnegative().int().nullable().optional(),
  absence: z.nativeEnum(ABSENCE).nullable().optional(),
  characteristics: z
    .array(
      z
        .string()
        .refine(
          async (id) => await checkCharacteristicExistsById(id, true),
          "characteristic does not exist"
        )
    )
    .optional(),
});

// Breed Create/Update Schemas
export type CreateBreedSchema = z.infer<typeof createBreedSchema>;
export const createBreedSchema = z.object({
  value: z
    .string()
    .min(2)
    .max(20)
    .refine(
      async (value) => await checkBreedExistsByValue(value, false),
      "Breed already exists"
    ),
});
export type UpdateBreedSchema = z.infer<typeof updateBreedSchema>;
export const updateBreedSchema = createBreedSchema.partial();

// Characteristics Create/Update Schemas
export type CreateCharacteristicSchema = z.infer<
  typeof createCharacteristicSchema
>;
export const createCharacteristicSchema = z.object({
  value: z
    .string()
    .min(2)
    .max(20)
    .refine(
      async (value) => await checkCharacteristicExistsByValue(value, false),
      "Characteristic already exist"
    ),
});
export type UpdateCharacteristicSchema = z.infer<
  typeof updateCharacteristicSchema
>;
export const updateCharacteristicSchema = createCharacteristicSchema.partial();

// Refine validation functions
async function validateLongCode(longCode: string) {
  const codeExists = await CowModel.findOne({ longCode });
  let canCreateNew: Boolean = true;

  if (codeExists) {
    canCreateNew = false;
  }
  return canCreateNew;
}

async function checkBreedExistsById(id: string, shouldExist: boolean) {
  if (!Types.ObjectId.isValid(id)) {
    return false;
  }
  const breed = await CowBreedModel.findById(id);

  return shouldExist ? breed !== null : breed === null;
}
async function checkBreedExistsByValue(value: string, shouldExist: boolean) {
  const breed = await CowBreedModel.findOne({ value });

  return shouldExist ? breed !== null : breed === null;
}

async function checkCharacteristicExistsById(id: string, shouldExist: boolean) {
  if (!Types.ObjectId.isValid(id)) {
    return false;
  }
  const characteristic = await CowCharacteristicModel.findById(id);
  return shouldExist ? characteristic !== null : characteristic === null;
}
async function checkCharacteristicExistsByValue(
  value: string,
  shouldExist: boolean
) {
  const characteristic = await CowCharacteristicModel.findOne({ value });

  return shouldExist ? characteristic !== null : characteristic === null;
}

function validateDate(val: string) {
  const ms = Number(val);
  return !isNaN(ms) && !isNaN(new Date(ms).getTime());
}

async function validateCowExists(id: string) {
  const isValid = Types.ObjectId.isValid(id);
  if (!isValid) {
    return false;
  }
  const cow = await CowModel.findById(id);
  return cow !== null;
}

// TODO: afegir valildació de dataNaix si origen es BORN
function validateMotherAndOrigin(mother: string | undefined, origin: ORIGIN) {
  const motherProvided = Boolean(mother) === true;

  if (origin === ORIGIN.BORN) {
    return motherProvided;
  }
  if (origin === ORIGIN.BOUGHT) {
    return !motherProvided;
  }
  return false;
}
