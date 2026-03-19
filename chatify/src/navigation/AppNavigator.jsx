import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import CallScreen from "../screens/call/CallScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* Global modal screen */}
      <Stack.Screen
        name="CallScreen"
        component={CallScreen}
        options={{ presentation: "fullScreenModal", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;