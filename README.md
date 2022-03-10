# MetaLamp second task
second test task from MetaLamp.


## Demo production version
`https://nea2310.github.io/Metalamp-2nd-task/index.html`

### File structure
```
configuration
```
Contains webpack configuration imported in the webpack.config.js from the root directory

#### `src`
```
src
| index.ts
└─── components
└─── pages
└─── plugins
```
`index.ts` is a main file that imports each `.js` file in the `src` folder and automatically adds it to the bundle.

`components` - this folder includes all components available for all pages.

`pages` - this folder includes all pages of the project.

`plugins` - this folder includes all  plugins of the project.


#### `components`
`components` has the following structure:
```
components
└─── booking
| |  booking.pug
| |  booking.js
| |  booking.scss
| └─── img
| | |  info.svg
|
└─── btn
| |  btn.pug
| |  btn.js
| |  btn.scss
| └─── img
| | |  arrow-forward-white.svg
```
* `components` contains one folder per component. 
* Each component folder contains main `.pug` file with the template, `.js` that is dynamically loaded in the `index.ts`, scripts for this particular component and `.scss` file.
* `.scss` is imported in the `.js` and contains **one BEM block** in the root of the file and all elements and modificators inside this block's structure.



#### `pages`
`pages` has the following structure:

```
pages
└─── landing-page
| |  landing-page.pug
| |  landing-page.js
| |  landing-page.scss
| └─── img
| | |  living-room.jpg
|
└─── registration-page
| |  registration-page.pug
| |  registration-page.js
| |  registration-page.scss
| └─── img
| | |  bedroom.jpg
```

* each page is independent extended from `pages/layout/layout.pug | pages/ui-kit-layout/ui-kit-layout.pug`


#### `plugins`
`plugins` has the following structure:

```
plugins
└─── air-datepicker
| |  
| └─── css
| | |  datepicker.min.css
| |  
| └─── js
| | |  datepicker.min.js
|
└─── rangeSlider
| |  
| └─── css
| | |  ion.rangeSlider.min.css
| |  
| └─── js
| | |  ion.rangeSlider.min.js
| java-import.js
```

* All plugins dependencies are imported in file `java-import.js` in 'plugins' folder. File `java-import.js` in its turn is imported in `index.ts`

* These plugins are used by components of the project


## How to work
#### Install dependencies
```commandline
npm i
```

#### Start dev server
```commandline
npm start
```
go to `http://localhost:8080/`


#### On the production server create the bundle files
```commandline
npm run build
```