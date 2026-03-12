import React from 'react';
import { useController, Control, FieldValues, Path } from 'react-hook-form';
import { Input } from './Input';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeholder?: string;
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder
}: FormInputProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <Input
      {...field}
      label={label}
      type={type}
      placeholder={placeholder}
      error={error?.message}
    />
  );
}
