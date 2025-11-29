FROM mysql:latest
WORKDIR /
ENV MYSQL_ROOT_PASSWORD=sptech
COPY ./Script-autobotics.sql /docker-entrypoint-initdb.d/
EXPOSE 3306