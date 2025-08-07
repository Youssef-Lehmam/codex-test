import { defineConfig, presetUno } from 'unocss';
import { tokens } from './src/client/theme/tokens';

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      light: tokens.colors.light,
      dark: tokens.colors.dark,
    },
    borderRadius: tokens.radius,
    spacing: {
      1: tokens.space(1),
      2: tokens.space(2),
      4: tokens.space(4),
    },
    boxShadow: {
      sm: '0 1px 2px rgba(0,0,0,0.05)',
    },
  },
});
