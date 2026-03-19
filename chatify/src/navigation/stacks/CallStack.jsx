import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CallHistoryScreen from "../../screens/call/CallHistoryScreen";

const Stack = createNativeStackNavigator();

const CallStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CallHistory" component={CallHistoryScreen} />
    </Stack.Navigator>
  );
};

export default CallStack;