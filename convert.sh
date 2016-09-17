rm -rf emojis && mkdir emojis;
for file in emoji-one/*.svg; 
do svgexport "$file" "${file/%svg/png}" 600: && optipng "${file/%svg/png}";
done;