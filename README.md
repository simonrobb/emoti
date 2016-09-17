# emoti
Learn words by emoji

## Converting svg image set
The emoji-one image set is available in svg, however React Native doesn't support svg images. The `convert.sh` script can be used to batch convert svg images in the `./emoji-one` folder to png images at the correct sizes in the `./emojis` folder.

### Dependencies
Run `npm install -g svgexport`
Run `brew install optipng`
Run `./convert.sh`