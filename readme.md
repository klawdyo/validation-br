# Tstrap

Pre-configured nodejs, typescript, eslint, jest, github-actions CI boilerplate project.

## Usage

in your `.bashrc` or `.zshrc` add the following function:

```
function tstrap() {
  [ -z $1 ] && echo "project name not specified" && echo "Usage: tstrap <project-name>" && return

   git clone --depth 1 git@github.com:GozaRuu/tstrap.git "$1"
   cd "$1"
   rm -rf .git
   git init
   yarn upgrade --latest
}

```

Afterwards you can generate typescript project by using `tstrap myProjectName`.
