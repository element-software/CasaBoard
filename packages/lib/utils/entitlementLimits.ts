/**
 * Given a list of items and a max-allowed count (-1 = unlimited),
 * returns the IDs of items that exceed the limit.
 * Items are sorted oldest-first so the user retains their earliest work.
 */
export function getLockedIds<T extends { id: string; created_at: string }>(
  items: T[],
  maxAllowed: number
): string[] {
  if (maxAllowed < 0) return [];
  const sorted = [...items].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  return sorted.slice(maxAllowed).map((i) => i.id);
}
