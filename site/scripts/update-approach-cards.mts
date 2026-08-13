// Rewrite the Approach strip's service rows to the v3 prototype copy, and add
// the fourth cell the design has always shown. The database is the source of
// truth after seeding, so editing content/services.ts alone changes nothing on
// a live site — this script carries that edit across.
//
//   # inspect only — prints what would change, writes nothing
//   DATABASE_URI=postgres://... PAYLOAD_SECRET=... npx tsx scripts/update-approach-cards.mts
//
//   # apply
//   DATABASE_URI=postgres://... PAYLOAD_SECRET=... npx tsx scripts/update-approach-cards.mts --apply
//
// Idempotent: rows are matched by their current OR their target title, and a
// field is written only when it differs, so re-running is a no-op. The Strategy
// card keeps its title and description — only its icon moves off the bar chart,
// which now belongs to "Measured after launch".

process.env.SKIP_SEED = "1";

const APPLY = process.argv.includes("--apply");

if (!process.env.DATABASE_URI) {
  console.error("DATABASE_URI is required — refusing to guess a target database.");
  process.exit(1);
}

const { getPayload } = await import("payload");
const { default: config } = await import("@payload-config");

const payload = await getPayload({ config });

// `from` is the pre-v3 title the row is expected to carry; rows already
// carrying the target title match too, which is what makes a re-run a no-op.
const CARDS = [
  {
    from: "Product Design",
    title: "Discovery that bites",
    icon: "search",
    description:
      "Interviews, diary studies, and ride-alongs that surface the constraint nobody wrote in the brief.",
  },
  {
    from: "Design Systems",
    title: "Systems, not screens",
    icon: "layers",
    description:
      "Tokens, components, and documentation that survive three roadmaps and two rebrands.",
  },
  {
    from: "Strategy",
    title: "Strategy",
    icon: "compass",
    description:
      "Guiding product vision through user research, competitive analysis, and strategic design thinking.",
  },
  {
    from: "Measured after launch",
    title: "Measured after launch",
    icon: "chart",
    description:
      "Instrumented flows and honest retros. If it did not move a number, I say so out loud.",
  },
] as const;

type ServiceDoc = { id: string | number; title: string; description: string; icon?: string | null };

const { docs } = await payload.find({ collection: "services", sort: "_order", limit: 100 });
const services = docs as unknown as ServiceDoc[];

const changes: string[] = [];
const updates: Array<{ id: string | number; data: Record<string, unknown> }> = [];
const creates: Array<Record<string, unknown>> = [];

for (const card of CARDS) {
  const doc = services.find((s) => s.title === card.from || s.title === card.title);

  if (!doc) {
    creates.push({ title: card.title, description: card.description, icon: card.icon });
    changes.push(`create services["${card.title}"] (icon: ${card.icon})`);
    continue;
  }

  const data: Record<string, unknown> = {};
  if (doc.title !== card.title) {
    data.title = card.title;
    changes.push(`services[${doc.id}].title\n    ${JSON.stringify(doc.title)} -> ${JSON.stringify(card.title)}`);
  }
  if (doc.description !== card.description) {
    data.description = card.description;
    changes.push(`services[${doc.id}].description\n    ${JSON.stringify(doc.description)} -> ${JSON.stringify(card.description)}`);
  }
  if (doc.icon !== card.icon) {
    data.icon = card.icon;
    changes.push(`services[${doc.id}].icon\n    ${JSON.stringify(doc.icon ?? null)} -> ${JSON.stringify(card.icon)}`);
  }
  if (Object.keys(data).length) updates.push({ id: doc.id, data });
}

// Anything the Approach strip does not claim stays put — reordering or deleting
// rows someone added in the admin is not this script's call.
const untouched = services.filter(
  (s) => !CARDS.some((c) => s.title === c.from || s.title === c.title),
);

if (!changes.length) {
  console.log("Nothing to change — the Approach cards already match.");
  process.exit(0);
}

console.log(`\n${APPLY ? "Applying" : "Would apply"} ${changes.length} change(s):\n`);
for (const c of changes) console.log(`  ${c}`);

if (untouched.length) {
  console.log(
    `\n  ! ${untouched.length} other service row(s) left alone: ${untouched.map((s) => s.title).join(", ")}.` +
      "\n    Only the first four rows render — reorder in the admin if these should show.",
  );
}

if (!APPLY) {
  console.log("\nDry run — nothing written. Re-run with --apply to commit these.");
  process.exit(0);
}

for (const u of updates) {
  await payload.update({ collection: "services", id: u.id, data: u.data as never });
}
for (const c of creates) {
  await payload.create({ collection: "services", data: c as never });
}

console.log("\nDone. The afterChange hook revalidates the site; redeploy if you cache statically.");
process.exit(0);
