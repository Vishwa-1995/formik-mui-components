import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "named"
    },
    {
      file: "dist/index.esm.js",
      format: "esm"
    }
  ],
  external: ["react", "react-dom", "formik"],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    babel({ babelHelpers: "bundled" })
  ]
};
