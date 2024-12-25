import { useLocalSearchParams } from "expo-router";
import React, { View, Text, StyleSheet, Pressable, TextInput } from "react-native";

export default function EditScreen() {
    const { id } = useLocalSearchParams();
    return (
        <View>
            <Text>Edit {id}</Text>
        </View>
    );
}