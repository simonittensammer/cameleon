./mvnw clean package

OPENCV_LIB_PATH="$(pwd)"/opencv/lib

java -jar -Djava.library.path=$OPENCV_LIB_PATH target/cameleon-backend-1.0.0-SNAPSHOT-runner.jar
