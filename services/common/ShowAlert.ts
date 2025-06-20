import { alertTitleMap, AlertType } from "@/services/common/types";
import { Alert } from "react-native";

export function ShowAlert(type: AlertType, message: string) {
  const title = alertTitleMap[type] || 'Notice';

  Alert.alert(
    title,
    message,
    [{ text: 'OK' }],
    { cancelable: true }
  );
}