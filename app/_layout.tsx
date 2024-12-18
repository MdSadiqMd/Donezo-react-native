import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <Stack>
                <Stack.Screen name="index" />
            </Stack>
        </SafeAreaProvider>
    );
}
