1. 目前来看 contextAPI 的缺点是无法跨 context 调动 method，所有的 context method 都是只能垂直传递，而不能横向跨越调动。比如说不能在 auth context 的 method 中调动 alert context 里面的 method，具体例子是：想实现注册错误时由 Alert 组件显示错误提示信息，可以通过两个办法实现：
    - 在 auth context 中引入新 state，对接 AlertReducer，同时引入新的 dispatch，最后把新的 state 传递下去，到达 Alert 组件， 如：

```js
import AlertsReducer from '../alert/AlertsReducer';

import {
    SET_ALERT,
    REMOVE_ALERT
} from '../types';
    //...
    const initialAlertState = [];

    const [alertState, alertDispatch] = useReducer(AlertsReducer, initialAlertState)

    // Register user
    const register = async (formData) => {
        const config = {
            headers: {
                'content-Type': 'application/json'
            }
        }
        try {
            const res = await axios.post('/api/users', formData, config);
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,
                payload: err.response.data.msg
            })
            const id = uuid();
            alertDispatch({
                type: SET_ALERT,
                payload: {
                    msg: err.response.data.msg,
                    type: 'danger',
                    id: id
                }
            })
            setTimeout(() => {
                alertDispatch(
                    {
                        type: REMOVE_ALERT,
                        payload: id
                    }
                )
            }, 3000)
        }
    }
    //...
    return (
        <AuthContext.Provider
            value={{
                alertsFromAuth: alertState
            }}>
            {props.children}
        </AuthContext.Provider>
    )
```
- Alert.js 组件中同时消化连个 state。
```js
import React, { useContext } from 'react';
import AlertsContext from '../../context/alert/AlertsContext';
import AuthContext from '../../context/auth/AuthContext';

const Alerts = props => {
    const { alerts } = useContext(AlertsContext);
    const { alertsFromAuth } = useContext(AuthContext);


    const allAlerts = [...alerts, ...alertsFromAuth];

    return (
        allAlerts.length > 0
        &&
        allAlerts.map(alert => {
            return (
                <div key={alert.id} className={`alert alert-${alert.type}`}>
                    <i className='fas fa-info-circle'></i>{alert.msg}
                </div>)
        })
    )
}


export default Alerts;
```

- 另外一个方法是在 auth state 中生成 err 信息后传递到 Register 组件， 然后调用 Alert 中 的 setAlert 处理信息。 

```js
    useEffect(() => {
        console.log(error, '=========<<<<<<<')
        if (error) setAlert(error, 'danger')
    }, [error])
```

- 上面这个方法的不好地方是只会出现一次的错误信息，如果有重复错误，是不会重复提示。

- 好一点的方法，每生成一个错误生成一个 id，加入 id 和 msg 打包成为一个 object，然后根据 id 判断是否要更新。

```js
    // Register user
    const register = async (formData) => {
        const config = {
            headers: {
                'content-Type': 'application/json'
            }
        }
        try {
            const res = await axios.post('/api/users', formData, config);
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,
                payload: {
                    msg: err.response.data.msg,
                    id: uuid()
                }
            })
        }
    }
```

```js
    useEffect(() => {
        if (error.msg) setAlert(error.msg, 'danger')
    }, [error.id])
```

- 但这个方法的缺点是 error 一直都在，每当 unMount 到另外一个 component 再返回 mount 时，由于 error 还在，所以会再无动作情况下弹出 `提示信息。`

- 所以目前最好的方案是加入清除错误信息动作。

- AuthReducer.js
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

- AuthState.js

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


- Register.js
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

- 要注意的是，clearErrors()执行以后，会改变 error 为 null， 从而激发一个新的 useEffect，然后由于 if 的条件限制，不会再调用 setAlert。所以流程如下：

1. 产生 error
2. useEffect 接受到的 error 由 null 变成 string, 运行对应函数
3. 对应函数运行到 if 条件，符合，调用 setAlert，显示错误提示信息。
4. 调用 clearErrors()
5. useEffect 接受到的 error 由 string 变成 null, 运行对应函数
6. 对应函数运行到 if 条件，不符合，`结束。`

