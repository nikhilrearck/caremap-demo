import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

import { Icon } from "@/components/ui/icon";
import { CheckCircleIcon } from "@/components/ui/icon";

type ToastOptions = {
  title: string;
  description?: string;
  placement?:
    | "top"
    | "top right"
    | "top left"
    | "bottom"
    | "bottom left"
    | "bottom right";
  duration?: number | null;
  action?: "success" | "error" | "warning" | "info" | "muted";
  variant?: "solid" | "outline";
  containerStyle?: object;
};

export function useCustomToast() {
  const toast = useToast();

  const showToast = ({
    title,
    description,
    placement = "bottom",
    duration = 3000,
    action = "muted",
    variant = "solid",
    containerStyle = { marginBottom: 90 },
  }: ToastOptions) => {
    const toastId = Math.random().toString();
    toast.show({
      id: toastId,
      placement: placement,
      duration: duration,
      containerStyle: containerStyle,
      render: ({ id }) => (
        <Toast
          nativeID={"toast-" + id}
          action={action}
          variant={variant}
          className="gap-2 items-center flex-row pl-4 pr-8 py-6 shadow-soft-1 mx-8"
          // style={{ backgroundColor: palette.primary }}
        >
          <Icon as={CheckCircleIcon} className="text-typography-50" size="xl" />
          <ToastTitle>{title}</ToastTitle>
          {description && <ToastDescription>{description}</ToastDescription>}
        </Toast>
      ),
    });
  };
  return showToast;
}
