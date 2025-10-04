export function transformDateToISODateString( value: Date|null|undefined): string | null {
  return value ? value.toISOString().split('T')[0] : null;
}