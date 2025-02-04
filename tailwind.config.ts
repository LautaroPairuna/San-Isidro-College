import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      fontFamily: {
        acumin: ['AcuminVariableConcept', 'sans-serif'],
        gotham: ['Gotham', 'sans-serif'],
        gothamBold: ['Gotham', 'sans-serif'],
        gothamItalic: ['Gotham', 'sans-serif'],
        gothamLight: ['Gotham', 'sans-serif'],
        harlows: ['Harlows', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config;
