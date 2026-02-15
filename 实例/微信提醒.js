//使用微信注册https://www.pushplus.plus/  并且完成实名  
//在"我的"——"个人中心"——"开发设置"中获取token
// 替换为你的PushPlus Token
const PUSHPLUS_TOKEN = "替换你自己的token"
const testContent = "这是一条测试消息"

function testPush() {
    if (!PUSHPLUS_TOKEN) {
        Chat.log("请填写PushPlus Token！")
        return
    }

    try {
        // 构建请求体和请求头
        const body = JSON.stringify({
            token: PUSHPLUS_TOKEN,
            title: "测试推送",
            content: testContent
        })
        const headers = { "Content-Type": "application/json" }

        // 旧版本使用同步请求（无then()，直接获取响应）
        const response = Request.post(
            "https://www.pushplus.plus/send/",
            body,
            headers
        )

        // 解析响应结果
        const result = JSON.parse(response.text())
        if (result.code === 200) {
            Chat.log("推送成功！请查收公众号消息")
        } else {
            Chat.log("推送失败：" + result.msg)
        }

    } catch (err) {
        Chat.log("错误：" + err.message)
    }
}

// 执行测试
testPush()
Chat.log("正在发送测试消息...")