import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#4F46E5", // Indigo
          secondary: "#3F3F46", // Slate (neutral text)
          accent: "#EAB308", // Gold
          error: "#DC2626",
          warning: "#D97706",
          info: "#0EA5E9",
          success: "#059669",
          background: "#F4F4F5", // Page surface
          surface: "#FFFFFF", // Cards, panels
          "surface-variant": "#F1F1F4",
          "on-surface": "#18181B", // Ink
          "on-background": "#18181B",
        },
        variables: {
          "border-color": "#E4E4E7",
          "border-opacity": 1,
          "high-emphasis-opacity": 0.92,
          "medium-emphasis-opacity": 0.66,
        },
      },
    },
  },
  defaults: {
    VCard: { rounded: "lg" },
    VTextField: { color: "primary" },
    VSelect: { color: "primary" },
    VTextarea: { color: "primary" },
    VAutocomplete: { color: "primary" },
  },
});
