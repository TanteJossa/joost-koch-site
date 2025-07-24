import { createGtag } from "vue-gtag";

export default function(app) {
  const gtag = createGtag({
    tagId: import.meta.env.VITE_GTAG_ID,
  });
  app.use(gtag);
}
