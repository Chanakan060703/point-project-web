import React from 'react';
import { useController, Control, FieldValues, Path } from 'react-hook-form';
import { Select } from './Select';

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: { value: string; label: string }[];
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  options
}: FormSelectProps<T>) {
  const {
    field: { ref, ...field },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <Select
      {...field}
      selectRef={ref}
      label={label}
      options={options}
      error={error?.message}
    />
  );
}
