**How to run && install && use**

1) Docker image: ```docker pull dudle/test_api:v1-release```
2) Run api: ```docker run -p 3000:3000 -e API_PORT=3000 -it -d dudle/test_api:v1-release```
3) Use postman to review endpoints
4) Or also you can clone https://github.com/Sasha-creator-tech/test-web and run with the ```npm run serve``` simple web-app that helps you to signin/login and upload .txt files with movies

**Desc**
created api using Express.js, Sequelize and SQLite for database.

- In order to implement main logic i decided to use many-to-many relationships between two tables (Movie and Actor).
- For Authorisations and Authentication used JWT tokens

- You can import ```https://github.com/Sasha-creator-tech/test-api/blob/main/sample_movies%20(1).txt``` file to fill in the database 
