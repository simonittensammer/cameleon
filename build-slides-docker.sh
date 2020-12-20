set -e
BUILD_DIR="slides"
REVEAL_DIR="asciidocs-slides"
[ ! -d "./asciidocs-slides/revealjs" ] && source ./download-reveal.sh
rm -rf -v $BUILD_DIR # else plantuml diagrams won't be rebuilt
cp -r -p -v $REVEAL_DIR $BUILD_DIR
[ -d "./src" ] && cp -r -p -v src $BUILD_DIR

echo "Rendering slides"
docker run --rm \
           -v ${PWD}/$BUILD_DIR:/documents \
           asciidoctor/docker-asciidoctor:1.2.0 asciidoctor-revealjs \
           -r asciidoctor-diagram \
           -a icons=font \
           -a revealjs_theme=white \
           -a source-highlighter=rouge \
           -a imagesdir=images \
           -a revealjsdir=revealjs \
           -a revealjs_slideNumber=c/t \
           -a revealjs_transition=slide \
           -a revealjs_hash=true \
           -a sourcedir=src/main/java \
           -b revealjs \
           '*.adoc'
echo "build completed ..."


# Source: https://github.com/bentolor/java9to13/blob/master/docs/render

### Hier könnte man einen lokalen Python-Server starten, um sich die Präsentation lokal anzusehen
# echo http://localhost:8000/demo-slides.html
# echo "Starting Webserver on :8000"
# python3 -m http.server --directory $BUILD_DIR >/dev/null 2>&1 &
# ps aux | grep http.server
# echo "kill -9 <pid>" to shut down the webserver

### for macOS
#open -a Google\ Chrome http://localhost:8000/demo-slides.html > /dev/null &



#open http://localhost:8000/demo-slides.html > /dev/null &

# ps
# kill -9 <process number>

# Tolles Beispiel
# https://bentolor.github.io/java9to13
# https://github.com/bentolor/java9to13/blob/master/docs/render

# https://asciidoctor.org/docs/asciidoctor-revealjs/

# revealjs_theme=[beige, black, league, night, serif, simple, sky, solarized, white]
# revealjs_transition [none, fade, slide, convex, concave, zoom]
# source-highlighter [highlightjs,rouge,coderay,prettify]

# https://asciidoctor.org/docs/user-manual/#highlight-js
#           -a highlightjs-theme=github \
#           -a highlightjsdir=highlight \
#           -a highlightjs-languages=java,yaml,json,asciidoc \
#           -a highlightjsdir=https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build \

# Cheat Sheet
# https://powerman.name/doc/asciidoc