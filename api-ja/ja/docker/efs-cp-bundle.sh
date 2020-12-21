export GOGO_EFS=${CB}/api.gogojungle.co.jp
export GOGO_WD=${EFS}/api-ja
rm -rf ${GOGO_WD}/*
${GOGO_EFS}/ja/docker/cp-bundle.sh
