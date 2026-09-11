#!/usr/bin/env node
/**
 * O tsconfig.esm.json usa moduleResolution "bundler", então o tsc emite
 * imports relativos sem extensão (ex: "./cpf"). Bundlers resolvem isso,
 * mas o resolvedor nativo de ESM do Node.js exige a extensão ".js"
 * explícita. Este script reescreve os imports/exports relativos gerados
 * em dist/esm para incluir ".js", tornando o build ESM consumível
 * diretamente pelo Node, sem depender de um bundler.
 */
const fs = require('fs');
const path = require('path');

const target = process.argv[2] || path.join(__dirname, '..', 'dist', 'esm');

const relativeSpecifier = /(\bfrom\s+|\bimport\s*\()(['"])(\.[^'"]+)\2/g;

function fixFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const fixed = original.replace(relativeSpecifier, (match, prefix, quote, specifier) => {
    if (/\.[a-zA-Z0-9]+$/.test(specifier)) return match;
    return `${prefix}${quote}${specifier}.js${quote}`;
  });
  if (fixed !== original) fs.writeFileSync(filePath, fixed);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.isFile() && entry.name.endsWith('.js')) fixFile(fullPath);
  }
}

walk(target);
