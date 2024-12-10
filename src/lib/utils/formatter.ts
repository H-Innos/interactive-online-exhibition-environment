export function formatDate(date: Date | null): string {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date parameter. Expected a Date object.");
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
