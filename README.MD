## Base Files for Eleventy Projects
This is a base set of files needed to start a project in Eleventy. Make a project directory and put these files in it.

- .eleventy.js - defines source and output locations; provides support for sass files in BrowserSync such that an entire 11ty rebuild is not required when a sass file changes; only the sass rebuild takes place
- package.json - defines scripts for watching and building 11ty site from source (it is automatically created when running 'npm init -y'; see below)
- /src - all markup files to be processed by 11ty (html, md, etc.); this includes other directories such as _includes, _layouts, and _data; processing by 11ty results in the output of static site in _site directory
- /images - all images used on the site
- /sass - where all sass source files live; processed by sass npm module and output to _site/css directory
- /js - where all local js files live

## After placing these files in a project directory, run the following commands in the terminal:
- cd <your prject directory>
- npm init -y (creates a package.json file)
- npm install --save-dev @11ty/eleventy (installs the 11ty package, updating package.json)
- npm install --save-dev sass (installs the sass package, also updating package.json)

## Add the following to the "scripts property" in package.json:
    "watch:eleventy": "npx @11ty/eleventy --serve",
    "watch:sass": "npx sass sass:_site/css --watch",
    "start": "npm run watch:eleventy & npm run watch:sass"

## Run "npm start" to get things rolling
