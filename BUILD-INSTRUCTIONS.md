# Building InfinityTrain on a Machine With Node.js

Since Node.js is not installed on this PC, you'll need to build the standalone executable on a different machine that has Node.js installed, then copy the resulting .exe file back to this PC.

## On a Machine WITH Node.js:

### Step 1: Install Node.js (if not already installed)
Download and install Node.js from: https://nodejs.org/ (LTS version recommended)

### Step 2: Copy the Project
Copy the entire `Infinitytrain2` folder to the build machine.

### Step 3: Open PowerShell/Command Prompt
Navigate to the project folder:
```powershell
cd path\to\Infinitytrain2
```

### Step 4: Install Dependencies
```powershell
npm install
```

This will install all required packages including:
- better-sqlite3 (database)
- pkg (for creating standalone exe)
- All React and Express dependencies

### Step 5: Build the Standalone Executable
Run the build script:
```powershell
.\build-exe.bat
```

Or manually:
```powershell
npm run build
npx pkg dist/index.js --targets node20-win-x64 --output InfinityTrain.exe
```

### Step 6: Copy Back to This PC
Copy these files back to this PC:
- `InfinityTrain.exe` - The standalone application
- `InfinityTrain-Launcher.bat` - (Optional) Easy launcher script

## On This PC (WITHOUT Node.js):

Once you have the `InfinityTrain.exe` file:

1. **Place the file** anywhere on your computer
2. **Run it** by double-clicking `InfinityTrain.exe` OR `InfinityTrain-Launcher.bat`
3. **Access** the application at http://localhost:5000 in your browser

## Alternative: Use a Development Machine

If you have access to:
- A colleague's computer with Node.js
- A virtual machine
- A cloud development environment (like Replit, CodeSandbox)

You can build there and transfer the .exe file.

## Quick Start for Developers

If you're on the build machine, here's the full process:

```powershell
# Install dependencies
npm install

# Build the application
npm run build

# Create the standalone exe
npx pkg dist/index.js --targets node20-win-x64 --output InfinityTrain.exe

# (Optional) Test it locally before distributing
.\InfinityTrain.exe
```

## File Size Note

The resulting `InfinityTrain.exe` will be approximately 50-70 MB because it includes:
- The complete Node.js runtime
- All application code
- All dependencies

This is normal for standalone Node.js applications created with pkg.

## Troubleshooting Build Issues

### "Cannot find module 'better-sqlite3'"
```powershell
npm install better-sqlite3
```

### "pkg: command not found"
```powershell
npm install -g pkg
# Or use npx: npx pkg ...
```

### Build fails with TypeScript errors
```powershell
npm run check
# Fix any errors, then rebuild
```

### Native module compilation issues (better-sqlite3)
Make sure you have:
- Visual Studio Build Tools (Windows)
- Python 3.x
- node-gyp

On Windows, run:
```powershell
npm install --global windows-build-tools
```

## Distribution

Once built, the `InfinityTrain.exe` can be:
- Copied to USB drives
- Shared via network
- Emailed (if size permits)
- Uploaded to cloud storage

No installation required on target machines - just run the .exe!
