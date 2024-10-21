import { useMessage } from '~/context/message';
import { api } from '~/trpc/react';


export const useExhibitionActions = () => {
  const { setSuccessMessage, setErrorMessage } = useMessage();
  const utils = api.useUtils();

  const deleteExhibition = api.exhibition.delete.useMutation({
    onSuccess: async () => {
      await utils.exhibition.getAll.invalidate();
      setSuccessMessage("Exhibition deleted successfully!");
    },
    onError: (error) => {
      setErrorMessage(`Failed to delete exhibition: ${error.message}`);
    },
  });

  const publishExhibition = api.exhibition.publish.useMutation({
    onSuccess: async () => {
      await utils.exhibition.getAll.invalidate();
      setSuccessMessage("Exhibition published successfully!");
    },
    onError: (error) => {
      setErrorMessage(`Failed to publish exhibition: ${error.message}`);
    },
  });

  const unpublishExhibition = api.exhibition.unpublish.useMutation({
    onSuccess: async () => {
      await utils.exhibition.getAll.invalidate();
      setSuccessMessage("Exhibition moved back to drafts!");
    },
    onError: (error) => {
      setErrorMessage(`Failed to unpublish exhibition: ${error.message}`);
    },
  });

  return {
    deleteExhibition,
    publishExhibition,
    unpublishExhibition
  };
};