import React, { useState, useContext } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Animated, { LinearTransition } from "react-native-reanimated";

import { todos } from "@/data/todos";
import { Todo } from "@/types/todos.types";
import { ThemeContext } from "@/context/ThemeContext";
import { Theme, ColorScheme } from "@/constants/Colors";

export default function Index() {
    const [_todos, setTodos] = useState<Todo[]>(todos.sort((a, b) => a.id - b.id));
    const [text, setText] = useState<string>('');
    const context = useContext(ThemeContext);
    if (!context) return null;
    const { colorScheme, setColorScheme, theme } = context;

    const [loaded, error] = useFonts({
        Inter_500Medium
    });
    if (!loaded && !error) return null;
    if (!theme || !colorScheme) return;
    const styles = createStyles(theme, colorScheme);

    const addTodos = () => {
        if (text.trim()) {
            const newId = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
            setTodos([..._todos, { id: newId, text, completed: false }]);
            setText('');
        }
    };

    const toggleTodo = (id: number) => {
        setTodos(
            _todos.map((todo) => {
                if (todo.id === id) {
                    return { ...todo, completed: !todo.completed };
                }
                return todo;
            })
        );
    };

    const removeTodo = (id: number) => {
        setTodos(_todos.filter((todo) => todo.id !== id));
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
                    onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                >
                    <Text style={styles.addButtonText}>
                        {colorScheme === 'dark'
                            ? <Octicons name="moon" size={24} color={theme.text} />
                            : <Octicons name="sun" size={24} color={theme.text} />}
                    </Text>
                </Pressable>
            </View>
            <Animated.FlatList
                data={_todos}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.todoItem}>
                        <Pressable
                            onPress={() => toggleTodo(item.id)}
                            style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
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
                                <MaterialCommunityIcons name="delete-circle" size={24} color="red" />
                            </Text>
                        </Pressable>
                    </View>
                )}
                style={styles.todoList}
                itemLayoutAnimation={LinearTransition}
                keyboardDismissMode={"on-drag"}
            />
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