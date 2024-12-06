"use client";
import { useParams } from "next/navigation";

export function useExhibitionIdFromParams(): number {
  const { exhibitionId: id } = useParams();

  if (!id) {
    throw new Error("Route must contain an exhibition ID.");
  }

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

export function useQuizIdFromParams(): number {
  const { quizId: id } = useParams();

  const resolvedId = Array.isArray(id) ? id[0] : id;

  if (!resolvedId || resolvedId.length === 0) {
    throw new Error("Route must contain an quiz ID.");
  }

  const quizId = Number(resolvedId);

  if (isNaN(quizId)) {
    throw new Error("The quiz ID is not a valid number.");
  }

  return quizId;
}
