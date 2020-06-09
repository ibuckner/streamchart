import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

export default [
	{
		input: "src/index.ts",
		onwarn(warning, rollupWarn) {
			if (warning.code !== "CIRCULAR_DEPENDENCY") {
				rollupWarn(warning);
			}
		},
	  output: [
			{
				file: "dist/streamchart.js",
				format: "es",
				esModule: true
			},
			{
				file: "dist/iife/streamchart.js",
				format: "iife",
				name: "chart"
			},
			{
				file: "docs/lib/streamchart.js",
				format: "iife",
				name: "chart"
			}
	  ],
	  plugins: [
			resolve(),
			commonjs(),
			typescript()	
		]
	}
];