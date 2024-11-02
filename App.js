import { StatusBar } from 'expo-status-bar';
import { cont } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const stack = createStackNavigator()

import TodoListComponent from './components/TodoListComponent';

export default function App() {
  return (
   <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="TodoList" component={TodoListComponent}></stack.Screen>
      </stack.Navigator>
   </NavigationContainer>
  );
}

