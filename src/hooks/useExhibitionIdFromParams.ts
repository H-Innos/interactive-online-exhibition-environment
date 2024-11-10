import { useParams } from 'next/navigation';

function useExhibitionIdFromParams(): number {
  const { id } = useParams();

  const resolvedId = Array.isArray(id) ? id[0] : id;

  if (!resolvedId || resolvedId.length === 0) {
    throw new Error("Route must contain an exhibition ID.");
  }

  const exhibitionId = Number(resolvedId);

  if (isNaN(exhibitionId)) {
    throw new Error("The exhibition ID is not a valid number.");
  }

  return exhibitionId;
}

export default useExhibitionIdFromParams;