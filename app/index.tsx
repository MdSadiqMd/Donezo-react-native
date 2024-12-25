import React, { useState, useContext, useEffect } from "react";
import { Pressable, Text, TextInput, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

import { todos as defaultTodos } from "@/data/todos";
import { Todo } from "@/types/todos.types";
import { ThemeContext } from "@/context/ThemeContext";
import { Theme, ColorScheme } from "@/constants/Colors";

export default function Index() {
    const [_todos, setTodos] = useState<Todo[]>([]);
    const [text, setText] = useState<string>("");
    const context = useContext(ThemeContext);
    if (!context) return null;

    const { colorScheme, setColorScheme, theme } = context;
    const [fontsLoaded] = useFonts({
        Inter_500Medium,
    });
    const router = useRouter();

    useEffect(() => {
        const initializeTodos = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem("todos");
                const storageTodos = jsonValue ? JSON.parse(jsonValue) : null;
                if (storageTodos && storageTodos.length > 0) {
                    setTodos(storageTodos.sort((a: Todo, b: Todo) => a.id - b.id));
                } else {
                    setTodos(defaultTodos.sort((a: Todo, b: Todo) => a.id - b.id));
                }
            } catch (error) {
                console.error("Error fetching todos:", error);
            }
        };
        initializeTodos();
    }, []);

    const saveTodos = async (newTodos: Todo[]) => {
        try {
            setTodos(newTodos);
            const jsonValue = JSON.stringify(newTodos);
            await AsyncStorage.setItem("todos", jsonValue);
        } catch (error) {
            console.error("Error saving todos:", error);
        }
    };

    const addTodo = () => {
        if (text.trim()) {
            const newId = _todos.length > 0 ? _todos[0].id - 1 : 1;
            const newTodos = [{ id: newId, text, completed: false }, ..._todos];
            saveTodos(newTodos);
            setText("");
        }
    };

    const toggleTodo = (id: number) => {
        const updatedTodos = _todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos(updatedTodos);
    };

    const removeTodo = (id: number) => {
        const updatedTodos = _todos.filter((todo) => todo.id !== id);
        saveTodos(updatedTodos);
    };

    const handlePress = (id: number) => {
        router.push(`/todos/${id}`);
    };
    if (!fontsLoaded || !theme || !colorScheme) {
        return null;
    }

    const styles = createStyles(theme, colorScheme);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={text}
                    onChangeText={setText}
                    placeholder="What needs to be done?"
                    placeholderTextColor={theme.placeholderTextColor}
                />
                <Pressable style={styles.addButton} onPress={addTodo}>
                    <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
                <Pressable
                    style={{ marginLeft: 10 }}
                    onPress={() =>
                        setColorScheme(colorScheme === "light" ? "dark" : "light")
                    }
                >
                    <Text>
                        {colorScheme === "dark" ? (
                            <Octicons name="moon" size={24} color={theme.text} />
                        ) : (
                            <Octicons name="sun" size={24} color={theme.text} />
                        )}
                    </Text>
                </Pressable>
            </View>
            <FlatList
                data={_todos}
                keyExtractor={(item: Todo) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.todoItem}>
                        <Pressable
                            onPress={() => toggleTodo(item.id)}
                            style={[
                                styles.checkbox,
                                item.completed && styles.checkboxCompleted,
                            ]}
                        />
                        <Pressable onPress={() => handlePress(item.id)}>
                            <Text
                                style={[
                                    styles.todoText,
                                    item.completed && styles.todoTextCompleted,
                                ]}
                            >
                                {item.text}
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => removeTodo(item.id)} style={styles.removeButton}>
                            <MaterialCommunityIcons
                                name="delete-circle"
                                size={24}
                                color="red"
                            />
                        </Pressable>
                    </View>
                )}
                style={styles.todoList}
                keyboardDismissMode="on-drag"
            />
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </SafeAreaView>
    );
}

function createStyles(theme: Theme, colorScheme: ColorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                colorScheme === "dark" ? theme.backgroundDark : theme.backgroundLight,
            paddingHorizontal: 16,
            paddingVertical: 24,
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
        },
        textInput: {
            flex: 1,
            height: 50,
            borderWidth: 1,
            borderColor: theme.inputBorderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            backgroundColor: theme.inputBackgroundColor,
            fontSize: 16,
            color: theme.text,
        },
        addButton: {
            marginLeft: 8,
            backgroundColor: theme.buttonBackgroundColor,
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
        },
        addButtonText: {
            color: theme.buttonTextColor,
            fontSize: 16,
            fontWeight: "bold",
        },
        todoList: {
            flex: 1,
        },
        todoItem: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.itemBackgroundColor,
            borderRadius: 8,
            padding: 16,
            marginBottom: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        checkbox: {
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: theme.checkboxBorderColor,
            borderRadius: 4,
            marginRight: 12,
            backgroundColor: theme.checkboxBackgroundColor,
        },
        checkboxCompleted: {
            backgroundColor: theme.checkboxCompletedBackgroundColor,
        },
        todoText: {
            flex: 1,
            fontSize: 16,
            color: theme.text,
        },
        todoTextCompleted: {
            textDecorationLine: "line-through",
            color: theme.textCompletedColor,
        },
        removeButton: {
            marginLeft: 12,
        },
    });
}