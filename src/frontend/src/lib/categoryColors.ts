export const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  Engineering: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
  Design: { bg: "bg-pink-100", text: "text-pink-800", dot: "bg-pink-500" },
  Career: { bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500" },
  Tools: { bg: "bg-cyan-100", text: "text-cyan-800", dot: "bg-cyan-500" },
  "Soft Skills": {
    bg: "bg-green-100",
    text: "text-green-800",
    dot: "bg-green-500",
  },
  Interview: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    dot: "bg-orange-500",
  },
  General: { bg: "bg-stone-100", text: "text-stone-700", dot: "bg-stone-400" },
};

const DEFAULT_COLOR = {
  bg: "bg-stone-100",
  text: "text-stone-700",
  dot: "bg-stone-400",
};

export function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
}

export const CATEGORY_OPTIONS = [
  "Engineering",
  "Design",
  "Career",
  "Tools",
  "Soft Skills",
  "Interview",
  "General",
];
