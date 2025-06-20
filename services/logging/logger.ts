import { DEBUG_ON } from "@/utils/config";

interface Logger {
  debug: (message: string, ...optionalParams: any[]) => void;
}

export const logger: Logger = {
  debug: (message: string, ...optionalParams: any[]) => {
    if (DEBUG_ON) {
      console.debug(`${message}`, ...optionalParams);
    }
  },
};