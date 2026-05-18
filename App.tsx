import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import ToolsScreen from './src/screens/ToolsScreen';
import WrittenExamScreen from './src/screens/WrittenExamScreen';
import SkillsScreen from './src/screens/SkillsScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import { colors, fontSize } from './src/theme';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 24 : 20 }}>{emoji}</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: '#333',
            height: 60,
            paddingBottom: 6,
            paddingTop: 4,
          },
          tabBarActiveTintColor: colors.tabBarActive,
          tabBarInactiveTintColor: colors.tabBarInactive,
          tabBarLabelStyle: { fontSize: fontSize.xs, fontWeight: '600' },
        }}
      >
        <Tab.Screen
          name="Tools"
          component={ToolsScreen}
          options={{
            tabBarLabel: '道具図鑑',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🔧" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Written"
          component={WrittenExamScreen}
          options={{
            tabBarLabel: '筆記対策',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📝" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Skills"
          component={SkillsScreen}
          options={{
            tabBarLabel: '技能対策',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🔌" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            tabBarLabel: '進捗',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
