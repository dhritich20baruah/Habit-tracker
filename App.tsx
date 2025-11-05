import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, TouchableOpacity } from "react-native";
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import Dashboard from "./screens/Dashboard";

export type RootStackParamList = {
  Home: undefined;
  Dashboard: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

type Database = {
  execAsync: (query: string) => Promise<void>;
}

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
  return(
    <SQLiteProvider databaseName='healthTracker.db' onInit={initializeDB}>
      <Intro />
    </SQLiteProvider>
  )
}

export function Intro(){
    const navigation = useNavigation<NavigationProp>();
    const db = useSQLiteContext();

  return (
    <View style={styles.container}>
      <Text>It seems you are using this app for the first time. What do I call you?</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
        <Text style={styles.text}>Get Started</Text>
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
  text: {
    color: "white",
    padding: 10,
    backgroundColor: "orange",
  },
});
