import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6B73FF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#87CEEB',
          borderTopWidth: 0,
          paddingBottom: 5,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Productos',
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
        }}
      />
    </Tabs>
  );
}