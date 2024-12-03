import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPO_API_DIR = path.join(__dirname, "../frontend-expo/api");
const SVELTE_API_DIR = path.join(__dirname, "../frontend-svelte/src/lib/api");

function getPublicMethods(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  const methods = [];
  let currentClassName = "";

  function visit(node) {
    if (ts.isClassDeclaration(node) && node.name) {
      currentClassName = node.name.text;
      if (currentClassName.endsWith("Api")) {
        node.members.forEach((member) => {
          if (
            ts.isMethodDeclaration(member) &&
            member.modifiers?.some(
              (mod) => mod.kind === ts.SyntaxKind.PublicKeyword
            )
          ) {
            const methodName = member.name.text;
            methods.push({
              name: methodName,
              className: currentClassName,
            });
          }
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return methods;
}

function updateIndexFile(apiMethods, apiDir) {
  const INDEX_FILE = path.join(apiDir, "index.ts");
  const indexContent = fs.readFileSync(INDEX_FILE, "utf-8");
  const sourceFile = ts.createSourceFile(
    INDEX_FILE,
    indexContent,
    ts.ScriptTarget.Latest,
    true
  );

  // Get unique API classes
  const apiClasses = [...new Set(apiMethods.map((m) => m.className))];

  // Generate imports
  const imports = apiClasses
    .map((className) => {
      const fileName = className.replace("Api", "").toLowerCase();
      return `import { ${className} } from "./${fileName}";`;
    })
    .join("\n");

  // Generate class properties
  const classProperties = apiClasses
    .map((className) => {
      const propertyName =
        className.charAt(0).toLowerCase() + className.slice(1);
      return `  private ${propertyName}: ${className};`;
    })
    .join("\n");

  // Generate method declarations
  const methodDeclarations = apiMethods
    .map((method) => `  public ${method.name};`)
    .join("\n");

  // Generate constructor assignments
  const constructorApiInstances = apiClasses
    .map((className) => {
      const propertyName =
        className.charAt(0).toLowerCase() + className.slice(1);
      return `    this.${propertyName} = new ${className}(accessToken);`;
    })
    .join("\n");

  const constructorMethodAssignments = apiMethods
    .map((method) => {
      const apiInstance =
        method.className.charAt(0).toLowerCase() + method.className.slice(1);
      return `    this.${method.name} = this.${apiInstance}.${method.name};`;
    })
    .join("\n");

  // Generate new index.ts content
  const newContent = `import { ApiBase } from "./base";
${imports}

export class Api extends ApiBase {
  // API classes
${classProperties}

  // Method declarations
${methodDeclarations}

  constructor(accessToken?: unknown) {
    // Running the ApiBase constructor
    super(accessToken);

    // API classes
${constructorApiInstances}

    // Assign methods inside constructor
${constructorMethodAssignments}
  }
}
`;

  fs.writeFileSync(INDEX_FILE, newContent);
}

function main() {
  // Handle Expo API
  const expoApiMethods = [];
  fs.readdirSync(EXPO_API_DIR)
    .filter(
      (file) =>
        file.endsWith(".ts") && file !== "index.ts" && file !== "base.ts"
    )
    .forEach((file) => {
      const filePath = path.join(EXPO_API_DIR, file);
      const methods = getPublicMethods(filePath);
      expoApiMethods.push(...methods);
    });

  // Handle Svelte API
  const svelteApiMethods = [];
  fs.readdirSync(SVELTE_API_DIR)
    .filter(
      (file) =>
        file.endsWith(".ts") && file !== "index.ts" && file !== "base.ts"
    )
    .forEach((file) => {
      const filePath = path.join(SVELTE_API_DIR, file);
      const methods = getPublicMethods(filePath);
      svelteApiMethods.push(...methods);
    });

  // Update both index files
  updateIndexFile(expoApiMethods, EXPO_API_DIR);
  updateIndexFile(svelteApiMethods, SVELTE_API_DIR);

  console.log("Successfully updated index.ts files in both API directories");
}

main();
