# Event Loop

事件循环的基本原理是，将任务分为两类：宏任务（macro-task）和微任务（micro-task）。宏任务包括整体代码块、setTimeout、setInterval等，而微任务包括Promise、MutationObserver等。

##### 浏览器的事件循环
浏览器的事件循环流程

1. 执行同步代码
2. 执行一个宏任务（栈中没有，就从任务队列中获取)
3. 执行过程中，如果遇到微任务，就将它加入到微任务的任务队列中
4. 宏任务执行完毕，立即执行当前微任务队列的全部微任务（依次执行)
5. 当前宏任务执行完毕，开始检查渲染，然后渲染进程接管进行渲染
6. 渲染完毕后，JavaScript线程继续接管，开始下一个循环

宏任务主要包括：

1. script
2. setTimeOut， setInterval，setImmediate
3. I/O、
4. UI交互事件

微任务主要包括：

1. Promise
2. MutationObserver

##### Nodejs的事件循环
[https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)
当Nodejs启动时，就会初始化好event loop，执行输入的脚本，或者进入REPL，它会产生异步API的调用，scheduled timers，或者执行了`process.nextTick()`。然后，就会开始进行事件循环。
Nodejs的事件循环分成了不同的阶段(phase)

1. timers：setTimeOut，setInterval
2. pending callbacks：延迟到下一个循环的I/O回调。
3. idle, prepare： 仅内部使用。
4. poll(imcomings: connections, data, etc.)：检索新的I/O事件，执行与I/O相关的回调（除了close callback，定时器预定的，以及setImmediate），node将在合适的时候阻塞在这里
5. check：setimmediate的回调将在这里被调用
6. close callbacks：一些关闭回调，如 `socket.on('close', ...)`

每一个阶段都有自己独立的回调函数FIFO队列。当事件循环进入到某一个阶段的时候，它就会执行这个阶段中所有的操作，然后执行这个阶段的回调函数，直到这个阶段的队列被清空，或者达到了最大的回调次数，然后进入到下一个阶段。
在每次事件循环的间隙，Nodejs都会检查是否有正在等待的异步I/O或者定时器，如果没有的话，就会关闭进程。
###### timers
setInterval和setTimeOut在Nodesjs中，位于名为timers的阶段中，也是事件循环中的第一个阶段，它会去执行已经满足条件的定时任务的回调函数，也就是设定的时间。但这个时间只是一个阈值，希望它达到阈值事件后尽早的执行，而不是一个确切的时间。因为操作系统的调度或者其他的回调函数的执行可能会造成一定的阻塞，从而延迟这些timers回调的执行。一般来讲，这个在poll阶段中最为严重。
###### pending callbacks
一些操作系统的回调函数的执行。
比如TCP的错误，TCP socket在尝试链接时取得了一个ECONNREFUSED。一些*nix系统会希望等待这些错误的报告，那么就会把这个错误放到队列里，并在pending callbacks处依次执行。
###### poll
poll有两个主要的功能

1. 计算它应该阻塞多长时间并轮询I/O，然后
2. 处理poll的队列中的事件

当事件循环进入了poll阶段且没有安排timers时，将发生两种情况

1. 如果poll的队列不是空的，event loop将遍历回调队列，同步执行这些回调，直到清空队列或者达到系统相关的硬件限制。
2. 如果pool的队列是空的，那么额外还有两个事情。1. 如果通过`setImmediate()`调用了脚本，那么event loop就会结束poll阶段，进入check阶段，然后执行被预定的回调函数内的脚本。2. 如果没有通过`setImmediate()`调用脚本，event loop就会等待回调函数注入到队列中，然后立刻执行他们

一旦poll的队列被清空掉，event loop就会检查一下有没有超出阈值的timers，如果有的话，就会返回到timer阶段，并且去执行这些timer的回调函数
###### check
这个阶段允许人们能够在poll阶段之后直接执行回调函数。如果poll的队列清空了且有被`setImmediate()`排进队列的脚本，那么event loop就会继续到check中执行，而不是等待。
`setImmediate()`就是一个特殊的timer，它运行在event loop中的一个特殊的阶段，使用`libuv`的接口来实现。
###### close callback
如果一个socket被突然的关闭，比如使用了`socket.destroy()`，那么 `close`事件就会在这个阶段被触发回调。否则的话就会通过 `process.nextTick()`来抛出。

##### 解释一下 `process.nextTick()`
`process.nextTick()`从技术角度上来说，它并不是event loop的一部分。`nextTickQueue`无视当前所处的阶段(phase)，它将在当前的操作后执行。操作被定义成了一个需要js来处理执行的底层C/C++处理的转化。
不论在任何一个阶段调用`process.nextTick()`，它都会在event loop继续到下一个阶段前被执行。那么它可能会造成一个不好的情况：即它允许使用者通过递归调用`process.nextTick()`，来“饿死”用户的I/O，也就是它将阻止event loop进入poll阶段。
##### `process.nextTick()`的设计初衷和目的是什么
这样设计的一个原因是，在Nodejs中，异步编程模型被广泛的使用，因为它允许在执行耗时操作时不阻塞主线程，使得Nodejs能够在处理大量的并发请求中表现出色。基于此，“即使一个API不需要异步，它也应该被设计成异步的”。它符合Nodejs的异步编程模型，保持一致性和可扩展性。

以下是一个snippet
当我们定义了一个异步函数`someAsyncApiCall`，但它实际上是同步运行的。在调用了 `someAsyncApiCall`后，实际上`bar`还没有被赋值，就会给出`undefined`的打印。但是如果包裹一层`process.nextTick()`后，由于会先执行完当前的操作再去执行callback，使得能够正常打印出bar的值。

以下是一个实际的例子
```javascript
const server = net.createServer(() => {}).listen(8080);
 
server.on('listening', () => {});
```
第一行中调用了`listen`，就会立即进行端口的绑定，触发一个`listening`的事件并调用事件的回调函数，但是由于此时这个事件还没有设置回调函数(第二行代码)，那么就无法进行回调函数的触发。
解决方法是，在nextTick中对 `lisening`事件进行排队，以允许脚本运行到完成。

##### `process.nextTick()`和`setImmediate()`的区别
[https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick#processnexttick-vs-setimmediate](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick#processnexttick-vs-setimmediate)
`process.nextTick()`无视当前所处的阶段，将在当前操作完成后立即执行。`setimmediate()`将在event loop的后续循环中执行。
 官方文档中也明确指出了，这两个词其实应该进行互换，也就是`process.nextTick()`实际上更符合“立即执行”的描述，而`setImmediate()`的表现更符合“下一阶段执行”的描述。但是由于历史包袱的原因，这两者没办法再调整了。
官方文档也更建议使用`setImmediate()`，因为它更容易进行推理。
##### 为什么休要process.nextTick() 

1. 允许用户处理错误，清楚不必要的资源，或者再事件循环结束之前再次进行尝试请求
2. 有时需要在展开调用栈之后并在event loop之前执行一个回调
```javascript
const server = net.createServer();
server.on('connection', conn => {});
 
server.listen(8080);
server.on('listening', () => {});
```
假设`listen()`在event loop开始时运行，但是设置监听回调被放在了`setImmediate()`中，除非传递一个主机名，否则端口绑定将立刻发生。event loop想要继续进行，就必须进入poll，那么在监听事件之前，有可能已经受到了链接，并触发了`listening`事件，但是对应的监听回调还没来得及被设置。
