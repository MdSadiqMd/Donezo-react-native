import React, { createContext, useState } from "react";
import { Appearance } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }: { children: React.ReactNode; }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    return (
        <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};