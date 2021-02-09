# Requirements
- NodeJS  v15.6.0+
- Npm v6.14.11+
- Postgresql v13.1+

## Requirements installation
1. NodeJS
```
$ sudo apt update
$ sudo apt install nodejs
$ nodejs -v
```


2. npm
```
$ sudo apt update
$ sudo apt install npm
$ npm -version
```

3. Postgresql
```
$ sudo apt update
$ sudo apt install postgresql postgresql-contrib
$ sudo -u postgres psql -c "SELECT version();"
```
# Set Up

## Database
1. Create user

```
$ sudo su - postgres
postgres@$ psql
> CREATE USER user_name WITH SUPERUSER CREATEDB INHERIT LOGIN NOREPLICATION CONNECTION LIMIT -1 PASSWORD 'user_password';
```

2. Create Database

```
> CREATE DATABASE database_name;
> GRANT ALL PRIVILEGES ON DATABASE database_name TO user_name;
```

## API
1. Install the dependencies listed in the package.json file

```
$ npm install
```

2. Create a .env file in the root folder of the project similare to the following <a href="./.env.example" target=""><strong>example</strong></a> 

# Run
```
$ npm run start:dev
```

# Swagger
1. Open the browser
2. Copy the next URL and paste it inyo the broser 
```
> http://localhost:3000/api/v1/
```

# Developers

- Gustavo Sánchez [@gustavosr98](https://github.com/gustavosr98) 📖
- Javier Andrade [@JAA1998](https://github.com/JAA1998) 📖
- Yeisson Venencia [@yeisson-venencia](https://github.com/yeisson-venencia) 📖
