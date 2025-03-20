import { useField } from "formik";

const GetFormField = ({ name }) => {
  const [field] = useField(name);
  return field.value;
};

export default GetFormField;
