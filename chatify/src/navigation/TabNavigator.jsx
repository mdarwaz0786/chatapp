import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ChatStack from "./stacks/ChatStack";
import CallStack from "./stacks/CallStack";
import ContactStack from "./stacks/ContactStack";
import SettingsStack from "./stacks/SettingsStack";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Chats" component={ChatStack} />
      <Tab.Screen name="Calls" component={CallStack} />
      <Tab.Screen name="Contacts" component={ContactStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;