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
        colors: {
          primary: "#00897b", // Teal
          secondary: "#37474f", // Dark blue-gray
          accent: "#26c6da", // Light cyan
          error: "#f44336",
          warning: "#ff9800",
          info: "#1565c0",
          success: "#4caf50",
        },
      },
      // dark: {
      //   colors: {
      //     primary: "#42b883",
      //     secondary: "#34495e",
      //     accent: "#646cff",
      //     error: "#f44336",
      //     warning: "#ff9800",
      //     info: "#2196f3",
      //     success: "#4caf50",
      //   },
      // },
    },
  },
});
