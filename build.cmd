rmdir /q/s build
mkdir build
robocopy "src/templates" "build/templates" /E
npx tsc --build --force --verbose