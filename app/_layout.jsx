import { Ionicons } from '@expo/vector-icons';
import { Stack } from "expo-router";
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="list" size={24} color="#007AFF" />
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Todo List</Text>
            </View>
          ),
        }}
      />
    </GestureHandlerRootView>
  );
}
