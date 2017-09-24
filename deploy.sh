SYNC="css fonts images index.html js"
for i in ${SYNC}; do
  aws s3 sync ${i} s3://www.vsudilovsky.com/
done
