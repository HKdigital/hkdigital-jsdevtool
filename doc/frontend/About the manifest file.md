
# About the `manifest.{webmanifest|json}` file

A web application can be made `installable` by adding a `manifest.webmanifest` or `manifest.json` file to your project. In this article you'll find some practical information about how to do that.

This article is intended for quick lookup. The information is partially extacted from this article: https://web.dev/add-manifest/.


## Usage

### Where to place the file?
Place your `manifest.webmanifest` file in your web root folder.

### Link manifest from `index.html`
Add a `<link>` tag to the html head part in your `index.html` file.

```html
<link rel="manifest" href="/manifest.webmanifest">
```

### How should the file be called? `manifest.webmanifest` or `manifest.json`?

`manifest.webmanifest` is the official file name. Since the file contains JSON, people started to use `.json` as extension. All browsers accept `manifest.json`.

If you use the official name, also let your webserver set the MIME type to `application/manifest+json`. Otherwise you can better use `manifest.json`.

### Test your manifest
Use e.g. chrome's development tools to check if your manifest file works as expected.


## Manifest properties

### `start_url` (required)
The start_url is required and tells the browser where your application should start when it is launched, and prevents the app from starting on whatever page the user was on when they added your app to their home screen.

## `scope` (required)
The scope defines the set of URLs that the browser considers to be within your app, and is used to decide when the user has left the app. The scope controls the URL structure that encompasses all the entry and exit points in your web app. Your start_url must reside within the scope.

### `short_name` and/or `name` (required)
You must provide at least the short_name or name property. If both are provided, short_name is used on the user's home screen, launcher, or other places where space may be limited. name is used when the app is installed.

### `description` (recommended)
A short description of your web application.

### `display_override` (recommended)
The display_override property, which the browser considers before the display property, may contain a sequence of strings that are considered in the listed order, and the first supported display mode is applied. If none are supported, the browser falls back to evaluating the display field. The browser will not consider display_override unless display is also present.

e.g.
```json
{
  "display_override": ["standalone", "minimal-ui"],
  "display": "browser"
}
```

@see https://developer.mozilla.org/en-US/docs/Web/Manifest/display_override

### `display` (required)
You can customize what browser UI is shown when your app is launched. For example, you can hide the address bar and browser chrome. Games can even be made to launch full screen.

Options: `fullscreen`|`standalone`|`minimal-ui`|`browser`

### `background_color` (recommended)
The background_color property is used on the splash screen when the application is first launched on mobile.

### `theme_color` (recommended)
The theme_color sets the color of the tool bar, and may be reflected in the app's preview in task switchers. The theme_color should match the meta theme color specified in your document head. As of Chromium 93 and Safari 15, you can adjust this color based on a media query with the media attribute of the meta theme color element in your html file. E.g. for light or dark themes.


### `icons` (required)

#### `Android` and `chromium`
For Chromium, you must provide at least a 192x192 pixel icon, and a 512x512 pixel icon. If only those two icon sizes are provided, Chrome will automatically scale the icons to fit the device. If you'd prefer to scale your own icons, and adjust them for pixel-perfection, provide icons in increments of 48dp.

Interesting options to investigate:
- Using scalable icons (SVG)
- Using maskable icons

@see https://web.dev/maskable-icon/

#### `iOS` icons
Unfortunately, iOS does not use the icons specified in the Web App Manifest. You can specify an icon, using the following line in the head element of your HTML code:

```html
<link rel="apple-touch-icon" href="single-page-icon.png">
```

The following example, which specifies sizes for the most common iOS devices, is from Apple’s Safari Web Content Guide.

```html
<link rel="apple-touch-icon" href="touch-icon-iphone.png">
<link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad.png">
<link rel="apple-touch-icon" sizes="180x180" href="touch-icon-iphone-retina.png">
<link rel="apple-touch-icon" sizes="167x167" href="touch-icon-ipad-retina.png">
```

https://medium.com/appscope/designing-native-like-progressive-web-apps-for-ios-1b3cdda1d0e8

### How to generate all the different icon formats?

E.g. using an online service like https://appiconmaker.co/.

To optimize your PNG's use an online service like https://tinypng.com/

---
Consider to use use lowercase only for your icon file names to prevent issues when uploading to a webserver using FTP.
---

## References

Most important things explained
https://web.dev/add-manifest/

About app shortcuts
https://web.dev/app-shortcuts/

Native like web applications for iOS
https://medium.com/appscope/designing-native-like-progressive-web-apps-for-ios-1b3cdda1d0e8

iOS icons
https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html

iOS meta tags
https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html#//apple_ref/doc/uid/TP40008193-SW8

MDN
https://developer.mozilla.org/en-US/docs/Web/Manifest
https://developer.mozilla.org/en-US/docs/Web/Manifest/display_override
