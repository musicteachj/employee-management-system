/// <reference types="vite/client" />

// Vuetify ships its base styles as a side-effect CSS entry (`import "vuetify/styles"`).
// Declare it so `noUncheckedSideEffectImports` can resolve the module.
declare module "vuetify/styles";

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
