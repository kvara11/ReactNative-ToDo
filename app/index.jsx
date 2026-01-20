import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SafeAreaView } from 'react-native-safe-area-context';



const STORAGE_KEY = '@todos_key';

export default function App() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);


  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const loadTodos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setTodos(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load todos', e);
    }
  };

  const saveTodos = async (newTodos) => {
    try {
      const jsonValue = JSON.stringify(newTodos);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save todos', e);
    }
  };

  const handleAddTodo = () => {
    if (text.trim().length === 0) return;

    if (editingId) {
      const updatedTodos = todos.map((todo) =>
        todo.id === editingId ? { ...todo, title: text } : todo
      );
      setTodos(updatedTodos);
      setEditingId(null);
      setText('');
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      title: text,
    };
    setTodos([newTodo, ...todos]);
    setText('');
  };

  const deleteTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setText(todo.title);
  };

  const renderRightActions = (progress, dragX, todo) => {
    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            startEditing(todo);
          }}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteTodo(todo.id)}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
    >
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.title}</Text>
      </View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.contentContainer}>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={editingId ? "Update todo..." : "Add a new todo..."}
            value={text}
            onChangeText={setText}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
            <Text style={styles.addButtonText}>
              {editingId ? "Update" : "Add"}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'center',
    height: 60,
  },
  itemText: {
    fontSize: 16,
    color: '#333333',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 70,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CD964',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
