import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
    console.log("Initializing DB...");
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS userData (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);`);
    console.log("DB Connected");
  } catch (error) {
    console.error("Error in connection", error);
  }
};

export function HomeScreen() {
  const [dbReady, setDbReady] = useState(false);

  const handleInit = async (db: Database) => {
    console.log("handleInit called");
    await initializeDB(db);
    console.log("DB setup done, setting ready to true");
    setDbReady(true);
  };

  return (
    <SQLiteProvider databaseName="healthTracker.db" onInit={handleInit}>
      {dbReady ? <Intro /> : <Text>Loading database...</Text>}
    </SQLiteProvider>
  );
}

export function Intro() {
  const db = useSQLiteContext();
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

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

  return (
     <LinearGradient colors={["#FFB75E", "#ED8F03"]} style={styles.gradient}>
      <View style={styles.container}>
        {users.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.title}>👋 Welcome!</Text>
            <Text style={styles.subtitle}>
              It seems you're using this app for the first time.{"\n"}What should I call you?
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.button} onPress={addName}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            {users.map((item) => (
              <Text style={styles.title} key={item.id}>
                👋 Hello, {item.name}!
              </Text>
            ))}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#28a745" }]}
              onPress={() => navigation.navigate("Dashboard")}
            >
              <Text style={styles.buttonText}>Get Started →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
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
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  input: {
    width: "90%",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
