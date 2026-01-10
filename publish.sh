#!/bin/bash

echo 'Inicia execução do publish'

rm    -r ./dist
mkdir -p ./dist


# Remove o dist originalmente para não deixar lixo
# echo 'Remove o ./dist para não deixar lixo'
# rm dist -r

# Executa o build do typescript
# echo 'Executa o build do typescript'
tsc


# Remove os testes copiadps pelo build
# rm -r dist/test

# Move o conteúdo do dist/src para dentro de dist
# cp package*.json ./dist/
# cp readme.md ./dist/
cp -r output/src/* ./dist/

# Remove o dist/src
# rm dist/src -r
# rm dist/test -r

# Copia package.json, package-lock.json, readme.md para dentro de dist
# cp package*.json readme.md dist