// Push the current Payload schema to the target database (additive drizzle
// push — the same sync that runs on dev boot). Use before deploying code
// that adds fields, so production columns exist ahead of the new queries:
//   DATABASE_URI=... DATABASE_AUTH_TOKEN=... npx tsx scripts/push-schema.mts
process.env.SKIP_SEED = "1";

import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });
const { totalDocs } = await payload.count({ collection: "projects" });
console.log(`Schema pushed. Target DB reachable — ${totalDocs} projects.`);
process.exit(0);
