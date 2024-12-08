"use client";
import { useParams } from "next/navigation";

export function useExhibitionIdFromParams(): number {
  const { exhibitionId: id } = useParams();

  if (!id) {
    throw new Error("Route must contain an exhibition ID.");
  }

  const resolvedId = Array.isArray(id) ? id[0] : id;

  if (!resolvedId || resolvedId.length === 0) {
    return Number.NaN;
  }

  const exhibitionId = Number(resolvedId);

  if (isNaN(exhibitionId)) {
    return Number.NaN;
  }

  return exhibitionId;
}

export function useQuizIdFromParams(): number {
  const { quizId: id } = useParams();

  const resolvedId = Array.isArray(id) ? id[0] : id;

  if (!resolvedId || resolvedId.length === 0) {
    return Number.NaN;
  }

  const quizId = Number(resolvedId);

  if (isNaN(quizId)) {
    return Number.NaN;
  }

  return quizId;
}
