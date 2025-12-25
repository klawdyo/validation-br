#!/bin/bash

# Remove o dist originalmente para não deixar lixo
rm dist -r

# Executa o build do typescript
tsc

# Remove os testes copiadps pelo build
# rm -r dist/test

# Move o conteúdo do dist/src para dentro de dist
mv dist/src/* dist

# Remove o dist/src
# rm dist/src -r

# Copia package.json, package-lock.json, readme.md para dentro de dist
# cp package*.json readme.md dist