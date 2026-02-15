// 使用微信注册https://www.pushplus.plus/ 并且完成实名  
// 在"我的"——"个人中心"——"开发设置"中获取token
// 替换为你的PushPlus Token
const PUSHPLUS_TOKEN = "替换你自己的token"

/**
 * PushPlus推送函数
 * @param {string} title - 推送标题
 * @param {string} content - 推送内容
 * @returns {boolean} - 推送是否成功
 */
function pushMessage(title, content) {
    if (!PUSHPLUS_TOKEN || PUSHPLUS_TOKEN === "替换你自己的token") {
        Chat.log("请填写PushPlus Token！")
        return false
    }
    
    if (!title || !content) {
        Chat.log("标题和内容不能为空！")
        return false
    }
    
    try {
        // 构建请求体和请求头
        const body = JSON.stringify({
            token: PUSHPLUS_TOKEN,
            title: title,
            content: content
        })
        const headers = { "Content-Type": "application/json" }
        
        // 发送请求
        const response = Request.post(
            "https://www.pushplus.plus/send/",
            body,
            headers
        )
        
        // 解析响应结果
        const result = JSON.parse(response.text())
        if (result.code === 200) {
            Chat.log("推送成功！请查收公众号消息")
            return true
        } else {
            Chat.log("推送失败：" + result.msg)
            return false
        }
    } catch (err) {
        Chat.log("推送错误：" + err.message)
        return false
    }
}

// 使用示例：
// pushMessage("测试标题", "这是测试内容")
// pushMessage("任务完成", "脚本执行完毕，共处理了100条数据")