const Koa = require('koa')
const router = require('koa-router')()
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const app = new Koa();
const jwt = require("jsonwebtoken");
const jwtAuth = require("koa-jwt");

const secret = "it's a secret";
app.use(bodyParser())
app.use(static(__dirname + '/'));

router.post("/login-token", async ctx => {
  const { body } = ctx.request;

  const { username, password } = body
  // password 应根据 username 从数据库中获取
  if (username === 'test' && password === 'test') {
    ctx.body = {
      message: "登录成功",
      user: username,
      // 使用 jsonwebtoken 依赖包 生成 token 返回给客户端
      token: jwt.sign(
        {
          data: username,
          // 设置 token 过期时间，一小时后，秒为单位
          exp: Math.floor(Date.now() / 1000) + 60 * 60
        },
        secret
      )
    };
  } else {
    ctx.status = 401;
    ctx.body = { code: 0, message: '用户名或密码错误' }
  }
  
});

router.get(
  "/getUser-token",
  jwtAuth({
    secret
  }),
  async ctx => {
    // 验证通过，state.user
    console.log(ctx.state.user);
    
    //获取session
    ctx.body = {
      message: "获取数据成功",
      userinfo: ctx.state.user.data 
    };
  }
)

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000)