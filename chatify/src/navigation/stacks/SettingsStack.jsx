import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SettingsScreen from "../../screens/settings/SettingsScreen";

const Stack = createNativeStackNavigator();

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default SettingsStack;