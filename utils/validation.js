const isString = (element) => typeof element === "string";
const isStringEmpty = (string) =>
  string.length === 0 || string.trim().length === 0;
const isStringLengthValid = (string, range) => {
  const [min, max] = range;
  if (string.length < min || string.length > max) {
    return false;
  }
  return true;
};

const isInteger = (element) => Number.isInteger(Number(element));
const isIntegerInRange = (number, range) => {
  const [min, max] = range;
  if (number < min || number > max) {
    return false;
  }
  return true;
};

const isArray = (element) => Array.isArray(element);

export const isFileValid = (file) => {
  const validMimetypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (validMimetypes.includes(file.mimetype)) {
    return true;
  }
  return false;
};

export const validate = (object, schema) => {
  for (let key in object) {
    const isInSchema = Object.keys(schema).includes(key);
    if (isInSchema) {
      const objectValue = object[key];
      const schemaValue = schema[key];

      if (isArray(objectValue)) {
        const array = objectValue;
        for (let element of array) {
          const error = validate(element, schemaValue);
          if (error) {
            return error;
          }
        }
      }

      if (schemaValue.type === "string") {
        if (!isString(objectValue)) {
          return { message: `${key} must be a ${schemaValue.type}` };
        }
        if (isStringEmpty(objectValue)) {
          return { message: `${key} is empty` };
        }
        if (
          schemaValue.range &&
          !isStringLengthValid(objectValue, schemaValue.range)
        ) {
          return {
            message: `${key} must contain between ${schemaValue.range[0]} and ${schemaValue.range[1]} characters`
          };
        }
      }

      if (schemaValue.type === "integer") {
        if (!isInteger(objectValue)) {
          return { message: `${key} must be an ${schemaValue.type}` };
        }
        if (
          schemaValue.range &&
          !isIntegerInRange(objectValue, schemaValue.range)
        ) {
          return {
            message: `${key} must be between ${schemaValue.range[0]} and ${schemaValue.range[1]}`
          };
        }
      }
    }
  }

  return false;
};
