import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

export interface PhotosphereSelectorProps {
  options: string[];
  value: string;
  setValue: (value: string) => void;
}

function PhotosphereSelector(props: PhotosphereSelectorProps) {
  return (
    <Stack
      sx={{
        width: "150px",
        padding: "0 5px",
        justifyContent: "space-around",
      }}
    >
      <FormControl>
        <InputLabel id="scene-select" sx={{ fontSize: "14px" }}>
          Scene
        </InputLabel>
        <Select
          labelId="scene-select"
          label="Scene"
          value={props.value}
          onChange={(e) => {
            props.setValue(e.target.value);
          }}
          sx={{
            fontSize: "14px",
            width: "150px",
            height: "35px",
          }}
        >
          {props.options.map((option) => (
            <MenuItem key={option} value={option} sx={{ fontSize: "13px" }}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

export default PhotosphereSelector;
