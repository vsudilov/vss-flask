for i in 0 1 2 3 4 5 6 7 8 9 10;
do
  convert ${i}_sed.png -resize 357x194\! ${i}_sed.png
done
