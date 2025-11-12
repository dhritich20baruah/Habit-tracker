import { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { Calendar } from "react-native-calendars";

export default function Dashboard() {
  return (
    <SQLiteProvider databaseName="healthTracker.db">
      <DashboardScreen />
    </SQLiteProvider>
  );
}

export function DashboardScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const today = new Date();
  const date = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const [selected, setSelected] = useState<string>("2025-11-12");

  return (
    <ScrollView>
      <View style={styles.container}>
        <Calendar
          current={selected}
          onDayPress={(day) => setSelected(day.dateString)}
          markedDates={{
            [selected]: { selected: true, selectedColor: "#FF9800" },
          }}
          hideExtraDays={true}
          firstDay={1} // Week starts on Monday
          enableSwipeMonths={false}
          theme={{
            selectedDayBackgroundColor: "#FF9800",
            todayTextColor: "#FF9800",
            arrowColor: "#FF9800",
            textDayFontSize: 16,
            textMonthFontWeight: "bold",
          }}
          style={styles.calendar}
        />
        <View style={styles.detailsBox}>
          <Text style={styles.selectedText}>Selected Date: {selected}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  calendar: {
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 2,
  },
  detailsBox: {
    alignItems: "center",
    marginTop: 20,
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
  },
});
