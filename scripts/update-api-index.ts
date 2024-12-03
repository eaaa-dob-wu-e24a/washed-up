import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

const API_DIR = path.join(__dirname, "../frontend-expo/api");
const INDEX_FILE = path.join(API_DIR, "index.ts");

interface ApiMethod {
  name: string;
  className: string;
}

function getPublicMethods(filePath: string): ApiMethod[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  const methods: ApiMethod[] = [];
  let currentClassName = "";

  function visit(node: ts.Node) {
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
            const methodName = (member.name as ts.Identifier).text;
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

function updateIndexFile(apiMethods: ApiMethod[]) {
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

  constructor(accessToken?: unknown | undefined) {
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
  const apiMethods: ApiMethod[] = [];

  // Read all .ts files in the API directory
  fs.readdirSync(API_DIR)
    .filter(
      (file) =>
        file.endsWith(".ts") && file !== "index.ts" && file !== "base.ts"
    )
    .forEach((file) => {
      const filePath = path.join(API_DIR, file);
      const methods = getPublicMethods(filePath);
      apiMethods.push(...methods);
    });

  updateIndexFile(apiMethods);
  console.log("Successfully updated index.ts with all API methods");
}

main();
