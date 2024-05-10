import { toast } from "sonner";

interface IToastMessages<T> {
  loading: string;
  successStr: string;
  errorStr: string;
  success: (data: T) => string;
  error: (error: Error) => string;
}

const MSG_LOADING = "Loading...";
const MSG_SUCCESS = "Process complete!";
const MSG_ERROR = (err?: Error) =>
  "An unexpected error occurred: " + err?.message;

export const withToast = <T>(
  fn: Promise<T>,
  messages: Partial<IToastMessages<T>> = {}
): Promise<T> => {
  return new Promise((resolve, reject) => {
    toast.promise(fn, {
      loading: messages.loading ?? MSG_LOADING,
      success: (data) => {
        resolve(data);

        if (messages.success) return messages.success(data);
        else if (messages.successStr) return messages.successStr;
        return MSG_SUCCESS;
      },
      error: (value) => {
        console.error(value);
        reject(value);

        const error = value as Error;
        if (messages.error) return messages.error(error);
        else if (messages.errorStr) return messages.errorStr;
        return MSG_ERROR(error);
      },
    });
  });
};
