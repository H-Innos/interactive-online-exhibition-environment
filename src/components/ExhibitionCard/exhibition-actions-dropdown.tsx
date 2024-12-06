import { Settings } from "lucide-react";
import { createContext, type PropsWithChildren, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  useArchiveExhibition,
  useDeleteExhibition,
  usePublishExhibition,
  useUnarchiveExhibition,
  useUnpublishExhibition,
  useTrashExhibition,
  useRestoreExhibition,
} from "~/hooks/exhibition-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ExhibitionCardContext } from "./exhibition-card";

const ExhibitionActionsDropdownContext = createContext<null>(null);

function useExhibitionActionsDropdownContext() {
  const exhibitionCardContext = useContext(ExhibitionCardContext);
  const dropdownContext = useContext(ExhibitionActionsDropdownContext);
  if (exhibitionCardContext === undefined) {
    throw new Error(
      "useExhibitionActionsDropdownContext must be used within ExhibitionCard",
    );
  }

  if (dropdownContext === undefined) {
    throw new Error(
      "useExhibitionActionsDropdownContext must be used within ExhibitionActionsDropdown",
    );
  }

  return exhibitionCardContext;
}

const ExhibitionActionsDropdown = ({ children }: PropsWithChildren) => {
  return (
    <ExhibitionActionsDropdownContext.Provider value={null}>
      <div className="absolute right-2 top-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full backdrop-blur-sm"
              data-testid="card-options-button"
              onClick={(e) => e.stopPropagation()}
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">{children}</DropdownMenuContent>
        </DropdownMenu>
      </div>
    </ExhibitionActionsDropdownContext.Provider>
  );
};

ExhibitionActionsDropdown.View = function ExhibitionActionsDropdownView() {
  const { exhibition } = useExhibitionActionsDropdownContext();
  const { t } = useTranslation();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${exhibition.id}`);
  };

  return (
    <DropdownMenuItem onClick={handleClick}>
      {t("archive.view")}
    </DropdownMenuItem>
  );
};

ExhibitionActionsDropdown.Edit = function ExhibitionActionsDropdownEdit() {
  const { exhibition } = useExhibitionActionsDropdownContext();
  const { t } = useTranslation();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (exhibition.id && exhibition.status === "draft") {
      router.push(`/dashboard/${exhibition.id}`);
    }
  };
  return (
    <DropdownMenuItem
      data-testid="select-edit-exhibition"
      onClick={handleClick}
      disabled={exhibition.status !== "draft"}
    >
      {t("edit")}
    </DropdownMenuItem>
  );
};

ExhibitionActionsDropdown.Archive =
  function ExhibitionActionsDropdownArchive() {
    const { exhibition } = useExhibitionActionsDropdownContext();
    const { t } = useTranslation();
    const archiveExhibition = useArchiveExhibition();

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (exhibition.id && window.confirm(t("archive.confirmArchive"))) {
        archiveExhibition.mutate({ id: exhibition.id });
      }
    };
    return (
      <DropdownMenuItem
        data-testid="select-archive-exhibition"
        onClick={handleClick}
        disabled={exhibition.status !== "draft"}
      >
        {t("archive.now")}
      </DropdownMenuItem>
    );
  };

ExhibitionActionsDropdown.Unarchive =
  function ExhibitionActionsDropdownUnarchive() {
    const { exhibition } = useExhibitionActionsDropdownContext();
    const { t } = useTranslation();
    const unarchiveExhibition = useUnarchiveExhibition();

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm(t("archive.confirmUnarchive"))) {
        unarchiveExhibition.mutate({ id: exhibition.id });
      }
    };

    return (
      <DropdownMenuItem
        data-testid="select-unarchive-exhibition"
        onClick={handleClick}
        disabled={exhibition.status !== "archived"}
      >
        {t("archive.unarchive")}
      </DropdownMenuItem>
    );
  };

ExhibitionActionsDropdown.Publish =
  function ExhibitionActionsDropdownPublish() {
    const { exhibition } = useExhibitionActionsDropdownContext();
    const { t } = useTranslation();
    const publishExhibition = usePublishExhibition();

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm(t("confirmPublish"))) {
        publishExhibition.mutate({ id: exhibition.id });
      }
    };

    return (
      <DropdownMenuItem
        data-testid="select-publish-exhibition"
        onClick={handleClick}
        disabled={exhibition.status !== "draft"}
      >
        {t("publish")}
      </DropdownMenuItem>
    );
  };

ExhibitionActionsDropdown.Unpublish =
  function ExhibitionActionsDropdownUnpublish() {
    const { exhibition } = useExhibitionActionsDropdownContext();
    const { t } = useTranslation();
    const unpublishExhibition = useUnpublishExhibition();

    const handleClick = () => {
      if (window.confirm(t("confirmUnpublish"))) {
        unpublishExhibition.mutate({ id: exhibition.id });
      }
    };

    return (
      <DropdownMenuItem
        data-testid="select-unpublish-exhibition"
        onClick={handleClick}
        disabled={exhibition.status !== "published"}
      >
        {t("unpublish")}
      </DropdownMenuItem>
    );
  };

ExhibitionActionsDropdown.Trash = function ExhibitionActionsDropdownTrash() {
  const { exhibition } = useExhibitionActionsDropdownContext();
  const { t } = useTranslation();
  const trashExhibition = useTrashExhibition();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmTrash = window.confirm(t("archive.confirmTrash"));
    if (confirmTrash) {
      trashExhibition.mutate({ id: exhibition.id });
    }
  };

  return (
    <DropdownMenuItem
      data-testid="select-trash-exhibition"
      onClick={handleClick}
      className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
      disabled={exhibition.status !== "draft"}
    >
      {t("delete")}
    </DropdownMenuItem>
  );
};

ExhibitionActionsDropdown.Restore =
  function ExhibitionActionsDropdownRestore() {
    const { exhibition } = useExhibitionActionsDropdownContext();
    const { t } = useTranslation();
    const restoreExhibition = useRestoreExhibition();

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm(t("confirmRestore"))) {
        restoreExhibition.mutate({ id: exhibition.id });
      }
    };

    return (
      <DropdownMenuItem
        data-testid="select-restore-exhibition"
        onClick={handleClick}
        disabled={exhibition.status !== "trashed"}
      >
        {t("restore")}
      </DropdownMenuItem>
    );
  };

ExhibitionActionsDropdown.PermanentDelete =
  function ExhibitionActionsDropdownPermanentDelete() {
    const { exhibition } = useExhibitionActionsDropdownContext();
    const { t } = useTranslation();
    const deleteExhibition = useDeleteExhibition();

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm(t("confirmPermanentDelete"))) {
        deleteExhibition.mutate({ id: exhibition.id });
      }
    };

    return (
      <DropdownMenuItem
        data-testid="select-permanent-delete-exhibition"
        onClick={handleClick}
        className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
        disabled={exhibition.status !== "trashed"}
      >
        {t("permanentDelete")}
      </DropdownMenuItem>
    );
  };

export { ExhibitionActionsDropdown };
