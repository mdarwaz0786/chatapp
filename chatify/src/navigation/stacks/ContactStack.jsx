import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ContactListScreen from "../../screens/contact/ContactListScreen";

const Stack = createNativeStackNavigator();

const ContactStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Contacts" component={ContactListScreen} />
    </Stack.Navigator>
  );
};

export default ContactStack;