# Cookie

## 前言

绝大多数介绍 Cookie 的博客里，会提及以下几点：

1. cookie 是有服务端设置的，存储在本地
2. cookie 有过期时间，通过 expires 和 max-age 控制
3. cookie 最大限制约为 4kb

但是未提及或未明确：

1. cookie 是通过服务端返回的 Reponse Header 中的 Set-Cookie 头设置的，且有固定的格式。
2. cookie 最大限制为 4kb 的原因，是由 2011 年起草的 RFC6265 规范中规定 cookie 实现最小为 4kb，不同浏览器均根据此规范进行实现，且会有略微差别（上下浮动 1-2kb），不同浏览器可存储的 cookie 数量也是不同的。
3. cookie 的有效期控制中，expires 是旧版的指定特定过期时间的，而 max-age 是同样于 RFC6265 中规定的新的以秒为单位的有效时长。且两者同时出现时以 max-age 为准（因为这个是更新的标准）

除此之外，包括其他参数，Secure，HttpOnly，较新的 SameSite 有什么设置含义，以及对于 cookie 还有一些其他的特性并没有明确说明。故以下为对 cookie 理解的笔记。

## 背景

### 名称的由来

cookie 的名称是 web 开发程序员卢·蒙特利 Lou Montulli 提出的。它来源于术语 magic cookie，这是 Unix 程序员使用的一个程序接收和发送的数据包。而 magic cookie 灵感来源于幸运饼干 fortune cookie。

### 历史

实际上，在 1994 年 6 月卢·蒙特利开始在 web 通信中使用 magic cookie 之前，计算机领域内就已经存在这个概念了。他当时就职于 Netscape，要为 MCI 开发一个电子商务应用。MCI 不希望在服务中维护所有的事务状态，而是在用户自己的电脑本地维护。所以 Cookie 就被提出用来保存购物车信息。即 Cookie 在 web 中最早的应用，实际上是为了存储购物车信息。

1994 年 10 月 13 日，Mosaci Netscape 0.9beta，首次正式支持了 Cookie（out of labs）。
1995 年 10 月，Internet Explorer Version2，集成了对 Cookie 的支持。
1995 年，蒙特利申请了 Cookie 的专利，1998 年，此专利获批。

RFC 2965 后来还加入了 Set-Cookie2 头部，但是实际很少被使用，在 2011 年 4 月的 RFC 6265 中被弃用。现在所有的现代浏览器都不再支持 Set-Cookie2 了。

2011 年编写的 RFC 6265 也被作为目前 Cookie 的明确权威规范。可参考https://www.rfc-editor.org/rfc/rfc6265

## 术语

### Session Cookie

Session Cookie 也被称为 In-memory Cookie，Transient Cookie，或者 Non-persistent Cookie。仅存临时性的存在于内存中。当浏览器关闭后，Session Cookies 即过期或被删除。Session Cookie 由浏览器是否有分配过期时间来标识。

即如果没有给定过期时间，就被认为是一个 Session Cookie，当浏览器关闭后就会被清除。

### Persistent Cookie

和 Session Cookie 相对的，它存储在磁盘上而非内存中。它必须给定特定的过期时间。不会随着浏览器关闭而被清除。Persistent Cookie 有时也被称为 Tracking Cookies，因为可以被广告商用来记录长时间的网页浏览习惯。或者也可以作为保存用户的登录状态，避免每次访问都需要重新录入登录凭证。

现在最常用的 JWT，实际上就是类似的这种机制。不同处在于，JWT 需要 web 应用显式的附加到 HTTP 请求中，而 Cookie 是由浏览器自行处理的。

### Secure Cookie

Secure Cookie 仅能通过加密链接 HTTPS 进行传输。通过在 Cookie 中添加 secure 标志即可。

### Http-only Cookie

Http-only Cookie 不能被客户端的 api（如 javascript）访问。这样可以限制 XSS（Cross Site Scripting 跨站脚本攻击）窃取 cookie 的威胁。但是仍然容易受到 XST（Cross Site Tracking 跨站跟踪）和 CSRF（Cross-Site Request Forgery 跨站请求伪造）攻击。通过在 Cookie 中添加 HttpOnly 标志即可。

