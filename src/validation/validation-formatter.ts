import { ValidationError } from '@nestjs/common';

export interface FormattedValidationError {
  field: string;
  constraints: string[];
  children?: FormattedValidationError[];
}

export function formatValidationErrors(errors: ValidationError[]): FormattedValidationError[] {
  return errors.map((error) => {
    const formatted: FormattedValidationError = {
      field: error.property,
      constraints: error.constraints ? Object.values(error.constraints) : [],
    };

    if (error.children?.length) {
      formatted.children = formatValidationErrors(error.children);
    }

    return formatted;
  });
}
