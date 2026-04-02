#!/bin/bash

echo 'Inicia execução do publish'

rm    -r ./dist
mkdir -p ./dist
mkdir -p ./dist/esm


# Remove o dist originalmente para não deixar lixo
# echo 'Remove o ./dist para não deixar lixo'
# rm dist -r

# Executa o build do typescript
# echo 'Executa o build do typescript'
# Executa o build do typescript (CJS)
./node_modules/.bin/tsc

# Executa o build do typescript (ESM)
./node_modules/.bin/tsc -p tsconfig.esm.json


# Remove os testes copiadps pelo build
# rm -r dist/test

# Move o conteúdo do dist/src para dentro de dist
# cp package*.json ./dist/
# cp readme.md ./dist/
# Move o conteúdo do dist/src para dentro de dist (CJS)
cp -r output/src/* ./dist/

# Move o conteúdo do output-esm/src para dentro de dist/esm (ESM)
cp -r output-esm/src/* ./dist/esm/

# Marca o diretório esm como ESM para Node.js
echo '{"type":"module"}' > ./dist/esm/package.json

# Remove o dist/src
# rm dist/src -r
# rm dist/test -r

# Copia package.json, package-lock.json, readme.md para dentro de dist
# cp package*.json readme.md dist