### Same-site Cookie

2016 年，Google Chrome version 51，提出了一种新的 Cookie，即 Same-site Cookie。它通过属性 SameSite 来标识。SameSite 有 3 个参数可选，Strict，Lax，None。

SameSite=Strict。浏览器只能发送同源的 Cookie 给同源站点，它一定程度上缓解了 CRSF 攻击（它限制了攻击站点利用被攻击站点的 Cookie 直接伪造请求，因为攻击站点和被攻击站点不同源，请求会直接被浏览器拦截下来）。

SameSite=Lax。浏览器可以携带 Cookie 向非同源站点发起请求。但仅限于安全请求，如 GET 可以，POST 不可以。

SameSite=None。允许任何三方 Cookie，不做任何限制。

目前绝大多数浏览器默认采用的是 SameSite=None。包括 Chrome，FireFox，Microsoft Edge 都开始支持 SameSite，并默认采用 SameSite=None。

在 2020 年 2 月，Chrome 试图将默认规则改为 SameSite=Lax，即出现在 Google Chrome v80 版本。这也是为什么当时有时做跨域请求需要携带 Cookie 时，请求会被浏览器拦截的原因。这样会导致在这之前未做 SameSite 处理的网站可能变得无法正常访问。

在 2020 年 4 月，Chrome 临时回滚了这一个特性，即将默认 SameSite=Lax 改回了 SameSite=None。并给出了一份更新适配计划。目前（2022 年 12 月）最新版本是 v108，应该已经全面变更了。

