# MetaLamp second task
second test task from MetaLamp.


## Demo production version
https://nea2310.github.io/Metalamp-2nd-task/index.html


## Dependency
[jQuery](https://jquery.com/)<br>
[Range slider Metalamp](https://github.com/nea2310/Metalamp-4th-task)<br>
[Air Datepicker](https://github.com/t1m0n/air-datepicker)<br>


### File structure<br><br>


#### `config`
`config` contains webpack configuration<br><br>


#### `pixel-perfect`
`pixel-perfect` contains layout files<br><br>


#### `public`
`public` has the following structure:

```
public
└─── images
  └─── feedback
  └─── room-card
  └─── room-details
```

`images` contains mock images used by components or pages. These images will be replaced by real data from back-end in production mode<br><br>

#### `vendors`
`vendors` contains custom plugins not published on npm<br><br>
```
vendors
└─── slider-metalamp
```

#### `src`
```
src
| index.js
└─── components
└─── pages

```
`index.js` is the main file that imports each `.js` and `.scss` file in the `src` folder and  adds it to the bundle

`components` -  components available for all pages of the project

`pages` - all pages of the project<br><br>


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
* `components` contains one folder per component
* each component folder contains main `.pug` file with the template <br>
`.js`  and `.scss` files which are dynamically loaded in the `index.js` are included in the component folder if needed
* `.scss` contains **one BEM block** in the root of the file and all elements and modificators inside this block's structure<br><br>


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

* each page is extended from `pages/layout/layout.pug | pages/ui-kit-layout/ui-kit-layout.pug`<br><br>


#### `assets`
`assets` has the following structure:

```
assets
└─── favicons
| └─── favicons-extra
| └─── favicons-main
| └─── manifest
└─── fonts
└─── images
└─── styles
```

* `favicons-main` - main favicon of the project. 
* `favicons-extra` - additional favicons for different browsers and screen resolution
* `manifest` -  manifest file
* `fonts` - font files
* `images` contains images shared among more than one component<br><br>
* `styles` - files with global styles of the project<br><br>

#### `shared`
`shared` has the following structure:

```
shared
└─── helpers
```
`helpers` contains service functions used for data validation in components<br><br>


## How to work
#### Install dependencies
```commandline
npm i
```

#### Start webpack devserver
```commandline
npm start
```
go to http://localhost:8080/

#### Create bundle files in development mode
```commandline
npm run dev
```
bundle files will be created in folder **dist**

#### Create bundle files in production mode
```commandline
npm run build
```
bundle files will be created in folder **dist**