import { Form } from './form.entity';
import { FormType } from '@prisma/client';

export interface FormRepository {
  findAll(): Promise<Form[]>;
  findByType(type: FormType): Promise<Form | null>;
}

