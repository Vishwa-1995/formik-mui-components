import React from "react";
import { useField, useFormikContext } from "formik";
import {
  Autocomplete,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const ChipsInputWrapper = ({
  name,
  options,
  freeSolo,
  filterSelectedOptions,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const configChipsInput = {
    ...otherProps,
    variant: "outlined",
    fullWidth: true,
  };

  if (meta && meta.error) {
    configChipsInput.error = true;
    configChipsInput.helperText = meta.error;
  }

  function handleChange(event, newValue) {
    setFieldValue(name, newValue);
  }

  return (
    <Autocomplete
  //     multiple
  //     options={options}
  //     getOptionLabel={(option) => option?.label}
  //     isOptionEqualToValue={(option, value) => {
  //       if (typeof option === "string") return option === value;
  //       else return option?.value === value?.value;
  //     }}
  //     value={[...field.value]}
  //     filterSelectedOptions={filterSelectedOptions}
  //     freeSolo={freeSolo}
  //     onChange={handleChange}
  //     renderTags={(value, getTagProps) =>
  //       value.map((option, index) => {
  //         return (
  //           <Chip
  //             key={options.length ? option.value : option}
  //             tabIndex={-1}
  //             label={options.length ? option.label : option}
  //             color="primary"
  //             // avatar={
  //             //   <Avatar>
  //             //     <Typography variant="caption" color={"#fff"}>
  //             //       {option.mask_type === 1 ? "P" : "T"}
  //             //     </Typography>
  //             //   </Avatar>
  //             // }
  //             {...getTagProps({ index })}
  //           />
  //         );
  //       })
  //     }
  //     renderInput={(params) => (
  //       <TextField {...params} {...configChipsInput} margin="dense" />
  //     )}
  //     renderOption={(props, option) => {
  //       return (
  //         <Stack
  //           direction={"row"}
  //           spacing={2}
  //           justifyItems={"space-between"}
  //           {...props}
  //         >
  //           <Typography>{option.label}</Typography>
  //           <Typography variant="caption" color={"gray"}>
  //             {option.mask_type === 1 ? "(Promotional)" : "(Transactional)"}
  //           </Typography>
  //         </Stack>
  //       );
  //     }}
  //   />
  // );
  multiple
      freeSolo={freeSolo}
      onChange={handleChange}
      options={options}
      noOptionsText="No Options"
      getOptionLabel={(option) => option?.label}
      isOptionEqualToValue={(option, value) => {
        if (typeof option === "string") return option === value;
        else return option?.value === value?.value;
      }}
      value={[...field.value]}
      filterSelectedOptions={filterSelectedOptions}
      renderTags={(value, getTagProps) => {
        console.log(value);
        return value
          .filter((item) => typeof item !== "string")
          .map((option, index) => {
            return (
              <Chip
                key={options.length ? option.value : option}
                tabIndex={-1}
                label={options.length ? option.label : option}
                color="primary"
                {...getTagProps({ index })}
              />
            );
          });
      }}
      renderInput={(params) => <TextField {...params} {...configChipsInput} margin="dense" />}
      renderOption={(props, option) => {
        return <Typography {...props}>{option.label}</Typography>;
      }}
    />
  );
};

export default ChipsInputWrapper;
