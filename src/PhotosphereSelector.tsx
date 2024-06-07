import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export interface PhotosphereSelectorProps {
  options: string[];
  value: string;
  setValue: (value: string) => void;
  size?: "medium" | "small";
}

function PhotosphereSelector({
  options,
  value,
  setValue,
  size = "medium",
}: PhotosphereSelectorProps) {
  // Helper function to reduce ternary/undefined repetition.
  function ifSmall<T, D>(value: T, defaultValue?: D): T | D | undefined {
    return size === "small" ? value : defaultValue;
  }

  return (
    <FormControl size={size}>
      <InputLabel id="scene-select" sx={ifSmall({ fontSize: "14px" })}>
        Scene
      </InputLabel>
      <Select
        labelId="scene-select"
        label="Scene"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        sx={ifSmall(
          {
            fontSize: "14px",
            width: "150px",
            height: "35px",
          },
          { minWidth: "150px" },
        )}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={ifSmall({ fontSize: "13px" })}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default PhotosphereSelector;
