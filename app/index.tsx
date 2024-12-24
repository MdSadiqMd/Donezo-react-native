import React, { useState, useContext } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

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

    const [loaded, error] = useFonts({
        Inter_500Medium,
    });
    if (!loaded && !error) return null;
    if (!theme || !colorScheme) return;

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

    const saveTodos = async (newTodos: Todo[]) => {
        try {
            setTodos(newTodos);
            const jsonValue = JSON.stringify(newTodos);
            await AsyncStorage.setItem("todos", jsonValue);
        } catch (error) {
            console.error("Error saving todos:", error);
        }
    };

    if (_todos.length === 0) {
        initializeTodos();
    }
    const styles = createStyles(theme, colorScheme);

    const addTodos = () => {
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
                <Pressable style={styles.addButton} onPress={addTodos}>
                    <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
                <Pressable
                    style={{ marginLeft: 10 }}
                    onPress={() =>
                        setColorScheme(colorScheme === "light" ? "dark" : "light")
                    }
                >
                    <Text style={styles.addButtonText}>
                        {colorScheme === "dark" ? (
                            <Octicons name="moon" size={24} color={theme.text} />
                        ) : (
                            <Octicons name="sun" size={24} color={theme.text} />
                        )}
                    </Text>
                </Pressable>
            </View>
            <Animated.FlatList
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
                        <Text
                            style={[
                                styles.todoText,
                                item.completed && styles.todoTextCompleted,
                            ]}
                        >
                            {item.text}
                        </Text>
                        <Pressable onPress={() => removeTodo(item.id)} style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>
                                <MaterialCommunityIcons
                                    name="delete-circle"
                                    size={24}
                                    color="red"
                                />
                            </Text>
                        </Pressable>
                    </View>
                )}
                style={styles.todoList}
                itemLayoutAnimation={LinearTransition}
                keyboardDismissMode={"on-drag"}
            />
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaView>
    );
}

function createStyles(theme: Theme, colorScheme: ColorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? theme.backgroundDark : theme.backgroundLight,
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
            fontFamily: "Inter_500Medium",
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
            fontFamily: "Inter_500Medium",
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
            fontFamily: "Inter_500Medium",
        },
        todoTextCompleted: {
            textDecorationLine: "line-through",
            color: theme.textCompletedColor,
        },
        removeButton: {
            marginLeft: 12,
        },
        removeButtonText: {
            color: theme.removeButtonTextColor,
            fontSize: 14,
        },
    });
}