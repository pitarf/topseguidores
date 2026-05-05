const fs = require('fs');
const content = fs.readFileSync('c:/Git/React/topseguidores/src/app/administracao/settings/SettingsForm.tsx', 'utf8');

let curly = 0;
let paren = 0;
let square = 0;
let inString = null;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (inString) {
        if (char === inString && content[i-1] !== '\\') inString = null;
        continue;
    }
    if (char === '"' || char === "'" || char === '`') {
        inString = char;
        continue;
    }
    if (char === '{') curly++;
    if (char === '}') curly--;
    if (char === '(') paren++;
    if (char === ')') paren--;
    if (char === '[') square++;
    if (char === ']') square--;
}

console.log({ curly, paren, square });
