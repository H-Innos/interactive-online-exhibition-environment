import { type api } from "~/trpc/react";

export const invalidateExhibitionQueries = async (
  utils: ReturnType<typeof api.useUtils>,
) => {
  await Promise.all([
    utils.exhibition.getPublished.invalidate(),
    utils.exhibition.getDrafts.invalidate(),
    utils.exhibition.getArchived.invalidate(),
    utils.exhibition.getAll.invalidate(),
    utils.exhibition.getOne.invalidate(),
  ]);
};
