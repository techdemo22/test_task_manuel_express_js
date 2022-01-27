# Crud Operations

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|MONGO_DB_STRING           | Mongo db string             | ""      |
|MONGO_DB_USERNAME           | database username            | ""      |
|MONGO_DB_PASSWORD           | database password            | ""      |
|JWT_SECRET           | you can create any custom long secret key to get the information from encoded token            | ""      |
|FRONT_DOMAIN           | frontend website domain           | ""      |
|SERVER_DOMAIN           | server endpoint url            | ""      |
|SENDGRID_API_KEY           | we used the sendGrid api to send the mail            | ""      |
|SENDER_EMAIL           | verified sender email of sendGrid account            | ""      |
|ADMIN_EMAIL           | admin email (any)            | ""      |

# Pre-requisites
- Application requires [Node.js](https://nodejs.org/) v12.18.3+ to run.


# Getting started
- Clone the repository
```
git clone  <repository url> <project_name>
```
- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:8001`


