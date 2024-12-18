import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { todos } from "@/data/todos";
import { Todo } from "@/types/todos.types";

export default function Index() {
    const [_todos, setTodos] = useState<Todo[]>(todos.sort((a, b) => a.id - b.id));
    const [text, setText] = useState<string>('');

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
        )
    }

    const removeTodo = (id: number) => {
        setTodos(_todos.filter((todo) => todo.id !== id));
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Edit app/index.tsx to edit this screen.</Text>
        </View>
    );
}
