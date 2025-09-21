"use client";
import React from 'react';
import { EntityAutocomplete } from './EntityAutocomplete';
import { DefinedPropertiesByDomain } from '@hakit/core';

interface EntityFieldProps {
  value?: string;
  onChange: (value: string | null) => void;
  domain?: keyof DefinedPropertiesByDomain | "binary_sensor";
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const EntityField: React.FC<EntityFieldProps> = ({
  value,
  onChange,
  domain,
  label = "Entity",
  description,
  disabled = false,
}) => {
  return (
    <EntityAutocomplete
      value={value}
      onChange={onChange}
      domain={domain}
      label={label}
      description={description}
      disabled={disabled}
      allowClear={true}
      showEntityState={true}
      showEntityIcon={true}
    />
  );
};

export default EntityField;