Chrome 的两次骚操作，可以参考下面官方给出的 Blog。
[https://blog.chromium.org/2020/02/samesite-cookie-changes-in-february.html](https://blog.chromium.org/2020/02/samesite-cookie-changes-in-february.html)
[https://blog.chromium.org/2020/04/temporarily-rolling-back-samesite.html](https://blog.chromium.org/2020/04/temporarily-rolling-back-samesite.html)

### SuperCookie

SuperCookie 作用于顶级域上，如.com 或者.com.cn 上。而不是像常规 cookie 一样只在特定域如 example.com 上生效。Suppercookie 可能是一个潜在的安全隐患，所以大多数浏览器都屏蔽了这个特性。如果没有这个屏蔽，恶意网站可能会通过 Suppercookie 冒充一个合法的网站的 cookie，并向该网站发起对应的攻击请求。

另外的 Supercookie 也可能被用于不依赖于 Http Cookie 的跟踪技术。这个在微软和 Mozilla 中都发现了这样的案例。这里不做具体说明。

### Zombie Cookie

Zombie Cookie 是网络服务在访问者的设备上存放的数据和代码，它们并不存放于实际的 Cookie 专用的存储位置。当常规的 Cookie 被清除后，Zombie Cookie 恶意识别被删除的 cookie，并自动重新创建出常规的 cookie。它们通常可以存储在多个位置，如 Flash Local shared object，HTML5 web storage，其他的客户端中，甚至是服务端上。

### Cookie wall

Cookie wall 会在一些网站上弹出，并告知用户该网站对于 cookie 的使用情况，这些 cookie 很可能会收集用户的操作记录和使用习惯，并用作服务提供者自身的用户研究或转卖给其他机构。一般来讲，用户可以选择同意或者不同意站点对于自身 cookie 的收集和使用。但是 cookie wall 不会给拒绝选项。也就意味着，如果不同意服务提供方对使用者的 cookie 的使用，就无法继续使用对应的服务，这样的操作拦截机制，被称作 cookie wall。

## 结构

一个 Cookie 包含了 3 个部分：

1. Name
2. Value
3. 0 个或多个 attribute，attribute 存储了如 expiration，domain，flags（such as Secure，HttpOnly）。

以下列举一些常见的 Attribute

1. Domain，设置 Cookie 在哪个域是有效的，比如设置了 domain 是`.example.com`,那么在`a.example.com`和`b.example.com`都是有效的。需要注意的是，在哪个域有效，和跨域是两个概念，不同子域拥有同一的 cookie，并不影响非同源的跨域请求。
2. Path，设置域名后的子路径，和 Domain 类似。用于区分同一个域下的路径，如存在`.example.com/a`和`.example.com/b`,两者的 cookie 是不能同时获取的。
3. Expires/Max-age，设置 Cookie 的过期时间。Expires 是过期时间的 CMT 时间戳。Max-age 是单位为妙的有效期，0 则立马失效，负数则页面关闭后失效，默认为-1
4. HttpOnly，不可被脚本读取或修改，如上文描述的 HttpOnly cookie
5. SameSite，如上文描述的 Samesite cookie
6. Priority，优先级，Low/Medium/High，当数量超出限制时，优先级低的 cookie 会被删除。

## 实现

一般来讲，cookie 是由服务端通过 Http Response Header 中的 Set-Cookie 头部来赋值的。即浏览器会解析 Set-Cookie 中的内容进行存储，不需要前端处理。即 Cookie 是由服务端设置的。

但实际上也 cookie 也能够通过前端的脚本，如 javascript 进行读取并修改。当然，存在 HttpOnly 的标识符为 true 时，浏览器对脚本进行限制，无法读取或修改此类 cookie。

Cookie 规范中，对浏览器提出了如下要求：

1. 每一个 cookie 支持长度至少 4096 个字节。
2. 每一个站点（domain，i.e. website）支持至少存储 50 个 cookie
3. 总共支持至少存储 3000 个 cookie

具体可参考https://www.rfc-editor.org/rfc/rfc6265#section-6.1

然而实际的各自浏览器，对于其实现有差别。如 IE6 由于发布时间较早（IE6 于 2001 年发布，但 RFC 6265 是 2011 年编写的）只支持每个域 20 个 cookie；如 IE6 支持的 Cookie 大小只有 4095，差一个字节。如 Safari 支持的 Cookie 大小为 4097，多一个字节。所以，一般说浏览器对 Cookie 的支持，为每个 cookie 最大长度约 4k 字节。

### 设置一个 Cookie

Cookie 是通过服务器响应的 Http Reponse Header 中的 Set-Cookie 头部设置的。Set-Cookie 指示浏览器存储这些 Cookie，并在后续的请求中携带这些 Cookie 给到服务端。一个 Reponse Header 中可以存在多个 Set-Cookie 头，这些 Set-Cookie 都会被浏览器依次处理。每一个 Set-Cookie 都会对应着一个 Cookie。

### Cookie Attribute

#### Domain and Path

```
HTTP/1.0 200 OK
Set-Cookie: LSID=DQAAAK…Eaem_vYg; Path=/accounts; Expires=Wed, 13 Jan 2021 22:23:01 GMT; Secure; HttpOnly
Set-Cookie: HSID=AYQEVn…DKrdst; Domain=.foo.com; Path=/; Expires=Wed, 13 Jan 2021 22:23:01 GMT; HttpOnly
Set-Cookie: SSID=Ap4P…GTEq; Domain=foo.com; Path=/; Expires=Wed, 13 Jan 2021 22:23:01 GMT; Secure; HttpOnly
```

若一个请求中没有指定 Domain 或者 Path，则默认所请求的资源的 Domain 或 Path

#### Expires and Max-Age

```
HTTP/1.0 200 OK
Set-Cookie: lu=Rg3vHJZnehYLjVg7qi3bZjzg; Expires=Tue, 15 Jan 2013 21:47:38 GMT; Path=/; Domain=.example.com; HttpOnly
Set-Cookie: made_write_conn=1295214458; Path=/; Domain=.example.com
Set-Cookie: reg_fb_gate=deleted; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/; Domain=.example.com; HttpOnly
```

1. Expires 已经在 HTTP version1.1 中被弃用了，取而代之的是使用 Max-age，只需要指定这个 cookie 有效期是多长时间就可以了。
2. 早期的 IE，如 IE6，IE7，IE8，不支持 Max-Age。除此之外，现代浏览器都是支持 Max-Age 的，只要没有特殊说明的，直接使用 Max-Age 就对了。
3. 当 Expires 和 Max-Age 同时使用，且浏览器对两者都支持的情况下。会忽略 Expires，而以 Max-Age 为准。

#### Secure and HttpOnly

Secure 和 HttpOnly 属性没有关联值，仅仅出现它们的属性名就表明应该启用它们的行为。这种属于标识位。有则为真。
