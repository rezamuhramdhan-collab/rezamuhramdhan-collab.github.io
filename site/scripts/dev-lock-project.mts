// Dev helper: toggle the password lock on a project (local testing only).
//   npx tsx scripts/dev-lock-project.mts <slug> <password>   → lock
//   npx tsx scripts/dev-lock-project.mts <slug> --unlock     → unlock
process.env.SKIP_SEED = "1";

import { getPayload } from "payload";
import config from "@payload-config";

const [slug, arg] = process.argv.slice(2);
if (!slug || !arg) {
  console.error("usage: dev-lock-project.mts <slug> <password|--unlock>");
  process.exit(1);
}

const payload = await getPayload({ config });
const { docs } = await payload.find({ collection: "projects", where: { slug: { equals: slug } }, limit: 1 });
if (!docs[0]) {
  console.error(`no project with slug ${slug}`);
  process.exit(1);
}

const unlock = arg === "--unlock";
await payload.update({
  collection: "projects",
  id: docs[0].id,
  data: unlock ? { locked: false, password: null } : { locked: true, password: arg },
});
console.log(`${unlock ? "unlocked" : "locked"}: ${slug}`);
process.exit(0);
