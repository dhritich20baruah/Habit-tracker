import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Alert } from "react-native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import Dashboard from "./screens/Dashboard";

export type RootStackParamList = {
  Home: undefined;
  Dashboard: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

type Database = {
  execAsync: (query: string) => Promise<void>;
};

type User = {
  id: number;
  name: string;
};

const initializeDB = async (db: Database): Promise<void> => {
  try {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS userData (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);`);
    console.log("DB Connected");
  } catch (error) {
    console.error("Error in connection", error);
  }
};

export function HomeScreen() {
  return (
    <SQLiteProvider databaseName="healthTracker.db" onInit={initializeDB}>
      <Intro />
    </SQLiteProvider>
  );
}

export function Intro() {
  const navigation = useNavigation<NavigationProp>();
  const db = useSQLiteContext();
  const [name, setName] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  const addName = async (): Promise<void> => {
    if (!name.trim()) {
      Alert.alert("Name is required");
      return;
    }

    try {
      await db.runAsync("INSERT INTO userData (name) VALUES (?)", [name]);
      await fetchUsers();
    } catch (error) {
      console.error("Error inserting name:", error);
    }
  };

    const fetchUsers = async (): Promise<void> => {
    try {
      const result = await db.getAllAsync<User>("SELECT * FROM userData");
      setUsers(result);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textQuery}>
        It seems you are using this app for the first time. What do I call you?
      </Text>
      <TextInput
        style={styles.nameInput}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity onPress={addName}>
        <Text style={styles.textBtn}>Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
        <Text style={styles.textBtn}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerStyle: {
            backgroundColor: "orange",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textBtn: {
    color: "white",
    padding: 10,
    backgroundColor: "orange",
  },
  textQuery: {
    color: "black",
    fontSize: 30,
    margin: 10,
  },
  nameInput: {
    fontSize: 30,
    padding: 5,
    borderBottomColor: "black",
  },
});
