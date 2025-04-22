import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "named",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
    },
  ],
  external: [
    "@mui/icons-material",
    "@mui/material",
    "@mui/x-date-pickers",
    "react",
    "react-dom",
    "formik",
    "react-color",
    "reactcss",
    "zustand",
    "react-easy-crop",
    "styled-components",
    "react-router-dom",
    "@react-pdf-viewer/core",
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    postcss({
      extensions: [".css"],
      extract: true, // Extracts CSS into a separate file
    }),
    babel({ babelHelpers: "bundled" }),
  ],
};
