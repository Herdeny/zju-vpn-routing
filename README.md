# 浙大网站 VPN 分流排障

一个仅用于浙江大学 `zju.edu.cn` 及全部子域名的 Clash Verge Rev / mihomo 排障 skill，附中文复刻教程和全域名分流脚本。来源于开启 VPN 后浙大网站连接失败的实际排查。

它先对照直连和代理，再按证据配置整个浙大域名的出口；处理全局脚本与订阅扩展的优先级，并在有证据时识别缓存真实 IP 连接中的域名。它不适用于其他学校，不替代浙大官方 VPN，也不绕过浙大身份认证。

## 内容

- [Skill 指令](campus-vpn-routing/SKILL.md)：供 Codex 执行的排查流程和完成标准。
- [中文复刻教程](campus-vpn-routing/references/replication-guide.md)：案例记录、界面步骤、诊断命令、验证方法与回退。
- [浙大脚本模板](campus-vpn-routing/assets/global-domain-routing.js)：固定 `zju.edu.cn`，可配置出口、订阅到代理组的映射和缓存 IP 兼容开关。

## 使用

将仓库中的 `campus-vpn-routing` 文件夹放入个人 Codex skills 目录，然后在可发现该 skill 的会话中输入：

> 请使用 $campus-vpn-routing 排查开启 VPN 后浙大网站无法访问的问题，覆盖 zju.edu.cn 全部子域名并验证浏览器访问。

手动复刻时先阅读教程。脚本模板是配置素材，不能未经检查就替换已有自定义脚本；其中的代理组名称需要在实际订阅中存在并经过连通性验证。

## 案例与验证范围

2026-09-26 的 ZJU 案例最终使用 `DOMAIN-SUFFIX,zju.edu.cn,<已验证代理组>`，覆盖主域名及任意层级子域名，而非逐个列出网站。DSKE 团队页面在 Edge 中正常显示，研究生院、WebVPN 和主站完成了连通性抽查，缓存真实 IP 的 WebVPN 路径也验证通过。

这不表示所有网络环境都应使用代理，也不保证所有校园内网服务可从商业代理访问。模板经过本地行为测试，skill 结构通过官方校验；现场配置与长期复用模板的差异在教程中说明。

仓库文件不包含订阅链接、节点密码、登录凭据或浏览器 Cookie。
