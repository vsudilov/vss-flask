set -xe
SYNC="css fonts images"
for i in ${SYNC}; do
  aws s3 sync ${i} s3://www.vsudilovsky.com/${i}
done

aws s3 cp index.html s3://www.vsudilovsky.com/index.html
