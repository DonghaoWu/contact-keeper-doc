# MERN tools demo (Part 1)

### `Key Words: form fadio, useEffect, 跨 context 调用 method, mount & render, <a> & <Link> & history.push, PrivateRoute.`

- #### Click here: [BACK TO NAVIGASTION]()

## `Section: MERN stack contact keeper.` (Basic)

### `Summary`: In this documentation, we learn to build a MERN stack application --- contact keeper.

### `Check Dependencies & Tools:`

- Frontend
    - react
    - axios
    - react-router-dom
    - uuid
    - fontawesome library

- Backend
    - express
    - bcyptjs
    - jsonwebtoken
    - express-validator
    - mongoose
    - nodemon
    - concurrently
------------------------------------------------------------

#### `本章背景：`
1. 

------------------------------------------------------------

### <span id="1.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION]()

- [1.1 Backend set up.](#1.1)
- [1.2 Frontend set up.](#1.2)
- [1.3 Notes on this application..](#1.3)
- [1.4 Firebase security.](#1.4)

------------------------------------------------------------


### <span id="1.1">`Step1: Backend set up.`</span>

- #### Click here: [BACK TO CONTENT](#1.0)

1. Initialization:

    ```bash
    $ npm init
    $ touch server.js
    $ npm i express bcryptjs jsonwebtoken express-validator mongoose dotenv
    $ npm i nodemon concurrently --save-d
    ```

2. MongoDB set up.

    1. Create a new project.

    <p align="center">
    <img src="../assets/m-p1-01.png" width=80%>
    </p>

    <p align="center">
    <img src="../assets/m-p1-02.png" width=80%>
    </p>

    <p align="center">
    <img src="../assets/m-p1-03.png" width=80%>
    </p>

    -----------------------------------------------------------------

    2. Build a cluster.

    <p align="center">
    <img src="../assets/m-p1-04.png" width=80%>
    </p>

    <p align="center">
    <img src="../assets/m-p1-05.png" width=80%>
    </p>

    <p align="center">
    <img src="../assets/m-p1-06.png" width=80%>
    </p>

    <p align="center">
    <img src="../assets/m-p1-07.png" width=80%>
    </p>

    -----------------------------------------------------------------

    3. Create a user.

    <p align="center">
    <img src="../assets/m-p1-08.png" width=80%>
    </p>

    <p align="center">
    <img src="../assets/m-p1-09.png" width=80%>
    </p>

    -----------------------------------------------------------------

    4. Set up white list ip address.

    <p align="center">
    <img src="../assets/m-p1-10.png" width=80%>
    </p>

    <p align="center">
    <img src="../assets/m-p1-11.png" width=80%>
    </p>

    -----------------------------------------------------------------

    5. Connetct option.

    <p align="center">
    <img src="../assets/m-p1-12.png" width=80%>
    </p>

    <p align="center">
    <img src="../assets/m-p1-13.png" width=80%>
    </p>

    -----------------------------------------------------------------

    6. Get connect string.

    <p align="center">
    <img src="../assets/m-p1-14.png" width=80%>
    </p>

    -----------------------------------------------------------------

3. .env file

    ```js
    JWT_SECRET=aaa

    MONGO_URI=mongodb+srv://user_example:<password>@cluster0.fowtd.mongodb.net/<dbname>?retryWrites=true&w=majority
    ```

4. db.js file

    ```js
    const mongoose = require('mongoose');
    const db = process.env.MONGO_URI;

    const connectDB = async () => {
        try {
            mongoose.connect(db, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            })

            console.log('MongoDB connected...')
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    }

    module.exports = connectDB;
    ```

4. server.js

    ```js
    const express = require('express');
    require('dotenv').config()
    const path = require('path');
    const connectDB = require('./db');
    const PORT = process.env.PORT || 8000;

    const app = express();
    connectDB();

    app.use(express.json({ extended: true }));

    app.use(`/api/users`, require('./routes/users'));
    app.use(`/api/auth`, require('./routes/auth'));
    app.use(`/api/contacts`, require('./routes/contacts'));

    // Server static assets in production.

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('client/build'));
        app.get('*', (req, res) =>
            res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
        )
    }

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    ```

#### `Comment:`
1. 其他可以学习的包括：routes, middleware, models 的设立。

------------------------------------------------------------

### <span id="1.2">`Step2: Frontend set up.`</span>

- #### Click here: [BACK TO CONTENT](#1.0)

1. Install front end dependencies:

    ```bash
    $ npx create-react-app client
    $ cd client
    $ npm i axios react-router-dom
    ```

2. Add fontawesome library in index.html.

    ```html
    <script src="https://kit.fontawesome.com/2876a5e4cd.js" crossorigin="anonymous"></script>
    ```

3. Tricky error in context api:

    ```diff
    - <ContactContext.provider>
    + <ContactContext.Provider>
    ```

4. 关于 form radio 的使用。

    ```jsx
    <input
        type='radio'
        name='type'
        value='personal'
        checked={type === 'personal'}
        onChange={handleChange}
    />
    Personal{' '}
    ```

5.  不同数据共用一个 component：

    ```jsx
    <Fragment>
        {
            (filtered !== null) ?
                filtered.map(contact => {
                    return <ContactItem key={contact.id} contact={contact} />
                })
                :
                contacts.map(contact => {
                    return <ContactItem key={contact.id} contact={contact} />
                })
        }
    </Fragment>
    ```

#### `Comment:`
1. 


### <span id="1.3">`Step3: Notes on this application.`</span>

- #### Click here: [BACK TO CONTENT](#1.0)

1. 目前来看 contextAPI 的缺点是无法跨 context 调动 method，所有的 context method 都是只能垂直传递，而不能横向跨越调动。比如说不能在 auth context 的 method 中调动 alert context 里面的 method，具体例子是：想实现注册错误时由 Alert 组件显示错误提示信息，可以通过两个办法实现：

    - 在 Auth context 里面增加一个新的 reducer 和 dispatch，此办法可以实现但不提倡，因为两个 reducer 违反了 `single of true` 原则。

    - 第二种方法是借助 auth context 传递到 component 的 state 配合 `useEffect`，在 `useEffect` 中掉=调用对应的 alert context 中的 method，代码如下：

    1. Register.js
    ```js
        const { setAlert } = useContext(AlertsContext);
        const { register, error, clearErrors } = useContext(AuthContext);

        useEffect(() => {
            if (error) {
                setAlert(error, 'danger');
                clearErrors();
            }
        }, [error])
    ```

    2. AuthState.js

    ```js
    // Clear Error

    const clearErrors = () => {
        dispatch({ type: CLEAR_ERRORS });
    }

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                error: state.error,
                user: state.user,
                register,
                clearErrors
            }}>
            {props.children}
        </AuthContext.Provider>
    )
    ```

    3. AuthReducer.js
    ```js
    const AuthReducer = (state, action) => {
        switch (action.type) {
            case REGISTER_SUCCESS:
                localStorage.setItem('token', action.payload.token);
                return {
                    ...state,
                    token: action.payload.token,
                    isAuthenticated: true,
                    loading: false,
                }
            case REGISTER_FAIL:
                localStorage.removeItem('token');
                return {
                    ...state,
                    token: null,
                    isAuthenticated: false,
                    loading: false,
                    user: null,
                    error: action.payload
                }
            case CLEAR_ERRORS:
                return {
                    ...state,
                    error: null
                }
            default:
                return state;
        }
    }
    ```



#### `Comment:`
1. 要注意的是，clearErrors()执行以后，会改变 error 为 null， 从而激发一个新的 useEffect，然后由于 if 的条件限制，不会再调用 setAlert。所以流程如下：

    1. 产生 error
    2. useEffect 接受到的 error 由 null 变成 string, 运行对应函数
    3. 对应函数运行到 if 条件，符合，调用 setAlert，显示错误提示信息。
    4. 调用 clearErrors()
    5. useEffect 接受到的 error 由 string 变成 null, 运行对应函数
    6. 对应函数运行到 if 条件，不符合，`结束。`

2. 对 mount 和 render 的区别认识，先 mount 后 render， mount 比 render 重要。mount 可以改变 state 然后触发 render，但 render 只需要 state 改变了就会重新运行。

### <span id="1.4">`Step4: Developer opinion.`</span>

- #### Click here: [BACK TO CONTENT](#1.0)

1. 源代码的错误地方： loadUser 不应该在 Home 中的 useEffect 执行，这样做会在一个行为中产生非预期反应：

    - 如果一个用户刚注册，系统跳转到 home，这是没问题的。
    - 如果用户关闭应用，这时 token 还在，如果用户直接打开 主页 `/`,也还是能够直达主页，这也是没问题
    - 如果用户关闭应用，然后直接打开 `register`， 这时还是可以连接 regester 页面，而不会跳转到 `/`, 这是我们预期的行为吗

    - `所以我认为目前最好的方案是，当一个用户注册/登陆厚，即有 token 保存在 localStorage 之后，必须实现`
        - navbar 中没有 register 按钮
        - 在url 中输入 `/register` 后，自动跳转回 `/`
        - 退出应用后在url 中输入 `/register` 后，自动跳转回 `/`

    - 为了实现上述行为，对源代码进行了修改，不在 Home 中的 useEffect 调用 loadUser，改在 APP 中调用，由于需要在 App 中引用 useContext，所以干脆把 3 个 context api 转上一级到 index.js：

        ```js
        import React from 'react';
        import ReactDOM from 'react-dom';
        import App from './App';

        import ContactState from './context/contact/ContactState';
        import AuthState from './context/auth/AuthState';
        import AlertsState from './context/alert/AlertsState';

        ReactDOM.render(
            <React.StrictMode>
                <AuthState>
                <ContactState>
                    <AlertsState>
                    <App />
                    </AlertsState>
                </ContactState>
                </AuthState>
            </React.StrictMode>,
            document.getElementById('root')
        );
        ```

2. Private Route.

    ```jsx
    import React, { useContext } from 'react';
    import { Route, Redirect } from 'react-router-dom';
    import AuthContext from '../../context/auth/AuthContext';

    const PrivateRoute = ({ component: Component, ...rest }) => {
        const { loading, isAuthenticated } = useContext(AuthContext);
        return (
            <Route {...rest} render={props => (!isAuthenticated && !loading)
                ?
                <Redirect to='login' />
                :
                <Component {...props} />
            } />
        )
    }

    export default PrivateRoute
    ```

3. 一个微小的调试错误：

    - 当用户登录/注册后，系统转到 `/`,然后调用 `getContacts`，这时是成功的，但保持这个页面，进行一次刷新动作，系统重新调用 `getContacts` 和 `loadUser`, 其从控制台看出，`getContacts` 比 `loadUser` 早运行，这个时候的结果是`getContacts` 无法读取数据。`造成的结果是已经登陆的 user 只能在登陆跳转时才能看到自己的数据，而在刷新之后就会显示错误。`

    - 解析原因，因为刷新的时候，`localStorage.token`依然会在，但 axios 的 header 会被清空，这个时候出现`getContacts` 比 `loadUser` 早运行，因为只有 `loadUser` 有设置 axios header 的function，所以 `getContacts` 是没有 axios header 的请求，所以不成功。

    - :gem::gem::gem: 解决方案，就是在 App 中加入：
    ```js
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    ```

    - 这就是加入这段代码的原因，在打开/刷新 app 的情况下，首先设置好 axios header，这样就不怕一旦子 component 的 request 比 App 中的 loadUser 早的时候没有 header 的情况。

    - :gem::gem::gem: 所以总结是：
        -  刷新动作会清除所有 state，同时包括已经设定的 axios header。
        - `在刷新情况下，就算 token 还在，但是 axio header 已经为 null，需要重新设置。`
        - `子 compoennt 的 request 是有可能比在 App 中的包含 set axios header 功能的 loadUser method 早执行。`


#### `Comment:`
1. 对于第三点，主要是针对每个页面都有可能使用带 axios header 请求的情况，比如像本 application 里面，每个单独页面都有可能加入 useEffect， useEffect 里面带有一些需要 header token 的请求时，由于请求比 APP 中的加载 header 的 loadUser 快，所以导致了没有 header 的失败请求发生。

2. 解决这个情况还有一个方案，就是只在 APP 中使用 loadUser，在 loadUser 中加载好所有的数据，从而不需要在其他页面发出数据请求，这个方案的缺点是请求太多，负载可能会很重。

3. :gem::gem::gem: 相比之下在 APP 中加入以上代码，可以更加轻量化，并且不需要一次过加载所有数据，这个做法可以对之前的一些 application 进行优化（stock app）。

__`本章用到的全部资料：`__

- null

- #### Click here: [BACK TO CONTENT](#1.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)