1. "dev": "concurrently \"npm run server\" \"npm run client\""

2. add proxy:
    -   "proxy": "http://localhost:5000"

3. 没有 proxy 是不能部署成功的。

4. cd client
    - rm -rf .git

5. npm i axios react-router-dom uuid react-transition-group

6. font awsome
  <script src="https://kit.fontawesome.com/2876a5e4cd.js" crossorigin="anonymous"></script>

7. 常见错误： <ContactContext.Provider> 而不是 <ContactContext.provider>

8. form radio

9. useRef 跟普通 form 的处理区别。

10. 
```js
filtered: state.contacts.filter(contact => {
    const regex = new RegExp(`${action.payload}, 'gi'`);
    return contact.name.match(regex) || contact.email.match(regex);
})
```

11. 共用一个模版：
```js
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