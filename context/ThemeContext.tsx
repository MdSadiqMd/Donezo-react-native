import React, { ReactNode, useState, createContext } from 'react';
import { Appearance } from 'react-native';

import { Colors, Theme, ColorScheme } from '@/constants/Colors';

interface ThemeContextType {
    colorScheme: ColorScheme;
    setColorScheme: React.Dispatch<React.SetStateAction<ColorScheme>>;
    theme: Theme;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [colorScheme, setColorScheme] = useState<ColorScheme>(
        (Appearance.getColorScheme() as ColorScheme) ?? 'light'
    );
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

    return (
        <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};