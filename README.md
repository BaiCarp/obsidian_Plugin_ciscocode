Obsidian Plugin
│
├── styles/
│   └── （这里可以放置插件相关的CSS样式文件）
│
├── manifest.json
│
├── main.ts
│   ├── CiscoCliPlugin (类定义)
│   │   ├── onload (异步加载方法)
│   │   │   └── 注册样式和Markdown代码块处理器
│   │   ├── registerMarkdownCodeBlockProcessor (Markdown 代码块处理器注册)
│   │   │   └── 调用 processLine 方法处理每一行
│   │   ├── processLine (行处理方法)
│   │   │   ├── 定义正则表达式匹配命令提示符、命令、接口、IP地址和普通数字
│   │   │   ├── 使用正则表达式对命令行进行格式化
│   │   │   └── 调用 createSpan 和 createDiv 辅助函数
│   │   └── 辅助函数
│   │       ├── createDiv ({ cls?: string } = {})
│   │       │   └── 创建并返回一个带有指定类的 div 元素
│   │       └── createSpan ({ cls?: string } = {})
│   │           └── 创建并返回一个带有指定类的 span 元素


该插件的效果是：输入Cisco的命令，将命令高亮显示


如果你想自定义一个名为abc的语言
第一步，复制manifest.json文件
第二步，修改styles.css文件，将里边的内容修改为自己喜欢的样式
第三步，修改main.ts文件


0.定义样式
const styles = `
.cisco-cli {
  font-family: monospace;
  white-space: pre-wrap;
}
.cisco-cli-line {
  display: block;
  margin: 2px 0;
}
.cisco-cli-commandPrompt{color: #008080;}
.cisco-cli-text {color: #000000; }
.cisco-cli-command {color: #ff8c00; }
`;

1.定义语言
修改 registerMarkdownCodeBlockProcessor函数，将 "cisco" 替换为你需要的语言类型

2.修改processLine函数    
2.1 定义命令
    const commands =['','','','',''];
2.2 转义特殊字符
    const escapedCommands = commands.map(cmd => cmd.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
2.3 构建正则表达式
    const commandRegex = new RegExp('^(' + escapedCommands.join('|') + ')\\b', 'i');
2.4 修改parts.forEach方法
    parts.forEach((part, index, arr) => {
      if (commandPromptRegex.test(part)) {
        currentCls = 'cisco-cli-commandPrompt';
      } else if (commandRegex.test(part)) {
        currentCls = 'cisco-cli-command';
      }
      else {
        currentCls = 'cisco-cli-text'; // 默认类名
      }



