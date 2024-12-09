rm -rf build
mkdir -p build
cp -R src/templates build/templates
npx tsc --build --force --verbose