- 其实最后的答案就是视频的答案，只不过只看一半漏了后一半，引发了 多个讨论。
- :gem::gem:不过这也是对于 contextAPI 对于跨 context 使用 method 的良好思考。关键地方在 :gem::gem: `useEffect`.

- 对 mount 和 render 的区别认识，先 mount 后 render， mount 比 render 重要。mount 可以改变 state 然后触发 render，但 render 只需要 state 改变了就会重新运行。

4. 不明白为什么在 App.js 中使用了

```js
if (localStorage.token) {
  setAuthToken(localStorage.token);
}
```

- 然后又在 Home 中调用含有上面代码的 loadUser。

- 自己观点，第一段代码不需要执行，而 loadUser 需要在 App.js 中执行，而不是在 HOME

- 源代码的错误地方： loadUser 不应该在 Home 中的 useEffect 执行，这样做会在一个行为中产生非预期反应：
    - 如果一个用户刚注册，系统跳转到 home，这是没问题的。
    - 如果用户关闭应用，这时 token 还在，如果用户直接打开 主页 `/`,也还是能够直达主页，这也是没问题
    - 如果用户关闭应用，然后直接打开 `register`， 这时还是可以连接 regester 页面，而不会跳转到 `/`, 这是我们预期的行为吗

    - 可以这样分析，如果我们想要用户在注册 =》 登陆后，还可以接触 register 界面，我们就不用在 register 中设置跳转，更不需要隐藏 navbar 中的 register。

    - `所以我认为目前最好的方案是，当一个用户注册/登陆厚，即有 token 保存在 localStorage 之后，必须实现`
        - navbar 中没有 register 按钮
        - 在url 中输入 `/register` 后，自动跳转回 `/`
        - 退出应用后在url 中输入 `/register` 后，自动跳转回 `/`

    - 为了实现上述行为，对源代码进行了修改：

        - 不在 Home 中的 useEffect 调用 loadUser，改在 APP 中调用。
        - App.js不需要执行以下代码：

            ```js
            if (localStorage.token) {
                setAuthToken(localStorage.token);
            }
            ```

        - 由于需要在 App 中引用 useContext，所以干脆把 3 个 context api 转上一级到 index.js

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

- 同理， login 的逻辑也是一样的设计。

- 再次遇到了 a tag 跟 link 跟 button 的区别。

- Private Route 的设置。

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

- 一个微小的调试错误：当用户登录/注册后，系统转到 `/`,然后调用 `getContacts`，这时是成功的，但保持这个页面，进行一次刷新动作，系统重新调用 `getContacts` 和 `loadUser`, 其从控制台看出，`getContacts` 比`loadUser` 早运行，这个时候的结果是`getContacts` 无法读取数据。

- 解析原因，因为刷新的时候，`localStorage.token`依然会在，但axios 的 header 会被清空，这个时候出现`getContacts` 比`loadUser` 早运行，因为只有 `loadUser` 有设置 axios header 的function，所以 `getContacts` 是没有 axios header 的请求，所以不成功。

- 解决这个问题的方法，就是在 App 中加入：
```js
if (localStorage.token) {
  setAuthToken(localStorage.token);
}
```

- :gem::gem::gem:这就是加入这段代码的原因，在打开/刷新 app 的情况下，首先设置好 axios header，这样就不怕一旦 子 component 的 request 比 App 中的 loadUser 早的时候没有 header 的情况。

- 所以总结是：
    - `在刷新情况下，就算 token 还在，但是 axio header 已经为 null，需要重新设置。`
    - `子 compoennt 的 request 是有可能比在 App 中的包含 set axios header 功能的 loadUser request 早执行。`

- :gem::gem::gem: 另外今天也处理了一个怪问题，至今还不知道发生原理，就是添加了一个新文件（或者改名字），创造一个新文件，server1.js 代替 server.js，`就可以消除端口正在使用中的错误提示`.

- mongoDB 中的 `_id`可以是一个坑。

- `纯前端或者全栈应用部署在 heroku 上面的时候都需要有一个 server.js 文件配置 static 路径和文件。`

- 取消 config ， 使用 dotenv。

```js
const path = require('path');
// Server static assets in production.
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    )
}

```

- ./config/production.json

- ./package.json

```json
"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
```


