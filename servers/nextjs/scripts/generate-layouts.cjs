#!/usr/bin/env node
/**
 * generate-layouts.js
 *
 * Generates 9 new template groups from the neo-pulse archetype layouts.
 * Each group gets 10 transformed layout TSX files, a settings.json, and a barrel index.ts.
 * Also creates the barrel index.ts for neo-pulse itself.
 *
 * Usage: node scripts/generate-layouts.js
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '..', 'app', 'presentation-templates');
const SOURCE_GROUP = 'neo-pulse';

// ---------- Archetypes ----------

const ARCHETYPES = [
    { file: 'StepProcessLayout', alias: 'stepProcess' },
    { file: 'SWOTGridLayout', alias: 'swotGrid' },
    { file: 'PersonaCardLayout', alias: 'personaCard' },
    { file: 'PricingTierLayout', alias: 'pricingTier' },
    { file: 'RoadmapLayout', alias: 'roadmap' },
    { file: 'DataCalloutLayout', alias: 'dataCallout' },
    { file: 'QuoteHighlightLayout', alias: 'quoteHighlight' },
    { file: 'ComparisonTableLayout', alias: 'comparisonTable' },
    { file: 'MilestoneLayout', alias: 'milestone' },
    { file: 'TeamGridLayout', alias: 'teamGrid' },
];

// ---------- Target groups ----------
// Source (neo-pulse): left border, 3px, rounded-md cards, h-[6px] accent bars

const TARGET_GROUPS = {
    'neo-grid': {
        borderSide: 'top',
        borderWidth: 2,
        cardRadius: 'rounded-sm',
        accentH: 3,
        accentW: 'w-20',
        description: 'Clean grid-based layouts with top border accents and structured alignment',
    },
    'neo-bold': {
        borderSide: 'left',
        borderWidth: 5,
        cardRadius: 'rounded-lg',
        accentH: 8,
        accentW: 'w-12',
        description: 'High-impact layouts with thick accents and bold visual weight',
    },
    'neo-minimal': {
        borderSide: 'bottom',
        borderWidth: 2,
        cardRadius: 'rounded-lg',
        accentH: 2,
        accentW: 'w-24',
        description: 'Understated layouts with fine bottom borders and generous whitespace',
    },
    'neo-dark': {
        borderSide: 'left',
        borderWidth: 4,
        cardRadius: 'rounded-md',
        accentH: 5,
        accentW: 'w-16',
        description: 'Dark-ready layouts with refined left accents and deeper contrast',
    },
    'neo-executive': {
        borderSide: 'bottom',
        borderWidth: 3,
        cardRadius: 'rounded-sm',
        accentH: 4,
        accentW: 'w-16',
        description: 'Polished corporate layouts with bottom border accents and restrained style',
    },
    'neo-vibrant': {
        borderSide: 'left',
        borderWidth: 4,
        cardRadius: 'rounded-xl',
        accentH: 6,
        accentW: 'w-10',
        description: 'Energetic layouts with rounded corners and vivid accent bars',
    },
    'neo-editorial': {
        borderSide: 'top',
        borderWidth: 3,
        cardRadius: 'rounded-none',
        accentH: 3,
        accentW: 'w-20',
        description: 'Magazine-style layouts with top borders and sharp typographic hierarchy',
    },
    'neo-data': {
        borderSide: 'left',
        borderWidth: 2,
        cardRadius: 'rounded-sm',
        accentH: 4,
        accentW: 'w-12',
        description: 'Data-focused layouts with thin left accents and compact information density',
    },
    'neo-clean': {
        borderSide: 'top',
        borderWidth: 3,
        cardRadius: 'rounded-xl',
        accentH: 5,
        accentW: 'w-16',
        description: 'Fresh modern layouts with top borders and rounded card elements',
    },
};

// ---------- Border side mapping ----------

const BORDER_MAP = {
    left:   { tw: 'l', css: 'Left' },
    top:    { tw: 't', css: 'Top' },
    bottom: { tw: 'b', css: 'Bottom' },
    right:  { tw: 'r', css: 'Right' },
};

// ---------- Transform function ----------

function transformSource(source, config) {
    let result = source;
    const { borderSide, borderWidth, cardRadius, accentH, accentW } = config;
    const { tw, css } = BORDER_MAP[borderSide];

    // 1. Tailwind border class: border-l-[3px] → border-{tw}-[{w}px]
    result = result.replace(/border-l-\[3px\]/g, `border-${tw}-[${borderWidth}px]`);

    // 2. CSS borderLeftColor → border{Css}Color
    result = result.replace(/borderLeftColor/g, `border${css}Color`);

    // 3. CSS borderLeft (not followed by Color) → border{Css}
    //    Handles: borderLeft: `3px solid...` and borderLeft: '3px solid...'
    result = result.replace(/borderLeft(?!Color)/g, `border${css}`);

    // 4. Border width in inline style shorthand: 3px solid → {w}px solid
    result = result.replace(/3px solid/g, `${borderWidth}px solid`);

    // 5. Accent bar: h-[6px] w-{number} → h-[{accentH}px] {accentW}
    //    Matches accent bars (w-14, w-16) but NOT:
    //    - Bullet dots: w-[6px] h-[6px] (w comes first)
    //    - Full-width bars: h-[6px] w-full (w-full has letters, not digits)
    result = result.replace(/h-\[6px\] (w-\d+)/g, `h-[${accentH}px] ${accentW}`);

    // 6. Card border radius: rounded-md → {cardRadius}
    //    Outer container uses rounded-sm, so word boundary prevents false matches
    result = result.replace(/\brounded-md\b/g, cardRadius);

    return result;
}

// ---------- Barrel index.ts generator ----------

function toCamelCase(name) {
    return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function generateBarrelIndex(groupName) {
    const camel = toCamelCase(groupName);
    const arrayName = `${camel}Templates`;

    const imports = ARCHETYPES.map(({ file, alias }) =>
        `import ${file}, { Schema as ${alias}Schema, layoutId as ${alias}Id, layoutName as ${alias}Name, layoutDescription as ${alias}Desc } from './${file}';`
    ).join('\n');

    const entries = ARCHETYPES.map(({ file, alias }) =>
        `    createTemplateEntry(${file}, ${alias}Schema, ${alias}Id, ${alias}Name, ${alias}Desc, templateName, '${file}'),`
    ).join('\n');

    return `import { createTemplateEntry, TemplateWithData } from '../utils';
import settings from './settings.json';

${imports}

const templateName = '${groupName}';

export const ${arrayName}: TemplateWithData[] = [
${entries}
];

export { settings };
`;
}

// ---------- Settings.json generator ----------

function generateSettings(description) {
    return JSON.stringify({ description, ordered: false, default: false }, null, 4) + '\n';
}

// ---------- Main ----------

function main() {
    const sourceDir = path.join(TEMPLATES_DIR, SOURCE_GROUP);

    // Read all source files
    const sourceFiles = {};
    for (const { file } of ARCHETYPES) {
        const filePath = path.join(sourceDir, `${file}.tsx`);
        if (!fs.existsSync(filePath)) {
            console.error(`Source file not found: ${filePath}`);
            process.exit(1);
        }
        sourceFiles[file] = fs.readFileSync(filePath, 'utf-8');
    }

    console.log(`Read ${Object.keys(sourceFiles).length} source files from ${SOURCE_GROUP}`);

    // Generate neo-pulse barrel index.ts (source group)
    const neoPulseBarrel = generateBarrelIndex(SOURCE_GROUP);
    fs.writeFileSync(path.join(sourceDir, 'index.ts'), neoPulseBarrel);
    console.log(`Created barrel index.ts for ${SOURCE_GROUP}`);

    // Generate each target group
    for (const [groupName, config] of Object.entries(TARGET_GROUPS)) {
        const groupDir = path.join(TEMPLATES_DIR, groupName);

        // Create directory
        fs.mkdirSync(groupDir, { recursive: true });

        // Write settings.json
        fs.writeFileSync(
            path.join(groupDir, 'settings.json'),
            generateSettings(config.description)
        );

        // Write transformed TSX files
        for (const { file } of ARCHETYPES) {
            const transformed = transformSource(sourceFiles[file], config);
            fs.writeFileSync(path.join(groupDir, `${file}.tsx`), transformed);
        }

        // Write barrel index.ts
        const barrelIndex = generateBarrelIndex(groupName);
        fs.writeFileSync(path.join(groupDir, 'index.ts'), barrelIndex);

        console.log(`Generated ${groupName}: 10 layouts + settings.json + index.ts`);
    }

    // Print what needs to be added to the main index.tsx
    console.log('\n=== Add the following to presentation-templates/index.tsx ===\n');

    // Import lines
    const allGroups = [SOURCE_GROUP, ...Object.keys(TARGET_GROUPS)];
    console.log('// --- Import new template groups ---');
    for (const group of allGroups) {
        const camel = toCamelCase(group);
        console.log(`import { ${camel}Templates, settings as ${camel}Settings } from './${group}';`);
    }

    console.log('\n// --- Add to allLayouts array (spread into existing array) ---');
    for (const group of allGroups) {
        const camel = toCamelCase(group);
        console.log(`    ...${camel}Templates,`);
    }

    console.log('\n// --- Add to templates array (new entries) ---');
    for (const group of allGroups) {
        const camel = toCamelCase(group);
        const displayName = group.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
        console.log(`    {`);
        console.log(`        id: '${group}',`);
        console.log(`        name: '${displayName}',`);
        console.log(`        description: ${camel}Settings.description,`);
        console.log(`        settings: ${camel}Settings as TemplateGroupSettings,`);
        console.log(`        layouts: ${camel}Templates,`);
        console.log(`    },`);
    }

    console.log('\nDone! Generated 9 groups x 10 layouts = 90 new layout files.');
    console.log('Plus 10 barrel index.ts files (1 for neo-pulse + 9 for new groups).');
    console.log('Total new layouts: 100 (10 neo-pulse + 90 generated).');
}

main();
