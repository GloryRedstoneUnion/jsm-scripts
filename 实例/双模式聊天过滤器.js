var scriptname = "MessageBlocker"
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)

// 自定义过滤配置
const FILTER_CONFIG = {
   // 关键词过滤 - 包含这些词就拦截
   keywords: ["公告", "恭喜", "获得"],
   // 精准匹配过滤 - 必须完全匹配才拦截
   exactMatch: ["1", "命令输入错误"]
}

function main() {
   if (!GlobalVars.getBoolean(scriptname)) return
   Chat.actionbar(`§7[§5${scriptname}§7] §aenabled`)
  
   function blacklist(event) {
       let text = event.text
       let string = text.getString()
       let json = text.getJson()
       
       // 提取消息内容
       let messageContent = ""
       
       // 优先从string中提取
       if (string) {
           messageContent = string
       }
       
       // 如果需要从JSON中提取实际聊天内容
       if (json && typeof json === 'string') {
           try {
               let jsonObj = JSON.parse(json)
               if (jsonObj.extra && Array.isArray(jsonObj.extra)) {
                   // 获取最后一个extra元素（通常是实际消息内容）
                   let lastExtra = jsonObj.extra[jsonObj.extra.length - 1]
                   if (typeof lastExtra === 'string') {
                       messageContent = lastExtra
                   }
               }
           } catch (e) {
               // JSON解析失败，使用原始string
           }
       }
       
       // 清理消息内容，移除玩家名称和前缀
       // 提取 ">" 后面的内容
       let match = messageContent.match(/>\s*(.+)$/)
       if (match) {
           messageContent = match[1].trim()
       }
       
       // 检查是否需要拦截
       let shouldBlock = false
       
       // 检查关键词过滤
       for (let keyword of FILTER_CONFIG.keywords) {
           if (messageContent.includes(keyword)) {
               shouldBlock = true
               break
           }
       }
       
       // 检查精准匹配过滤
       if (!shouldBlock) {
           for (let exactWord of FILTER_CONFIG.exactMatch) {
               if (messageContent.trim() === exactWord) {
                   shouldBlock = true
                   break
               }
           }
       }
       
       return shouldBlock
   }
   
   // 主事件监听器
   const MessageListener = JsMacros.on("RecvMessage", true, JavaWrapper.methodToJava(event => {
       if (blacklist(event)) {
           event.cancel()
       }
   }))
   
   const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
       if (!GlobalVars.getBoolean(scriptname)) {
           Chat.actionbar(`§7[§5${scriptname}§7] §cdisabled`)
           MessageListener.off()
           Close.off()
       }
   }))
}

main()