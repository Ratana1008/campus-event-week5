import { createRouter, createWebHistory, type RouterHistory } from "vue-router";
import { useSessionStore } from "../stores/session";
import EventsPage from "../pages/EventsPage.vue";

declare module "vue-router" {
  interface RouteMeta {
    organiserOnly?: boolean;
  }
}

export const routes = [
  { path: "/", name: "events", component: EventsPage },
  {
    path: "/events/new",
    name: "event-new",
    component: () => import("../pages/NewEventPage.vue"),
    meta: { organiserOnly: true },
  },
  {
    path: "/events/:id(\\d+)",
    name: "event-detail",
    component: () => import("../pages/EventDetailPage.vue"),
    props: true,
  },
  { path: "/my-bookings", name: "my-bookings", component: () => import("../pages/MyBookingsPage.vue") },
  // the catch-all goes last
  { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("../pages/NotFoundPage.vue") },
];

export function makeRouter(history: RouterHistory = createWebHistory()) {
  const router = createRouter({ history, routes });

   router.beforeEach(to => {
    if (!to.meta.organiserOnly) return; // most routes need no check, so don't touch the store
    const session = useSessionStore();
    if (!session.isOrganiser) {
      return { name: "events", query: { denied: "1" } };
    }
  });

  return router;
}
