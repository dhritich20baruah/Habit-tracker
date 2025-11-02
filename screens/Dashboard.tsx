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

export default function Dashboard(){
    return(
        <DashboardScreen/>
    )
}

export function DashboardScreen(){
    return(
        <ScrollView>
            <View>
                <Text>Dashboard</Text>
            </View>
        </ScrollView>
    )
}