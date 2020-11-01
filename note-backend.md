1. create a new project
2. create a new user
3. white list ip address
4. connect option
5. get connect string
6. MongoDB Atlas


----------------
1. postman test API
2. npm init
3. add scripts in package.json
4. npm i express bcryptjs jsonwebtoken config express-validator mongoose

5. npm i nodemon concurrently --save-d

6. set routes, connect to MongoDB

7. config => config folder => default.json 位置设定。

8. models, middleware, express=validator

9. content-type: applcation/json

10. jwtToken

11. const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    之后已经自动生成 newUser.id

12.  auth middleware, send a get request with a token, get a user back.

13. header: x-auth-token, paste token. 自定义 header

14. 关于 jwt 加密跟解密的数据流图。

15. 