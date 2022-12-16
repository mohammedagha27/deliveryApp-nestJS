export function toNumber(value: string, defaultValue: number): number {
  const newValue: number = Number.parseInt(value);

  if (Number.isNaN(newValue)) {
    return defaultValue;
  }

  return newValue;
}
