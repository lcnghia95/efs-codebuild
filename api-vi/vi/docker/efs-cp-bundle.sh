export GOGO_EFS=${CB}/api.gogojungle.co.jp
export GOGO_WD=${EFS}/api-vi
rm -rf ${GOGO_WD}/*
${GOGO_EFS}/vi/docker/cp-bundle.sh
