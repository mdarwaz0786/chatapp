import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChatListScreen from "../../screens/chat/ChatListScreen";
import ChatScreen from "../../screens/chat/ChatScreen";

const Stack = createNativeStackNavigator();

const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default ChatStack;