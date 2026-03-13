export const unwrapOne = <T>(data: T | T[]): T => {
  if (Array.isArray(data)) {
    return data[0];
  }
  return data;
};
