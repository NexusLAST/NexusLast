/**
 * Utility function to get color classes for event categories
 * Feature 4: Category Tags with Color Coding
 */

export const getCategoryColor = (category: string): string => {
  const normalizedCategory = category.toLowerCase();

  const categoryColors: Record<string, string> = {
    startup: "bg-blue-500",
    girişimcilik: "bg-blue-500",
    social: "bg-green-500",
    sosyal: "bg-green-500",
    arkadaşlık: "bg-green-500",
    gaming: "bg-purple-500",
    oyun: "bg-purple-500",
    teknoloji: "bg-indigo-500",
    technology: "bg-indigo-500",
    spor: "bg-red-500",
    sports: "bg-red-500",
    sağlık: "bg-emerald-500",
    health: "bg-emerald-500",
    sanat: "bg-pink-500",
    art: "bg-pink-500",
    eğitim: "bg-orange-500",
    education: "bg-orange-500",
    müzik: "bg-violet-500",
    music: "bg-violet-500",
    iş: "bg-slate-500",
    business: "bg-slate-500",
    default: "bg-gray-500",
  };

  return categoryColors[normalizedCategory] || categoryColors.default;
};

export const getCategoryTextColor = (category: string): string => {
  // All backgrounds are dark enough for white text
  return "text-white";
};
