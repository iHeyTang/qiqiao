# monorepo 中使用 vscode#launch 进行 debug

## 背景介绍

flowooh 是使用 monorepo 进行代码库管理的，这意味着在[如何开发一个 vscode 插件](https://www.yuque.com/iheytang/auswkr/arf1x01zuze9k9pn?view=doc_embed)中得到的单一项目不能直接扔到 flowooh 中进行集成。

问题：
这个子项目中的` launch.json``tasks.json `如何提到项目根目录上。

## `launch.json`如何提到项目根目录上

原本的配置文件长这样：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Flowooh Editor Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
      "outFiles": ["${workspaceFolder}/out/**/*.js"],
      "preLaunchTask": "npm: compile"
    }
  ]
}
```

注意到了`args`和`outfFIle`中都使用了`${workspaceFolder}`，这实际上即是工作区间根目录，可以直接在之后拼接路径。
比如`outFiles`改为了`${workspaceFolder}/extensions/flowooh-editor-vsc/out/**/*.js`
而`preLaunchTask`是直接执行脚本，可以把这个脚本移到`task.json`中，利用任务来实现，那么这里就可以改成对应任务的 label，比如`task.json`新建一个任务为`compile-editor-vsc`

以下为调整后的配置，preLaunchTask 可以见下文`task.json`的改造

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Flowooh Editor Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}/extensions/flowooh-editor-vsc"
      ],
      "outFiles": [
        "${workspaceFolder}/extensions/flowooh-editor-vsc/out/**/*.js"
      ],
      "preLaunchTask": "compile-editor-vsc"
    }
  ]
}
```

## `tasks.json`如何提到项目根目录上

重新学习一下`vscode`中的`task.json`,官方文档中提到了一个参数 options，有如下介绍

> **options**: Override the defaults for cwd (current working directory), env (environment variables), or shell (default shell). Options can be set per task but also globally or per platform. Environment variables configured here can only be referenced from within your task script or process and will not be resolved if they are part of your args, command, or other task attributes.

`options.cwd` 可以设置工作路径，默认情况下，它指的是 workspace 的根路径，也就是 monorepo 项目的根路径。那么就意味着，只需要将工作路径调整到需要的子项目根路径下，就可以使得在特定目录下执行对应目录下的指令。

以下为调整过的`task.json`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "watch",
      "isBackground": true,
      "presentation": {
        "reveal": "never"
      },
      "options": {
        "cwd": "${workspaceFolder}/extensions/flowooh-editor-vsc"
      },
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },
    {
      "label": "compile-editor-vsc",
      "type": "npm",
      "script": "compile",
      "options": {
        "cwd": "${workspaceFolder}/extensions/flowooh-editor-vsc"
      }
    }
  ]
}
```

通过`options.cwd`重新设置了任务的工作路径，那么对应的指令或者脚本，也将在这个路径下工作。比如这个配置中的两个`node script`，`watch`和`complie`在根目录下不存在，但是在`flowooh-editor-vsc`存在，设置了`cwd`后，它也确实执行了该目录下的指令。
