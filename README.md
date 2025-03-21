# formik-mui-components

A collection of reusable **Formik + MUI** components for building forms effortlessly in React.

## 🚀 Installation  

### Install via npm:
```sh
    npm install formik-mui-components
```
### Or install locally (for development)::
```sh
    npm install /path/to/formik-mui-components
```

## 📦 Peer Dependencies

### Ensure you have these installed in your project:
```sh
"peerDependencies": {
  "formik": "^2.4.6",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@mui/material": "^6.4.8"
}
```
### Install missing dependencies with:
```sh
npm install formik react react-dom @mui/material
```

## 🔥 Usage
### Import Components
```sh
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { CheckboxWrapper } from "formik-mui-components";
import { Button } from "@mui/material";

const validationSchema = Yup.object({
  termsAccepted: Yup.boolean()
    .oneOf([true], "You must accept the terms")
    .required("Required"),
});

function MyForm() {
  return (
    <Formik
      initialValues={{ termsAccepted: false }}
      validationSchema={validationSchema}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <CheckboxWrapper name="termsAccepted" legend="I accept the terms" />
        <Button type="submit" variant="contained">Submit</Button>
      </Form>
    </Formik>
  );
}

export default MyForm;
```

## 📜 Available Components

### This library provides the following Formik-wrapped MUI components:

    ✅ CheckboxWrapper
    🔤 TextFieldWrapper
    🔽 SelectWrapper
    🔘 RadioGroupWrapper
    📅 DatePickerWrapper
    🕒 TimePickerWrapper
    📆 DateTimePickerWrapper
    📌 SwitchWrapper
    📄 FileUploadWrapper
    🎨 ColorPickerWrapper
    🎛 SliderWrapper
    ➕ More coming soon...

## 🛠 Development
### Clone and Install
```sh
git clone https://gitlab.com/your-repo/formik-mui-components.git
cd formik-mui-components
npm install
```

### Build the Library
```sh
npm run build
```

### Test in a Local Project

In your project’s package.json, add:
```sh
"formik-mui-components": "file:../path-to-your-library"
```

Then run:
```sh
npm install
```
## 📢 Versioning & Updates

### To install a specific version of the library:
```sh
npm install formik-mui-components@1.0.0
```

To always get the latest version:
```sh
npm install formik-mui-components@latest
```

## 📝 Contributing

Feel free to open issues and pull requests.

## 📄 License

MIT License.