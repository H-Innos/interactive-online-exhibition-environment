import { useRouter } from "next/navigation";
import { useMessage } from "~/context/message";
import { api } from "~/trpc/react";

export const useUpdateExhibition = () => {
  const utils = api.useUtils();
  const { setSuccessMessage, setErrorMessage } = useMessage();
  return api.exhibition.update.useMutation({
    onSuccess: async () => {
      await utils.exhibition.invalidate();
      setSuccessMessage("Exhibition updated successfully!");
    },
    onError: (error) => {
      if (error.message === "An exhibition with this name already exists.") {
        setErrorMessage("An exhibition with this name already exists. Please choose a different name.");
      } 
      else if (error.message.includes("String must contain at least 1 character(s)")) {
        setErrorMessage("Exhibition name must contain at least 1 character(s).");
      } 
      else {
        setErrorMessage(`Failed to create exhibition: ${error.message}`);
      }
    },
  });
}


export const usePublishExhibition = () => {
  const utils = api.useUtils();
  const { setSuccessMessage, setErrorMessage } = useMessage();
  const router = useRouter();
  return api.exhibition.publish.useMutation({
    onSuccess: async () => {
      await utils.exhibition.invalidate();
      setSuccessMessage("Exhibition published successfully!");
      router.push(`/exhibitions`);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });
}
