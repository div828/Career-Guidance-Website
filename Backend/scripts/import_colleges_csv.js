const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const db = require("../db");

const args = process.argv.slice(2);
const getArg = (flag) => {
  const found = args.find((arg) => arg.startsWith(`${flag}=`));
  return found ? found.slice(flag.length + 1) : "";
};

const file = getArg("--file");
const source = getArg("--source") || "AISHE";
const sourceUrl = getArg("--source-url") || "";
const shouldTruncate = args.includes("--truncate");

if (!file) {
  console.error(
    "Usage: npm run import:colleges -- --file=path/to/colleges.csv [--truncate]"
  );
  process.exit(1);
}

const pick = (row, names) => {
  const keys = Object.keys(row);
  for (const name of names) {
    const key = keys.find(
      (candidate) => candidate.trim().toLowerCase() === name.toLowerCase()
    );
    const value = key ? String(row[key] || "").trim() : "";
    if (value) return value;
  }
  return "";
};

const toNumber = (value) => {
  const parsed = Number(String(value || "").replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : null;
};

const toWebsite = (value) => {
  const clean = String(value || "").trim();
  if (!clean) return null;
  return /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
};

const mapRow = (row) => {
  const collegeName = pick(row, [
    "College Name",
    "college_name",
    "Institution Name",
    "Institute Name",
    "Name",
  ]);

  if (!collegeName) return null;

  const city = pick(row, ["City", "Town", "city"]);
  const district = pick(row, ["District Name", "District", "district"]);
  const state = pick(row, ["State Name", "State", "state"]);

  return [
    pick(row, ["AISHE Code", "aishe_code", "Institution ID", "Institute ID"]) ||
      null,
    collegeName,
    pick(row, ["University Name", "university_name", "Affiliating University"]) ||
      null,
    pick(row, ["College Type", "Institution Type", "college_type", "Type"]) ||
      null,
    pick(row, ["Management Type", "Management", "management_type"]) || null,
    pick(row, ["Course Category", "course_category", "Category"]) || null,
    city || null,
    district || null,
    state || null,
    pick(row, ["Pincode", "PIN Code", "Postal Code", "pincode"]) || null,
    pick(row, ["Address", "Full Address", "address"]) ||
      [city, district, state].filter(Boolean).join(", ") ||
      null,
    toWebsite(pick(row, ["Website", "Website URL", "Official Website", "website_url"])),
    pick(row, ["Phone", "Contact Number", "Telephone", "phone"]) || null,
    pick(row, ["Email", "E-mail", "email"]) || null,
    toNumber(pick(row, ["Latitude", "Lat", "latitude", "lat"])),
    toNumber(pick(row, ["Longitude", "Lng", "Lon", "longitude", "lng", "lon"])),
    toNumber(pick(row, ["Rating", "rating"])),
    source,
    sourceUrl || null,
  ];
};

const insertBatch = async (rows) => {
  if (!rows.length) return;

  await db.query(
    `INSERT INTO colleges_directory (
      aishe_code, college_name, university_name, college_type, management_type,
      course_category, city, district, state, pincode, address, website_url,
      phone, email, latitude, longitude, rating, source, source_url
    ) VALUES ?
    ON DUPLICATE KEY UPDATE
      college_name = VALUES(college_name),
      university_name = VALUES(university_name),
      college_type = VALUES(college_type),
      management_type = VALUES(management_type),
      course_category = VALUES(course_category),
      city = VALUES(city),
      district = VALUES(district),
      state = VALUES(state),
      pincode = VALUES(pincode),
      address = VALUES(address),
      website_url = COALESCE(VALUES(website_url), website_url),
      phone = COALESCE(VALUES(phone), phone),
      email = COALESCE(VALUES(email), email),
      latitude = COALESCE(VALUES(latitude), latitude),
      longitude = COALESCE(VALUES(longitude), longitude),
      rating = COALESCE(VALUES(rating), rating),
      source = VALUES(source),
      source_url = COALESCE(VALUES(source_url), source_url)`,
    [rows]
  );
};

(async () => {
  const schemaPath = path.join(__dirname, "../sql/colleges_directory_schema.sql");
  await db.query(fs.readFileSync(schemaPath, "utf8"));

  if (shouldTruncate) {
    await db.query("TRUNCATE TABLE colleges_directory");
  }

  const resolvedFile = path.resolve(process.cwd(), file);
  const batch = [];
  let imported = 0;
  let skipped = 0;

  for await (const row of fs.createReadStream(resolvedFile).pipe(csv())) {
    const mapped = mapRow(row);
    if (!mapped) {
      skipped += 1;
      continue;
    }
    batch.push(mapped);
    if (batch.length >= 500) {
      await insertBatch(batch.splice(0, batch.length));
      imported += 500;
      console.log(`Imported ${imported} rows...`);
    }
  }

  if (batch.length) {
    imported += batch.length;
    await insertBatch(batch);
  }

  console.log(`Import complete. Imported ${imported}, skipped ${skipped}.`);
  process.exit(0);
})().catch((error) => {
  console.error("College import failed:", error);
  process.exit(1);
});
