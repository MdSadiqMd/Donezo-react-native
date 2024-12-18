import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { todos } from "@/data/todos";
import { Todo } from "@/types/todos.types";

export default function Index() {
    const [_todos, setTodos] = useState<Todo[]>(todos.sort((a, b) => a.id - b.id));
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
