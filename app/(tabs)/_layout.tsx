import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/src/components/haptic-tab';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { FloatingTabBarItem } from '@/src/components/ui/kova';
import { theme } from '@/src/constants/theme';
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          position: 'absolute',
          left: 18,
          right: 18,
          bottom: Math.max(bottomInset - 4, 10),
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: theme.colors.borderStrong,
          borderRadius: theme.radius.xxl,
          backgroundColor: theme.colors.surfaceGlass,
          ...theme.shadows.floating,
        },
        tabBarItemStyle: {
          borderRadius: theme.radius.xl,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.bodySM,
          fontWeight: theme.fontWeight.semibold,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <FloatingTabBarItem
              focused={focused}
              icon={<IconSymbol size={23} name="house.fill" color={color} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color, focused }) => (
            <FloatingTabBarItem
              focused={focused}
              icon={<Entypo name="progress-two" size={23} color={color} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, focused }) => (
            <FloatingTabBarItem
              focused={focused}
              icon={<Octicons name="history" size={22} color={color} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <FloatingTabBarItem
              focused={focused}
              icon={
                <MaterialCommunityIcons name="account" size={24} color={color} />
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
