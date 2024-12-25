import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import React, { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeContext } from "@/context/ThemeContext";
import { Todo } from "@/types/todos.types";

export default function EditScreen() {
    const { id } = useLocalSearchParams();
    const [todo, setTodo] = useState({});
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const router = useRouter();

    const [loaded, error] = useFonts({
        Inter_500Medium
    });

    useEffect(() => {
        const fetchData = async (id: number) => {
            try {
                const jsonValue = await AsyncStorage.getItem("todos");
                const storageTodos = jsonValue ? JSON.parse(jsonValue) : null;
                if (storageTodos && storageTodos.length > 0) {
                    const myTodo = storageTodos.find((todo: Todo) => todo.id === id);
                    setTodo(myTodo);
                }
            } catch (error) {
                console.error("Error fetching todos:", error);
            }
        };
        fetchData(Number(id));
    }, [id]);
    if (!loaded && !error) return null;

    const handleSave = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("todos");
            const storageTodos = jsonValue ? JSON.parse(jsonValue) : null;
            if (storageTodos && storageTodos.length > 0) {
                const updatedTodos = storageTodos.map((todo: Todo) => {
                    if (todo.id === Number(id)) {
                        return {
                            ...todo,
                            text: todo.text,
                            completed: todo.completed,
                        };
                    }
                    return todo;
                });
                await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
            }
            router.push(`/`);
        } catch (error) {
            console.error("Error saving todos:", error);
        }
    };

    return (
        <View>
            <Text>Edit {id}</Text>
        </View>
    );
}