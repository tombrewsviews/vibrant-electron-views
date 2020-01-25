# Vibrant Electron with Views Design Experiment

**Based on electron-quick-start project and Views to React Morpher**

This project is a sample app and a design experiment to play with blur as a background of the app and app elements.
This new style orginated in recent OSX and can be seen in use in Safari, Finder, and other OSX apps.

We use this project to discover new design styles and patterns, but it can be used as an Electron desktop app starting point.


## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/tombrewsviews/vibrant-electron-views

# Go into the Views App folder in the repository
cd vibrant-electron-views/replace-with-my-app

# Install dependencies
yarn install

# Run the Views app
yarn start

# Open new tab in Terminal and go folder up
cd ..

# Install dependencies
yarn install

# Run the app
yarn start
```
Important: You always need to run Views app in one tab of the Terminal and Electron app in another tab.
Note: Made for Mac

## To Mess About With
In `main.js` file you can find the vibrancy prop together with accepted values. Use it to change the blur effect of the Electron window.
```
vibrancy: 'popover',
//titlebar | selection | menu | popover | sidebar | header | sheet | window | hud | fullscreen-ui | tooltip | content
```
To load an app from a different URL (if you are using one) change the destination in the loadURL, also in the `main.js` file.
```
// and load the index.html of the app.
mainWindow.loadURL('http://localhost:3000')
```

## Resources for Learning Views
- [Views Docs](https://github.com/viewstools/docs)


## Resources for Learning Electron
- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
