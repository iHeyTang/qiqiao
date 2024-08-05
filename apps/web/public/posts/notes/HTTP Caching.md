# HTTP Caching

## 前言

在介绍 HTTP Caching 的文章中，绝大多数会提到强缓存和协商缓存两种类型。大概思路是：

1. 强缓存依靠浏览器实现的本地缓存机制进行，通过服务端返回结果中的 Expires，Max-Age 判断响应缓存是否在有效期内，若在有效期内则直接取用本地缓存。
2. 协商缓存依靠客户端和服务端间的约定，通过 Last-Modified 或 ETag+If-None-Match 进行验证是否返回 Not Modified 或返回新的资源。

但实际上在较为正是的文档中并未见到对应的有“强缓存”和“协商缓存”的概念。故对这种理解方法持保留态度。

## 私有缓存和共享缓存

在 [HTTP Caching](https://httpwg.org/specs/rfc9111.html) 标准中，有两种不同类型的缓存：**私有缓存**和**共享缓存**。即只做出了这两种分类。

### 私有缓存

私有缓存是绑定到特定客户端的缓存，一般就是指由浏览器维护的本地缓存。也就是一般前端通俗意义上理解的浏览器缓存。这是由于这个缓存是私有的，它仅能针对特定的用户（也就是特定的用户代理，也就是浏览器）生效。

### 共享缓存

共享缓存位于**客户端和服务器之间**，可以存储能在用户之间共享的响应。共享缓存可以进一步细分为**代理缓存**和**托管缓存**。

#### 代理缓存

除了访问控制的功能外，一些代理还实现了缓存以减少网络流量。这通常不由服务开发人员管理，因此必须由恰当的 HTTP 标头等控制。然而，在过去，过时的代理缓存实现——例如没有正确理解 HTTP 缓存标准的实现——经常给开发人员带来问题。

**Kitchen-sink 标头**如下所示，用于尝试解决不理解当前 HTTP 缓存规范指令（如 no-store）的“旧且未更新的代理缓存”的实现。

```http
Cache-Control: no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate
```

> Kitchen-sink**: **being or made up of a hodgepodge of disparate elements or ingredients.由不同元素的大杂烩组成，在这里代指没有经过任何理性分析处理，将所有可以用上的元素全部用上，以试图解决目的问题的动作，使得 Cache-Control 头部变成了一组“大杂烩”。

在这个示例中，实际上是为了解决由于代理缓存未更新，导致客户端处获取到的资源没有实时更新的问题。
no-store：不希望将响应存储在任何缓存中。
no-cache：指令不会阻止响应的存储，而是阻止在没有重新验证的情况下重用响应。
max-age: 意味着响应立即过时，它的使用是解决 HTTP/1.1 之前的许多实现无法处理 no-cache 这一指令。
must-revalidate：意味着一旦过时就不得在没有重新验证的情况下重用它。它和 max-age 搭配使用时，达到了类似 no-cache 的效果。即每次都强制重新验证缓存而不是直接重用响应。但是现在符合 HTTP/1.1 的服务器已经广泛部署，不应该再有这种用法了。
proxy-revalidate：要求所有的缓存服务器在接收到客户端带有该指令的请求返回响应之前，必须再次验证缓存的有效性。
而之所以会出现这种 Kitchen-sink 标头，

1. 由于发现设置了 no-store 后，缓存并未直接更新。这是由于缓存已经存在于代理中，设置了 no-store 后，在代理满足规范的情况下，也只是不会再执行新的缓存，而已有的缓存并不会随之清除。在未设置 no-cache 时，仍然会选择使用代理中的缓存，导致服务器的资源更新未给到客户端。
2. 发现了 max-age+must-revalidate 和 no-cache 两种方案。即将这些一同加入了标头。而实际上，前者只是为了解决早期部分代理服务器无法识别 no-cache 的问题。

然而，近年来，随着 HTTPS 变得越来越普遍，客户端/服务器通信变得加密，在许多情况下，路径中的代理缓存只能传输响应而不能充当缓存。因此，在这种情况下，无需担心甚至无法看到响应的过时代理缓存的实现。

#### 托管缓存

托管缓存由服务开发人员明确部署，以降低资源服务器负载并有效地交付内容。包括了反向代理，CDN 和 service worker 与缓存 API 的组合。

托管缓存的特性因部署的产品而异。在大多数情况下，你可以通过 Cache-Control 标头和你自己的配置文件或仪表板来控制缓存的行为。

例如，HTTP 缓存规范本质上没有定义显式删除缓存的方法——但是使用托管缓存，可以通过仪表板操作、API 调用、重新启动等实时删除已经存储的响应。这允许更主动的缓存策略。

也可以忽略标准 HTTP 缓存规范协议以支持显式操作。例如，可以指定以下内容以选择退出私有缓存或代理缓存，同时使用你自己的策略仅在托管缓存中进行缓存。

```http
Cache-Control: no-store
```

例如，Varnish Cache 使用 VCL（Varnish Configuration Language，一种 [DSL(en-US)](https://developer.mozilla.org/en-US/docs/Glossary/DSL/Domain_specific_language)）逻辑来处理缓存存储，而 service worker 结合缓存 API 允许你在 JavaScript 中创建该逻辑。

这意味着如果托管缓存故意忽略 no-store 指令，则无需将其视为“不符合”标准。你应该做的是，避免使用 kitchen-sink 标头，而是**仔细阅读你正在使用的任何托管缓存机制的文档，并确保你选择的方式可以正确的控制缓存**。

请注意，某些 CDN 提供自己的标头，这些标头仅对该 CDN 有效（例如，Surrogate-Control）。目前，正在努力定义一个 [CDN-Cache-Control](https://httpwg.org/specs/rfc9213.html) 标头来标准化这些标头。

## 启发式缓存

HTTP 旨在尽可能多地缓存，因此即使没有给出 Cache-Control，如果满足某些条件，响应也会被存储和重用。这称为**启发式缓存**。
例如，采取以下响应。此回复最后一次更新是在 1 年前。

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024
Date: Tue, 22 Feb 2022 22:22:22 GMT
Last-Modified: Tue, 22 Feb 2021 22:22:22 GMT
<!doctype html>
```

试探性地知道，整整一年没有更新的内容在那之后的一段时间内不会更新。其中 Date 是当前相应的应答时间，Last-Modified 表示当前资源最后一次修改的时间，可以发现它已经一年没有发生变化了。
因此，客户端存储此响应（尽管缺少 max-age）并重用它一段时间。复用多长时间取决于实现，但规范建议存储后大约 10%（在本例中为 0.1 年）的时间。

启发式缓存是在 Cache-Control 被广泛采用之前出现的一种解决方法，**目前基本上所有响应都应明确指定 Cache-Control 标头**。

## 基于 age 的缓存策略

存储的 HTTP 响应有两种状态：**fresh** 和 **stale**。_fresh_ 状态通常表示响应仍然有效，可以重复使用，而 _stale_ 状态表示缓存的响应已经过期。

确定响应何时是 fresh 的和何时是 stale 的标准是 **age** 。在 HTTP 中，age 是自响应生成以来经过的时间。这类似于其他缓存机制中的 [TTL(en-US)](https://developer.mozilla.org/en-US/docs/Glossary/TTL)。

以下面的示例响应为例（604800 秒是一周）：

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024
Date: Tue, 22 Feb 2022 22:22:22 GMT
Cache-Control: max-age=604800
<!doctype html>
…
```

存储示例响应的缓存计算响应生成后经过的时间，并将结果用作响应的 _age_。即从 Date 的时间开始计算，一周内的响应都是新鲜的。
对于示例响应，max-age 的含义如下：

- 如果响应的 age *小于*一周，则响应为 _fresh_。
- 如果响应的 age *超过*一周，则响应为 _stale_。

只要存储的响应保持新鲜（fresh），它将用于兑现客户端请求。

当响应存储在共享缓存中时，有必要通知客户端响应的 age。继续看示例，如果共享缓存将响应存储了一天，则共享缓存将向后续客户端请求发送以下响应。

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024
Date: Tue, 22 Feb 2022 22:22:22 GMT
Cache-Control: max-age=604800
Age: 86400
<!doctype html>
…
```

相对于前者，多了一个 Age 的标头，即表示这个请求已经经过了一天的时间。那么其新鲜的时间仍然是从 Date 的时间开始计算一周时间，但要扣除 Age 已经经过的时间，即它在剩余的 6 天（518400 秒）内是新鲜的。

## Expires 或 max-age

在 HTTP/1.0 中，新鲜度过去是由 Expires 标头决定的。Expires 标头使用明确的时间而不是通过指定经过的时间来指定缓存的生命周期。

```http
Expires: Tue, 28 Feb 2022 22:22:22 GMT
```

这个和 Cookie 的过期时间类似（参考[Cookie 介绍](https://www.yuque.com/zhangdehui/ip75em/adeewn5lka1k0ioe)）

```http
HTTP/1.0 200 OK
Set-Cookie: lu=Rg3vHJZnehYLjVg7qi3bZjzg; Expires=Tue, 15 Jan 2013 21:47:38 GMT; Path=/; Domain=.example.com; HttpOnly
```

区别在于缓存的 Expires 是直接给在标头的，而 Cookie 的 Expires 是给在 Set-Cookie 标头内部，属于 Set-Cookie 的 attribute。

同样的，Expires 和 Cookie 的 Expires 都是老版本的方案，在新的方案中，可以采用`Cache-Control: max-age`来指定过期时间，和 Cookie 的`Set-Cookie: Max-Age=86400`类似。

## Vary 响应

区分响应的方式本质上是基于 URL。但是响应的内容并不总是相同的，即使它们具有相同的 URL。特别是在执行内容协商时，来自服务器的响应可能取决于 Accept、Accept-Language 和 Accept-Encoding 请求标头的值。

例如，对于带有 Accept-Language: en 标头并已缓存的英语内容，不希望再对具有 Accept-Language: ja 请求标头的请求重用该缓存响应。在这种情况下，您可以通过在 Vary 标头的值中添加“Accept-Language”，根据语言单独缓存响应。

```http
Vary: Accept-Language=en-US
```

## 验证响应

过时的响应不会立即被丢弃。HTTP 有一种机制，可以通过询问源服务器将陈旧的响应转换为新的响应。这称为**验证**，有时也称为**重新验证**。
验证是通过使用包含 If-Modified-Since 或 If-None-Match 请求标头的**条件请求**完成的。

> 在上述中，利用 Expires/max-age+Date 的组合实现的缓存机制，即被称作所谓的“强缓存”。而这种使用 If-Modified-Since 或 If-None-Match 的，使得客户端和服务端间达成某种协商机制的，被称作所谓的“协商缓存”。
>
> 实际上，在任何较官方性质的文档中，均未找到有关于“强缓存”和“协商缓存”的区分方式或类似的名称定义。但在其他博客，尤其是中文站点中，这个概念频繁出现。

### If-Modified-Since

以下响应在 22:22:22 生成，`max-age`为 1 小时，因此可知在 23:22:22 之前是新鲜的。

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024
Date: Tue, 22 Feb 2022 22:22:22 GMT
Last-Modified: Tue, 22 Feb 2022 22:00:00 GMT
Cache-Control: max-age=3600
<!doctype html>
…
```

如果内容自指定时间以来没有更改，服务器将响应 `304 Not Modified`。由于此响应仅表示没有变化，因此没有响应主体，只有一个状态码，因此传输大小非常小。

```http
HTTP/1.1 304 Not Modified
Content-Type: text/html
Date: Tue, 22 Feb 2022 23:22:22 GMT
Last-Modified: Tue, 22 Feb 2022 22:00:00 GMT
Cache-Control: max-age=3600
```

收到该响应后，客户端将存储的陈旧响应恢复为新鲜的，并可以在剩余的 1 小时内重复使用它。

服务器可以从操作系统的文件系统中获取修改时间，这对于提供静态文件的情况来说是比较容易做到的。但是，也存在一些问题；例如，时间格式复杂且难以解析，分布式服务器难以同步文件更新时间。
为了解决这些问题，**ETag 响应标头被标准化作为替代方案**。

> 这里没有找到这种方案中，如何告知服务器，本地具有一份怎样的缓存，服务器如何判断某个请求应该返回 200 还是返回 304。不过这个方案本身也已经被 ETag/If-None-Match 取代了，这里不纠结了先。

### ETag/If-None-Match

ETag 响应头的值是服务器生成的任意值。服务器对于生成值没有任何限制，因此服务器可以根据他们选择的任何方式自由设置值 - 例如正文内容的哈希或版本号。

举个例子，如果 ETag 头使用了 hash 值，index.html 资源的 hash 值是 deadbeef，响应如下：

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024
Date: Tue, 22 Feb 2022 22:22:22 GMT
ETag: "deadbeef"
Cache-Control: max-age=3600

<!doctype html>
…
```

如果该响应是陈旧的，则客户端获取缓存响应的 ETag 响应标头的值，并将其放入 If-None-Match 请求标头中，以询问服务器资源是否已被修改：

```http
GET /index.html HTTP/1.1
Host: example.com
Accept: text/html
If-None-Match: "deadbeef"
```

如果服务器为请求的资源确定的 ETag 标头的值与请求中的 If-None-Match 值相同，则服务器将返回 304 Not Modified。但是，如果服务器确定请求的资源现在应该具有不同的 ETag 值，则服务器将其改为 200 OK 和资源的最新版本进行响应。

> 在评估如何使用 ETag 和 Last-Modified 时，请考虑以下几点：在缓存重新验证期间，如果 ETag 和 Last-Modified 都存在，则 ETag 优先。因此，如果你只考虑缓存，你可能会认为 Last-Modified 是不必要的。然而，Last-Modified 不仅仅对缓存有用；相反，它是一个标准的 HTTP 标头，内容管理 (CMS) 系统也使用它来显示上次修改时间，由爬虫调整爬取频率，以及用于其他各种目的。所以考虑到整个 HTTP 生态系统，**最好同时提供 ETag 和 Last-Modified**。

### 强制重新验证

这种模式下，即不考虑本地缓存的重复使用响应，希望始终从服务器获取最新内容，这也是通常提到的最典型的“协议缓存”，可以使用`no-cache`指令强制验证。即每次请求都会从服务器处进行验证。

通过在响应中添加 Cache-Control: no-cache 以及 Last-Modified 和 ETag - 如下所示 - 如果请求的资源已更新，客户端将收到 200 OK 响应，否则，如果请求的资源尚未更新，则会收到 304 Not Modified 响应。

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024
Date: Tue, 22 Feb 2022 22:22:22 GMT
Last-Modified: Tue, 22 Feb 2022 22:00:00 GMT
ETag: deadbeef
Cache-Control: no-cache

<!doctype html>
…
```

#### 已经不推荐的 max-age=0+must-revalidate

max-age=0 和 must-revalidate 的组合与 no-cache 具有相同的含义。

```http
Cache-Control: max-age=0, must-revalidate
```

max-age=0 意味着响应立即过时，而 must-revalidate 意味着一旦过时就不得在没有重新验证的情况下重用它——因此，结合起来，语义似乎与 no-cache 相同。
然而，max-age=0 的使用是解决 HTTP/1.1 之前的许多实现无法处理 no-cache 这一指令——因此为了解决这个限制，max-age=0 被用作解决方法。
但是现在符合 HTTP/1.1 的服务器已经广泛部署，没有理由使用 max-age=0 和 must-revalidate 组合——你应该只使用 no-cache。

### 不使用缓存

no-cache 指令不会阻止响应的存储，而是阻止在没有重新验证的情况下重用响应。
如果你**不希望将响应存储在任何缓存中**，请使用 no-store。

```http
Cache-Control: no-store Copy to ClipboardCopy to Clipboard
```

但是，一般来说，实践中“不缓存”的原因满足以下情况：

- 出于隐私原因，不希望特定客户以外的任何人存储响应。
- 希望始终提供最新信息。
- 不知道在过时的实现中会发生什么。
