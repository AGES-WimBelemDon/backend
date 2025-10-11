import { TransformFnParams } from 'class-transformer';

export function transformDateStringToDate({ value }: TransformFnParams): Date | undefined {
  return value ? new Date(value) : undefined;
}