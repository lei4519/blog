# Electron 进程通信

进程间的通信主要涉及一下四个模块

1. ipcMain：在主进程中使用，用来接收和回复渲染进程的消息
2. ipcRenderer：在渲染进程中使用，用来接收和回复主进程、其他渲染进程的消息
3. webContents：每个渲染进程都拥有一个webContents对象，调用webContents.send可以向此进程发送消息
4. remote：能够在渲染进程中使用主进程模块

> 上面这些方法，其实都是node的事件机制，都是EventEmitter的实例。

## 主进程和渲染进程通信

### 主进程 主动发送消息至 渲染进程

使用 [webContents.send](https://www.electronjs.org/docs/api/web-contents#contentssendchannel-args)

- 主进程发送
  ```js
  const { BrowserWindow } = require("electron");
  const win = new BrowserWindow();
  win.webContents.send("eventType", "message");
  ```
- 渲染进程接收
  ```js
  const { ipcRenderer } = require("electron");
  ipcRenderer.on("eventType", (IpcRendererEvent, msg) => {});
  ```

### 渲染进程 主动发送消息至 主进程

使用[ipcRenderer.send](https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendchannel-args)发送异步消息

使用[ipcRenderer.sendSync](https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendsyncchannel-args)发送同步消息

- 渲染进程发送

  ```js
  ipcRenderer.send("eventType", "msg");
  ```

- 主进程接收
  ```js
  ipcMain.on("eventType", (IpcMainEvent, msg) => {});
  ```

### 回复消息的统一方式

上面两个例子的on方法，接受的回调函数都有一个event对象，可以使用这个event对象进行消息回复

先看一下这两个event对象有什么属性

- [IpcMainEvent](https://www.electronjs.org/docs/api/structures/ipc-main-event)

  - frameId: Integer -> 发送消息的渲染进程框架的ID（可能是iframe）
  - sender: WebContents -> 发送消息的渲染进程的webContents引用，所以我们也可以使用sender.send来回复消息
  - returnValue: any -> 同步回复消息（赋值）
  - reply: Function -> 异步回复消息（函数调用）

- [IpcRendererEvent](https://www.electronjs.org/docs/api/structures/ipc-renderer-event)
  - sender: IpcRenderer -> electron.IpcRender的引用
  - senderId: Integer -> 发送消息的进程 webContents.id，渲染进程的消息触发可能是主进程，也可能是其他渲染进程，可以通过调用 event.sender.sendTo(event.senderId, msg)来回复此信息。从主进程直接发来的信息的 event.senderId是设置为0的。

## 渲染进程之间通信

### 通过全局属性 实现数据共享

- 主进程中定义全局对象
  ```js
  global.share = {
    id: 1,
  };
  ```
- 渲染进程中通过remote模块控制全局对象

  ```js
  const share = remote.getGlobal("share");
  console.log(share.id); // get
  share.id = 2; // set
  ```

> 只能实现数据共享，并非真正的通信

### 利用主进程做消息中转

这个就不写代码了，就是`渲染进程A` 发送消息至 `主进程`, `主进程` 转发消息至 `渲染进程B`。

### 通过进程ID 直接获取目标进程 进行ipc通信

- 如何获取进程ID

  - 通过全局对象共享
  - 主进程通过webContents.send发送消息

- 通过ID发送消息
  - `ipcRender.sendTo(ID, eventType, msg)`
  - `remote.BrowserWindow.fromId(ID).webContents.send(eventType, msg)`
