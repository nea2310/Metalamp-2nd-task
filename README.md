# MetaLamp second task
second test task from MetaLamp.


## Demo production version
https://nea2310.github.io/Metalamp-2nd-task/index.html

## Dependency
[jQuery](https://jquery.com/)<br>
[Ion.RangeSlider](https://github.com/IonDen/ion.rangeSlider)<br>
[Air Datepicker](https://github.com/t1m0n/air-datepicker)<br>

### File structure

#### `configuration`
Contains webpack configuration

#### `src`
```
src
| index.js
└─── components
└─── pages

```
`index.js` is a main file that imports each `.js` and `.scss` file in the `src` folder and automatically adds it to the bundle.

`components` - this folder includes all components available for all pages.

`pages` - this folder includes all pages of the project.

#### `components`
`components` has the following structure:
```
components
└─── booking
| |  booking.pug
| |  booking.js
| |  booking.scss
| └─── image
| | |  info.svg
|
└─── button
| |  button.pug
| |  button.js
| |  button.scss
| └─── image
| | |  arrow-forward-white.svg
```
* `components` contains one folder per component. 
* Each component folder contains main `.pug` file with the template. <br>
`.js`  and `.scss` files which are dynamically loaded in the `index.js` are included in the component folder if needed.
* `.scss` contains **one BEM block** in the root of the file and all elements and modificators inside this block's structure.

#### `pages`
`pages` has the following structure:

```
pages
└─── landing-page
| |  landing-page.pug
| |  landing-page.js
| |  landing-page.scss
| └─── image
| | |  living-room.jpg
|
└─── registration-page
| |  registration-page.pug
| |  registration-page.js
| |  registration-page.scss
| └─── image
| | |  bedroom.jpg
```

* each page is extended from `pages/layout/layout.pug | pages/ui-kit-layout/ui-kit-layout.pug`

#### `assets`
`assets` has the following structure:

```
assets
└─── favicons
| └─── favicons-extra
| └─── favicons-main
| └─── manifest
└─── fonts
└─── styles
```

#### `utils`
`utils` has the following structure:

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