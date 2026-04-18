const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const db = require("../db");

const args = process.argv.slice(2);

const getArgValue = (flag) => {
  const entry = args.find((arg) => arg.startsWith(`${flag}=`));
  return entry ? entry.slice(flag.length + 1) : "";
};

const csvFile = getArgValue("--file");
const sourceName = getArgValue("--source") || "AISHE";
const sourceUrl = getArgValue("--source-url") || "";
const shouldTruncate = args.includes("--truncate");

if (!csvFile) {
  console.error(
    "Usage: node scripts/import_colleges_csv.js --file=path/to/colleges.csv [--source=AISHE] [--source-url=https://...] [--truncate]"
  );
  process.exit(1);
}

const resolvedFile = path.resolve(process.cwd(), csvFile);

if (!fs.existsSync(resolvedFile)) {
  console.error(`CSV file not found: ${resolvedFile}`);
  process.exit(1);
}

const pickValue = (row, keys) => {
  for (const key of keys) {
    const match = Object.keys(row).find(
      (column) => column.trim().toLowerCase() === key.trim().toLowerCase()
    );

    if (match && row[match] !== undefined && row[match] !== null) {
      const value = String(row[match]).trim();
      if (value) {
        return value;
      }
    }
  }

  return "";
};

const cleanWebsite = (website) => {
  if (!website) {
    return null;
  }

  const normalized = website.trim();
  if (!normalized) {
    return null;
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return `https://${normalized}`;
};

const toNullableNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : null;
};

const mapRowToCollege = (row) => {
  const collegeName = pickValue(row, [
    "College Name",
    "college_name",
    "Institution Name",
    "institute_name",
    "Name",
  ]);

  if (!collegeName) {
    return null;
  }

  const district = pickValue(row, ["District Name", "district", "District"]);
  const state = pickValue(row, ["State Name", "state", "State"]);
  const city = pickValue(row, ["City", "Town", "city"]);
  const address =
    pickValue(row, ["Address", "Full Address", "address"]) ||
    [city, district, state].filter(Boolean).join(", ");

  return {
    aisheCode: pickValue(row, [
      "AISHE Code",
      "aishe_code",
      "Institute ID",
      "institution_id",
    ]) || null,
    collegeName,
    universityName: pickValue(row, [
      "University Name",
      "university_name",
      "Affiliating University",
    ]) || null,
    collegeType: pickValue(row, [
      "College Type",
      "college_type",
      "Institution Type",
      "Type",
    ]) || null,
    managementType: pickValue(row, [
      "Management Type",
      "management_type",
      "Management",
    ]) || null,
    courseCategory: pickValue(row, [
      "Course Category",
      "course_category",
      "Category",
    ]) || null,
    city: city || null,
    district: district || null,
    state: state || null,
    pincode:
      pickValue(row, ["Pincode", "PIN Code", "Postal Code", "pincode"]) || null,
    address: address || null,
    websiteUrl: cleanWebsite(
      pickValue(row, [
        "Website",
        "Website URL",
        "website_url",
        "Official Website",
      ])
    ),
    phone:
      pickValue(row, ["Phone", "phone", "Contact Number", "Telephone"]) || null,
    email: pickValue(row, ["Email", "email", "E-mail"]) || null,
    latitude: toNullableNumber(
      pickValue(row, ["Latitude", "latitude", "Lat", "lat"])
    ),
    longitude: toNullableNumber(
      pickValue(row, ["Longitude", "longitude", "Lng", "lng", "Lon", "lon"])
    ),
    rating: toNullableNumber(pickValue(row, ["Rating", "rating"])) || null,
  };
};

const insertBatch = async (batch) => {
  if (!batch.length) {
    return;
  }

  const sql = `
    INSERT INTO colleges_directory (
      aishe_code,
      college_name,
      university_name,
      college_type,
      management_type,
      course_category,
      city,
      district,
      state,
      pincode,
      address,
      website_url,
      phone,
      email,
      latitude,
      longitude,
      rating,
      source,
      source_url
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
      source_url = COALESCE(VALUES(source_url), source_url)
  `;

  const values = batch.map((college) => [
    college.aisheCode,
    college.collegeName,
    college.universityName,
    college.collegeType,
    college.managementType,
    college.courseCategory,
    college.city,
    college.district,
    college.state,
    college.pincode,
    college.address,
    college.websiteUrl,
    college.phone,
    college.email,
    college.latitude,
    college.longitude,
    college.rating,
    sourceName,
    sourceUrl || null,
  ]);

  await db.query(sql, [values]);
};

const run = async () => {
  const createTableSql = fs.readFileSync(
    path.resolve(__dirname, "../sql/colleges_directory_schema.sql"),
    "utf8"
  );

  await db.query(createTableSql);

  if (shouldTruncate) {
    await db.query("TRUNCATE TABLE colleges_directory");
  }

  const stream = fs.createReadStream(resolvedFile).pipe(csv());
  const batch = [];
  let imported = 0;
  let skipped = 0;

  for await (const row of stream) {
    const mapped = mapRowToCollege(row);

    if (!mapped) {
      skipped += 1;
      continue;
    }

    batch.push(mapped);

    if (batch.length >= 500) {
      await insertBatch(batch.splice(0, batch.length));
      imported += 500;
      console.log(`Imported ${imported} rows so far...`);
    }
  }

  if (batch.length) {
    await insertBatch(batch);
    imported += batch.length;
  }

  console.log(
    `Import complete. Imported ${imported} rows from ${resolvedFile}. Skipped ${skipped} incomplete rows.`
  );
  process.exit(0);
};

run().catch((error) => {
  console.error("College import failed:", error);
  process.exit(1);
});
