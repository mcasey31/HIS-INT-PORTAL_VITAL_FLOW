const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

const pageFile = String.raw`c:\Users\marti\OneDrive\Desktop Laptop Samsung\VITALFLOW HIS\VitalFlow His\front\src\turnos\TurnosPage.tsx`;
const hookFile = String.raw`c:\Users\marti\OneDrive\Desktop Laptop Samsung\VITALFLOW HIS\VitalFlow His\front\src\turnos\useTurnos.tsx`;

let code = fs.readFileSync(pageFile, 'utf8');

const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
});

let componentPath = null;

traverse(ast, {
    ExportNamedDeclaration(path) {
        if (t.isFunctionDeclaration(path.node.declaration) && path.node.declaration.id.name === 'TurnosPage') {
            componentPath = path.get('declaration');
        }
    }
});

if (!componentPath) {
    console.error("Component TurnosPage not found!");
    process.exit(1);
}

const bodyBlock = componentPath.get('body');
const statements = bodyBlock.get('body');

const extractedStatements = [];
let returnStatement = null;

statements.forEach(stmt => {
    if (stmt.isReturnStatement()) {
        returnStatement = stmt;
    } else {
        extractedStatements.push(stmt.node);
    }
});

// Identify top-level declarations inside the component to export them
const exportsSet = new Set();

extractedStatements.forEach(stmt => {
    if (t.isVariableDeclaration(stmt)) {
        stmt.declarations.forEach(decl => {
            if (t.isIdentifier(decl.id)) {
                exportsSet.add(decl.id.name);
            } else if (t.isArrayPattern(decl.id)) {
                decl.id.elements.forEach(el => {
                    if (el && t.isIdentifier(el)) {
                        exportsSet.add(el.name);
                    }
                });
            } else if (t.isObjectPattern(decl.id)) {
                decl.id.properties.forEach(prop => {
                    if (prop && t.isIdentifier(prop.value)) {
                        exportsSet.add(prop.value.name);
                    }
                });
            }
        });
    } else if (t.isFunctionDeclaration(stmt)) {
        if (stmt.id && t.isIdentifier(stmt.id)) {
            exportsSet.add(stmt.id.name);
        }
    }
});

const exportNames = Array.from(exportsSet);

// Create the return statement for the hook
const hookReturnProperties = exportNames.map(name => {
    return t.objectProperty(t.identifier(name), t.identifier(name), false, true); // shorthand property
});
const hookReturnStatement = t.returnStatement(t.objectExpression(hookReturnProperties));

// Generate hook code
const hookAst = t.file(t.program([
    ...ast.program.body.filter(node => node !== componentPath.parent), // All imports and top level declarations
    t.exportNamedDeclaration(
        t.functionDeclaration(
            t.identifier('useTurnos'),
            [],
            t.blockStatement([
                ...extractedStatements,
                hookReturnStatement
            ])
        )
    )
]));

const hookCode = generator(hookAst, { retainLines: false }).code;
fs.writeFileSync(hookFile, hookCode, 'utf8');

// Now replace the component body
const hookCallDeclarators = exportNames.map(name => {
    return t.objectProperty(t.identifier(name), t.identifier(name), false, true);
});

const hookCall = t.variableDeclaration('const', [
    t.variableDeclarator(
        t.objectPattern(hookCallDeclarators),
        t.callExpression(t.identifier('useTurnos'), [])
    )
]);

bodyBlock.node.body = [
    hookCall,
    returnStatement.node
];

// Add import to original file
const importHook = t.importDeclaration(
    [t.importSpecifier(t.identifier('useTurnos'), t.identifier('useTurnos'))],
    t.stringLiteral('./useTurnos')
);

ast.program.body.unshift(importHook);

const newPageCode = generator(ast, { retainLines: false }).code;
fs.writeFileSync(pageFile, newPageCode, 'utf8');

console.log("Successfully extracted useTurnos via AST!");
