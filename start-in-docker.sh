# package quarkus
mvn package -f ./cameleon-backend

# build angular image
docker build -t cameleon-frontend-image ./cameleon-frontend

# run in docker
docker-compose up -d