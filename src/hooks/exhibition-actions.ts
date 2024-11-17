"use client";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export const useCreateExhibition = () => {
  const utils = api.useUtils();
  return api.exhibition.create.useMutation({
    onSuccess: async () => {
      await utils.exhibition.invalidate();
    },
    onError: (error: { message?: string }) => {
      toast.error(`Failed to create exhibition: ${error.message}`);
    },
  });
} 

export const useUpdateExhibition = () => {
  const utils = api.useUtils();

  return api.exhibition.update.useMutation({
    onSuccess: async () => {
      await utils.exhibition.invalidate();
      toast.success("Exhibition updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update exhibition: ${error.message}`);
    },
  });
}

export const usePublishExhibition = () => {
  const utils = api.useUtils();
  const router = useRouter();

  return api.exhibition.publish.useMutation({
    onSuccess: async () => {
      await utils.exhibition.invalidate();
      toast.success("Exhibition published successfully!");
      router.push(`/dashboard`);
    },
    onError: (error) => {
      toast.error(`Failed to publish exhibition: ${error.message}`);
    }
  });
}

export const useUnpublishExhibition = () => {
  const utils = api.useUtils();

  return api.exhibition.unpublish.useMutation({
    onSuccess: async () => {
      await utils.exhibition.getAll.invalidate();
      await utils.exhibition.getDrafts.invalidate();

      toast.success("Exhibition moved back to drafts!");
    },
    onError: (error) => {
      toast.error(`Failed to unpublish exhibition: ${error.message}`);
    },
  });
}

export const useDeleteExhibition = () => {
  const utils = api.useUtils();
  
  return api.exhibition.delete.useMutation({
    onSuccess: async () => {
      await utils.exhibition.getAll.invalidate();
      await utils.exhibition.getDrafts.invalidate();
      toast.success("Exhibition deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to delete exhibition: ${error.message}`);
    },
  });
}

export const useArchiveExhibition = () => {
  const utils = api.useUtils();

  return api.exhibition.archiveExhibition.useMutation({
    onSuccess: async () => {
      try {
        await utils.exhibition.getAll.invalidate();
        await utils.exhibition.getArchived.invalidate();
        await utils.exhibition.getDrafts.invalidate();
        toast.success("Exhibition archived successfully!");
      } catch (error) {
        console.error("Error invalidating queries:", error);
        toast.error("Failed to update exhibition list");
      }
    },
    onError: (error) => {
      toast.error(`Failed to archive exhibition: ${error.message}`);
    },
  });
};

export const useUnarchiveExhibition = () => {
  const utils = api.useUtils();

  return api.exhibition.unarchiveExhibition.useMutation({
    onSuccess: async () => {
      try {
        await utils.exhibition.getAll.invalidate();
        await utils.exhibition.getArchived.invalidate();
        await utils.exhibition.getDrafts.invalidate(); 

        toast.success("Exhibition unarchived successfully!");
      } catch (error) {
        console.error("Error invalidating queries:", error);
        toast.error("Failed to update exhibition list");
      }
    },
    onError: (error) => {
      toast.error(`Failed to unarchive exhibition: ${error.message}`);
    },
  });
};

// delete if we have decided to not add autosaving back
/* 
export const useAutosaveExhibition = () => {
  const utils = api.useUtils();

  return api.exhibition.update.useMutation({
    onSuccess: async () => {
      await utils.exhibition.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to save exhibition content: ${error.message}`);
    },
  });
}
*/