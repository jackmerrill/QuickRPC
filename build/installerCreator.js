import {MSICreator} from 'electron-wix-msi'

// Step 1: Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: 'dist/quickrpc-win32-x64',
  description: 'Discord Rich Presence quickly and easily. Made in Electron.js.',
  exe: 'quickrpc',
  name: 'QuickRPC',
  manufacturer: 'Jack Merrill',
  version: '1.0.1',
  outputDirectory: '../releases/installers'
});

// Step 2: Create a .wxs template file
msiCreator.create();

// Step 3: Compile the template to a .msi file
msiCreator.compile();