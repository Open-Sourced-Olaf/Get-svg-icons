# Get Svg Icons
View icons from bootstrap's icon library and insert them into your code through snippets.

## Installation

- Go to VS Marketplace https://marketplace.visualstudio.com/items?itemName=marcochan.get-svg-icons to install the extension

## Features

### Side Panel with customizable icons

- Side Panel with around 1300+ icons
- Users can search for the icon-name (or tags associated with it) and choose the desired icon
- On clicking on the icon, corresponding svg code will be inserted at the last active position on the code editor
- Users can change the height and width of the svg directly from the side panel
![demo](https://raw.githubusercontent.com/anjalisoni3655/Get-svg-icons/staging/screenshots/side-panel.gif)


### Inline Icon suggestions

- Type "icon-" (without quotes) to start auto-completing icons. If the icon preview is not showing up (as shown in the GIF below), press Ctrl+Space (default hotkey) or press the  ">" icon to expand the details view.
- An inline replacement of the selected icon with its svg will be done.
![demo](https://raw.githubusercontent.com/Open-Sourced-Olaf/Get-svg-icons/staging/screenshots/inline_icon_completion.gif)

### Icon preview on hover
- On hovering over the svg code (class name) , you can preview the icon of the corresponding svg snippet

## Built with:
- Typescript
- VS Code API
- Python for web-scraping

## Extension Settings

To customize languages we support for inline snippet completion, icon-color and icon-size for hover preview

- Navigate to extension settings
- Choose ```Extension Settings```
- From here, you can customize ```getSvgIcons.iconColor```, ```getSvgIcons.iconSize``` and ```getSvgIcons.selector```

## Icon source
- [Bootstrap Icons](https://github.com/twbs/icons)

## Prefixes

| Prefix         | SVG Icons                           | Version |
|----------------|-------------------------------------|---------|
| `icon-`           | Bootstrap Icons              | 1.0     |

## Contributors

- [Bodhisha Thomas](https://github.com/bodhisha)
- [Marco Chan](https://github.com/m2chan)
- [Rashi Sharma](https://github.com/rashi-s17)
- [Steven Tey](https://github.com/steven-tey)
- [Sumi Kolli](https://github.com/sgkolli535)

## How to run locally?
- Clone the repository

  ```git clone https://github.com/Open-Sourced-Olaf/Get-svg-icons.git```
- Install node dependencies with ```npm install```
- Open project with VS Code
- Press F5 or run Launch Extension in the debug window or run ```npm run compile```

## How to contribute?
Take a look at the [contribution guidelines](https://github.com/Open-Sourced-Olaf/Get-svg-icons.git
) and open a [new issue](https://github.com/Open-Sourced-Olaf/Get-svg-icons/issues) or [pull request](https://github.com/Open-Sourced-Olaf/Get-svg-icons/pulls) on GitHub.

## Release Notes

### 1.0.0

Initial release of the extension

-----------------------------------------------------------------------------------------------------------


