import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import React, { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Octicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { ThemeContext } from "@/context/ThemeContext";
import { Todo } from "@/types/todos.types";
import { Theme, ColorScheme } from "@/constants/Colors";

export default function EditScreen() {
    const { id } = useLocalSearchParams();
    const [todo, setTodo] = useState<Todo[]>([]);
    const context = useContext(ThemeContext);
    if (!context) return null;

    const { colorScheme, setColorScheme, theme } = context;
    const router = useRouter();
    const styles = createStyles(theme, colorScheme);

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
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    maxLength={30}
                    placeholder="Edit todo"
                    placeholderTextColor="gray"
                    value={todo.length > 0 ? todo[0].text : ''}
                    onChangeText={(text) => setTodo(prev => ({ ...prev, title: text }))}
                />
                <Pressable
                    onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                    style={{ marginLeft: 10 }}
                >
                    <Octicons
                        name={colorScheme === 'dark' ? "moon" : "sun"}
                        size={36}
                        color={theme.text}
                        selectable={undefined}
                        style={{ width: 36 }}
                    />
                </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <Pressable
                    onPress={handleSave}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/')}
                    style={[styles.saveButton, { backgroundColor: 'red' }]}
                >
                    <Text style={[styles.saveButtonText, { color: 'white' }]}>Cancel</Text>
                </Pressable>
            </View>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaView>
    );
}

function createStyles(theme: Theme, colorScheme: ColorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: theme.backgroundDark,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap: 6,
            width: '100%',
            maxWidth: 1024,
            marginHorizontal: 'auto',
            pointerEvents: 'auto',
        },
        input: {
            flex: 1,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            fontSize: 18,
            fontFamily: 'Inter_500Medium',
            minWidth: 0,
            color: theme.text,
        },
        saveButton: {
            backgroundColor: theme.buttonBackgroundColor,
            borderRadius: 5,
            padding: 10,
        },
        saveButtonText: {
            fontSize: 18,
            color: colorScheme === 'dark' ? 'black' : 'white',
        }
    });
}