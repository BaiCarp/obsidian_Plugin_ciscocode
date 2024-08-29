"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
const styles = `
.cisco-cli {
  font-family: monospace;
  white-space: pre-wrap;
}
.cisco-cli-line {
  display: block;
  margin: 2px 0;
}
.cicso-cli-file { color: pink ;}
.cisco-cli-commandPrompt{color: #008080;}
.cisco-cli-text {color: #000000; }
.cisco-cli-command {color: #ff8c00; }
.cisco-cli-number {color: #aa78aa;}
.cisco-cli-interface{color:#003153 ;}
.cisco-cli-ip-address{color:#656598 ;}
`;
class CiscoCliPlugin extends obsidian_1.Plugin {
    // 异步加载插件
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            const styleEl = document.createElement('style');
            styleEl.id = 'cisco-cli-plugin-styles';
            styleEl.appendChild(document.createTextNode(styles));
            document.head.appendChild(styleEl);
            this.registerMarkdownCodeBlockProcessor("cisco", (source, el, ctx) => {
                const lines = source.split("\n");
                lines.forEach(line => {
                    const lineDiv = createDiv();
                    this.processLine(line, lineDiv);
                    el.appendChild(lineDiv);
                });
            });
        });
    }
    // 正则表达式匹配命令提示符、命令、接口、IP地址和普通数字
    processLine(line, lineDiv) {
        // 匹配命令提示符
        const commandPromptRegex = /^(switch(?:\(config(?:-(?:if|vlan|line|route))?\))?[>#])/;
        // cisco命令
        const commands = [
            'access', 'access-class', 'access-list', 'access-lists', 'active', 'add', 'address', 'address-table', 'all', 'allowed', 'allow-untrusted', 'arp', 'arp-cache', 'any', 'ascii', 'authentication-retries', 'auto',
            'binding', 'boot', 'brief', 'broadcast', 'banner', 'both', 'bpduguard', 'buffered',
            'cdp', 'clear', 'client', 'clock', 'configure', 'configured', 'conflict', 'connect', 'copy', 'counters', 'crypto', 'channel-group', 'channel-protocol', 'cisco-phone', 'client-id', 'community', 'console', 'cos',
            'database', 'debug', 'delete', 'detail', 'dhcp', 'dir', 'disable', 'disconnect', 'domain', 'dtp', 'dynamic', 'databits', 'datetime', 'debugging', 'default', 'default-gateway', 'default-router', 'deny', 'description', 'desirable', 'destination', 'device', 'dns-server', 'do', 'domain-lookup', 'domain-name', 'dscp', 'dst-ip', 'dst-mac', 'duplex',
            'enable', 'entry', 'erase', 'etherchannel', 'event', 'events', 'end', 'exit', 'even', 'except', 'excluded-address', 'exec', 'exec-timeout', 'extend', 'extended',
            'flowcontrol', 'ftp', 'full',
            'generate', 'guard',
            'history', 'hosts', 'half', 'hardware', 'hardware-address', 'host', 'hostname',
            'icmp', 'id', 'inconsistentports', 'information', 'interface', 'ip', 'in',
            'key',
            'lease', 'lldp', 'load-balance', 'local', 'logging', 'logout', 'lacp', 'level', 'limit', 'line', 'link-type', 'load-balance', 'log', 'login', 'lookup',
            'mac', 'mac-address-table', 'memory', 'mls', 'mode', 'monitor', 'more', 'mypubkey', 'mac-address', 'mark', 'maximum', 'mdix', 'motd', 'motd-banner', 'msec',
            'name', 'neighbors', 'no', 'name-server', 'native', 'network', 'none', 'nonegotiate',
            'odd', 'on', 'option', 'out', 'output',
            'packet', 'packets', 'password', 'ping', 'pool', 'port-channel', 'port-security', 'portfast', 'privilege', 'processes', 'protocol', 'pagp', 'parity', 'passive', 'password-encryption', 'permit', 'point-to-point', 'portfast', 'port-priority', 'prefer', 'primary', 'priority', 'protect', 'pvst',
            'qos',
            'range', 'reload', 'remote', 'resume', 'rsa', 'rapid-pvst', 'rate', 'receive', 'relay', 'remark', 'remove', 'reset', 'restrict', 'ro', 'root', 'router', 'run', 'rw', 'rx',
            'sdm', 'server', 'session', 'sessions', 'set', 'setup', 'show', 'size', 'snmp', 'snooping', 'spanning-tree', 'ssh', 'static', 'status', 'sticky', 'storm-control', 'summary', 'sw-vlan', 'secondary', 'secret', 'service', 'shutdown', 'snmp-server', 'software', 'source', 'space', 'speed', 'src-dst-ip', 'src-dst-mac', 'src-ip', 'src-mac', 'standard', 'stopbits', 'subscriber-id', 'switchport', 'synchronous', 'system',
            'table', 'tcp', 'tech-support', 'telnet', 'terminal', 'totals', 'traceroute', 'transparent', 'trusted-sources', 'time-out', 'timestamps', 'timezone', 'transmit', 'transport', 'trap', 'trunk', 'trust', 'trust-all', 'tx', 'tx-ring-limit',
            'use', 'users', 'username',
            'v2-mode', 'verify ', 'version', 'vlan', 'vtp', 'violation', 'voice',
            'write', 'write-delay',
            'zeroize',
            '?'
        ];
        // 转义数组中的正则表达式特殊字符
        const escapedCommands = commands.map(cmd => cmd.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        // 构建正则表达式
        const commandRegex = new RegExp('^(' + escapedCommands.join('|') + ')\\b', 'i');
        // 文件名
        const filename = ['ftp\\:', 'flash\\:', 'running-config', 'startup-config', 'tftp\\:', 'nvram\\:'];
        // 转义冒号
        const escapedFile = filename.map(cmd => cmd.replace(/:/g, '\\:'));
        // 文件
        const fileRegex = new RegExp('^(' + escapedFile.join('|') + ')\\b', 'i');
        // 接口
        const interfaceRegex = /(fastethernet|serial|ethernet|gigabitethernet)/i;
        // 点分十进制数字
        const ipAddressRegex = /\b(\d{1,3}\.){3}\d{1,3}\b/;
        // 普通数字
        const numberRegex = /\b\d+\b/;
        let currentSpan = createSpan(); // 初始化当前span
        let currentCls = null; // 跟踪当前span的类名
        // 按空格分割行，创建一个数组，其中包含命令行的各个部分
        const parts = line.split(/\s+/);
        parts.forEach((part, index, arr) => {
            if (commandPromptRegex.test(part)) {
                // 如果是命令提示符，应用相应的类名
                currentCls = 'cisco-cli-commandPrompt';
            }
            else if (commandRegex.test(part)) {
                currentCls = 'cisco-cli-command';
            }
            else if (interfaceRegex.test(part)) {
                currentCls = 'cisco-cli-interface';
            }
            else if (ipAddressRegex.test(part)) {
                currentCls = 'cisco-cli-ip-address';
            }
            else if (numberRegex.test(part)) {
                currentCls = 'cisco-cli-number';
            }
            else if (fileRegex.test(part)) {
                currentCls = 'cicso-cli-file';
            }
            else {
                currentCls = 'cisco-cli-text'; // 默认类名
            }
            // 创建一个新的span，如果需要的话
            if (currentSpan.className !== currentCls) {
                currentSpan = createSpan({ cls: currentCls });
                lineDiv.appendChild(currentSpan);
            }
            // 添加文本内容
            currentSpan.textContent += part;
            // 如果不是最后一个部分，则添加空格
            if (index < arr.length - 1) {
                currentSpan.textContent += ' ';
            }
        });
    }
}
exports.default = CiscoCliPlugin;
function createDiv({ cls } = {}) {
    const div = document.createElement('div');
    div.className = cls || 'cisco-cli-line';
    return div;
}
function createSpan({ cls } = {}) {
    const span = document.createElement('span');
    span.className = cls || '';
    return span;
}
