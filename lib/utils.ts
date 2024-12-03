export function formatCount(count: number): string {
  if (!count) return "0";

  if (count >= 1000000) {
    return `${(count / 1000000).toLocaleString(undefined, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    })}M`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toLocaleString(undefined, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    })}k`;
  }

  return count.toString();
}
