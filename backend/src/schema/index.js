import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read schema files
const schemaPath = join(__dirname, "schema.graphql");
const typeDefs = readFileSync(schemaPath, "utf-8");

export { typeDefs };
