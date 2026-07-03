const fs = require('fs');

const log = fs.readFileSync('build.log', 'utf8');

const regex = /([^:]+)\((\d+),(\d+)\): error TS6133: '([^']+)' is declared but its value is never read./g;
let match;

const modifications = {};

while ((match = regex.exec(log)) !== null) {
    const file = match[1].trim();
    const line = parseInt(match[2], 10);
    const unusedVar = match[4];

    if (!modifications[file]) {
        modifications[file] = {
            lines: fs.readFileSync(file, 'utf8').split('\n'),
            toRemove: []
        };
    }
    
    // Instead of deleting the line, let's remove the variable from the line
    const l = line - 1;
    let lineContent = modifications[file].lines[l];
    
    // If it's an import, try to remove it
    if (lineContent.startsWith('import')) {
        // remove `VarName, ` or `VarName ,` or `, VarName`
        lineContent = lineContent.replace(new RegExp(`\\b${unusedVar}\\b\\s*,?\\s*`), '');
        lineContent = lineContent.replace(/,\s*}/, ' }');
        lineContent = lineContent.replace(/\{\s*\}/, '');
        if (lineContent.trim() === 'import from "./turnosApi";' || lineContent.trim() === 'import  from "./turnosApi";' || lineContent.trim().startsWith('import ""')) {
            lineContent = ''; // remove completely
        }
    } else if (lineContent.includes('const') || lineContent.includes('let')) {
        // If it's a const declaration, just comment it out
        lineContent = `// ${lineContent}`;
    }
    
    modifications[file].lines[l] = lineContent;
}

// Write modifications
for (const file in modifications) {
    fs.writeFileSync(file, modifications[file].lines.join('\n'), 'utf8');
}

// Fix missing imports (like useTurnos)
// The log also says: src/turnos/TurnosPage.tsx(189,7): error TS2304: Cannot find name 'useTurnos'.
// Let's just manually fix TurnosPage.tsx by re-adding `import { useTurnos } from "./useTurnos";` if it's missing
const turnosPageFile = 'src/turnos/TurnosPage.tsx';
if (fs.existsSync(turnosPageFile)) {
    let turnosContent = fs.readFileSync(turnosPageFile, 'utf8');
    if (!turnosContent.includes('import { useTurnos }')) {
        turnosContent = 'import { useTurnos } from "./useTurnos";\n' + turnosContent;
    }
    fs.writeFileSync(turnosPageFile, turnosContent, 'utf8');
}

console.log("Fixed unused variables based on build log.");
