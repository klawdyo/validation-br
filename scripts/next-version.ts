import fs from 'node:fs'
import { join } from 'node:path';
import { cwd } from 'node:process';

const path = join(cwd(), 'package.json')
console.log('PATh:', path);


const data = fs.readFileSync(path, 'utf-8')
const json = JSON.parse(data);
console.log(json.version);
