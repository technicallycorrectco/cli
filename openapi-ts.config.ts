import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../technicallycorrect.io/openapi.json",
  output: {
    path: "src/client",
    format: "prettier",
  },
  plugins: ["@hey-api/client-fetch"],
});
