set -e
REVEAL_VERSION="3.9.2"
#REVEAL_VERSION="4.0.2"
REVEAL_DIR="asciidocs-slides"
curl -L https://github.com/hakimel/reveal.js/archive/$REVEAL_VERSION.zip --output revealjs.zip
unzip revealjs.zip
mv reveal.js-$REVEAL_VERSION ./$REVEAL_DIR/revealjs
rm revealjs.zip