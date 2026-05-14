// src/utils/navigationBar.ts
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

export async function enableImmersiveNavigation() {
  if (Platform.OS !== "android") return;

  await NavigationBar.setPositionAsync("absolute");
  await NavigationBar.setVisibilityAsync("hidden");
  await NavigationBar.setBehaviorAsync("overlay-swipe");
}