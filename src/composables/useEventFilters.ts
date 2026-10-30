import { computed, ref, type Ref } from "vue";
import type { CampusEvent, Category } from "../types";

// Search (title or location) and category filtering, reusable by any page.
export function useEventFilters(events: Ref<CampusEvent[]>) {
  const search = ref("");
  const category = ref<Category | "all">("all");
  const visible = computed(() => {
    const q = search.value.trim().toLowerCase();
    return events.value.filter(e => {
      const matchesText = q === "" || e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
      const matchesCategory = category.value === "all" || e.category === category.value;
      return matchesText && matchesCategory;
    });
  });
  return { search, category, visible };
}
