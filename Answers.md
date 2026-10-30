# Week 5: Explain it

## 1. Refreshing on /events/2

In development, the Vite dev server answered the request. It sees that `/events/2` is not a real file and falls back to sending `index.html`, and then Vue Router reads the URL and shows the right page. After deployment, the production server must do the same: for any path that is not a real file or an API route, return `index.html` with a 200 status. Without that, a refresh or a pasted link to `/events/2` gives a 404 from the server, because only the browser's router knows that route exists.

## 2. The organiser-only guard

Yes, a student can still create an event. The guard only runs in the browser, so a student can skip the page and send `POST /events` directly with curl, Postman or the DevTools console, or change the role in the client code. json-server accepts any request. The server must check who is making the request and return 403 Forbidden for non-organisers. This is the same reason the form's validation must be repeated on the server.

## 3. `watch` with `immediate: true` instead of `onMounted`

`onMounted` runs only once, when the component is first created. When the user goes from `/events/1` to `/events/2`, Vue Router reuses the same component and only changes the `id` prop, so `onMounted` does not run again. The page would keep showing event 1 (a stale page) while the URL says event 2. A `watch` on the id runs again every time the id changes, and `immediate: true` makes it also run on the first render, so it covers the first load as well.

## 4. `storeToRefs(store)` instead of `const { events } = store`

Destructuring a store copies the current values into plain variables, so they lose their link to the store's reactive state. `events` would stay as the empty array from the start and never update when `fetchAll` stores the result, so the page would stay empty. `storeToRefs` makes a ref for each state and getter that stays connected to the store, so the template updates when the store changes. Actions like `fetchAll` can be destructured directly, because they are plain functions.

## 5. Two requests when booking

If the POST succeeds but the PATCH fails, the booking exists in the database but the event's `booked` count was never increased. The data becomes inconsistent: the event shows more seats left than there really are, so it can be overbooked. The server can avoid this by doing both steps in one operation, for example a single endpoint that creates the booking and updates the seats inside a database transaction. If either step fails, the transaction rolls back and nothing is saved. Another option is to not store `booked` at all and calculate it from the bookings.