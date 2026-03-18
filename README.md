# @vishwa95/formik-mui-components

[![npm version](https://img.shields.io/npm/v/@vishwa95/formik-mui-components.svg)](https://www.npmjs.com/package/@vishwa95/formik-mui-components)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A collection of lightweight, type-safe, and reusable **Formik + Material UI (MUI)** components. Designed to eliminate boilerplate and make form building in React effortless.

---

## 🚀 Installation  

### Install via npm:
```sh
    npm install @vishwa95/formik-mui-components
```
### Or install locally (for development)::
```sh
    npm install /path/to/formik-mui-components
```

## 🛡️ Critical Security Requirement

This library uses `@react-pdf-viewer/core` for file previews. Due to transitive vulnerabilities in the underlying `pdfjs-dist` and `tar` packages (GHSA-wgrm-67xf-hhpq), you **must** add the following `overrides` to your **root project's** `package.json` to ensure a secure build:

```json
"overrides": {
  "pdfjs-dist": "4.10.38",
  "tar": "7.5.3"
}
```

## 📦 Peer Dependencies

To keep the bundle size small and avoid version conflicts, ensure your project has the following installed:
```sh
"peerDependencies": {
  "formik": "^2.4.6",
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "@mui/material": "^6.0.0 || ^7.0.0",
  "@mui/icons-material": "^6.0.0 || ^7.0.0",
  "styled-components": "^6.1.0"
}
```

## 🔥 Usage

The components are wrappers around MUI elements that automatically connect to the Formik context using the name prop.
### Example: Standard Form
```sh
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextFieldWrapper, CheckboxWrapper, FileUploadWrapper } from "@vishwa95/formik-mui-components";
import { Button } from "@mui/material";

const validationSchema = Yup.object({
  username: Yup.string().required("Required"),
  profilePic: Yup.mixed().required("A file is required"),
});

function MyForm() {
  return (
    <Formik
      initialValues={{ username: "", profilePic: null }}
      validationSchema={validationSchema}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <TextFieldWrapper name="username" label="Username" fullWidth />
        
        <FileUploadWrapper 
            name="profilePic" 
            label="Drag and drop your profile picture" 
        />

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </Button>
      </Form>
    </Formik>
  );
}
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

### Testing locally in another project

In the library directory:
```sh
npm link
```

In your target project directory:
```sh
npm link @vishwa95/formik-mui-components
```

#### or

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
npm install @vishwa95/formik-mui-components@1.0.0
```

To always get the latest version:
```sh
npm install @vishwa95/formik-mui-components@latest
```

## 📝 Contributing

Feel free to open issues and pull requests.

## 📄 License

MIT © Vishwa Mahanama Muthukumarana

---

### One Final Tip
Since you are using `styled-components` in your library, ensure that you have it listed in your `peerDependencies` in `package.json` as well (v6.0.0 or higher), as users will need it to render the components correctly.



**Would you like me to help you create a .npmignore file to make sure you don't upload unnecessary source files to the registry?**