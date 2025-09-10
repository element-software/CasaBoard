"use client";
import EntityField from "../EntityAutocomplete/EntityField";

export const Test = () => {
  const onChange = (value: string | null) => {
    console.log(value);
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <EntityField
        value={""}
        onChange={onChange}
        domain="binary_sensor"
        label="Binary Sensor Entity"
        description="Select a binary sensor entity from your Home Assistant"
      />
      <EntityField
        value={""}
        onChange={onChange}
        domain="light"
        label="Light Entity"
        description="Select a light entity from your Home Assistant"
      />
    </div>
  );
};
