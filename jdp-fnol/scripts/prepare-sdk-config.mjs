#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const root = path.dirname(url.fileURLToPath(import.meta.url)) + '/..';

const readDotEnv = file => {
    const full = path.resolve(root, file);

    if (!fs.existsSync(full)) {
        return {};
    }

    return Object.fromEntries(
        fs
            .readFileSync(full, 'utf8')
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .map(line => {
                const eq = line.indexOf('=');

                return [line.slice(0, eq), line.slice(eq + 1)];
            })
    );
};

const env = { ...readDotEnv('.env'), ...readDotEnv('.env.local'), ...process.env };
const pc = env.PC_PROXY_TARGET || env.REACT_APP_POLICY_CENTER_BASE_URL;
const cc = env.CC_PROXY_TARGET || env.REACT_APP_CLAIM_CENTER_BASE_URL;

if (!pc || !cc) {
    console.error(
        'prepare-sdk-config: set PC_PROXY_TARGET + CC_PROXY_TARGET in .env.local (or REACT_APP_*_BASE_URL)'
    );
    process.exit(1);
}

const config = {
    generators: [
        {
            name: 'PcSdk',
            target: 'PC',
            targetUrl: pc,
            disableSchemaGeneration: false,
            skipCompositeGeneration: false,
        },
        {
            name: 'CcSdk',
            target: 'CC',
            targetUrl: cc,
            disableSchemaGeneration: false,
            skipCompositeGeneration: false,
        },
    ],
};

const outDir = path.resolve(root, 'sdk-generator');
const outFile = path.join(outDir, 'config.json');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(config, null, 4) + '\n');
console.log(`prepare-sdk-config: wrote ${outFile} (PC=${pc}, CC=${cc})`);
