import * as SecureStore from "expo-secure-store";

export async function getSecureValue(key: string) {
  return await SecureStore.getItemAsync(key);
}

export async function setSecureValue(key: string, value: string) {
  return await SecureStore.setItemAsync(key, value);
}

export async function deleteSecureValue(key: string) {
  return await SecureStore.deleteItemAsync(key);
}
