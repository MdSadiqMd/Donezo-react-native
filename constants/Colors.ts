import { ThemeColors } from "@/types/color.types";

export const Colors = {
    light: {
        text: '#000000',
        backgroundLight: '#FFFFFF',
        backgroundDark: '#1a1a1a',
        placeholderTextColor: '#888888',
        inputBorderColor: '#E0E0E0',
        inputBackgroundColor: '#FFFFFF',
        buttonBackgroundColor: '#4169E1',
        buttonTextColor: '#FFFFFF',
        itemBackgroundColor: '#FFFFFF',
        checkboxBorderColor: '#808080',
        checkboxBackgroundColor: '#FFFFFF',
        checkboxCompletedBackgroundColor: '#4169E1',
        textCompletedColor: '#808080',
        removeButtonTextColor: '#FF0000'
    },
    dark: {
        text: '#FFFFFF',
        backgroundLight: '#FFFFFF',
        backgroundDark: '#1a1a1a',
        placeholderTextColor: '#888888',
        inputBorderColor: '#404040',
        inputBackgroundColor: '#2a2a2a',
        buttonBackgroundColor: '#4169E1',
        buttonTextColor: '#FFFFFF',
        itemBackgroundColor: '#2a2a2a',
        checkboxBorderColor: '#606060',
        checkboxBackgroundColor: '#2a2a2a',
        checkboxCompletedBackgroundColor: '#4169E1',
        textCompletedColor: '#808080',
        removeButtonTextColor: '#FF0000'
    }
} as const;

export type Theme = ThemeColors;
export type ColorScheme = 'light' | 'dark';