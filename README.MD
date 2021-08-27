# http-server-leo

<p >
  <a href="https://www.npmjs.com/package/leo-template"><img src="https://img.shields.io/npm/v/leo-template" /></a>
</p>



> 一个静态文件服务器



## 使用

安装：

```shell
npm install http-server-leo
```



具体举例：

```shell
# 使用
hsl --port <prot> --directory <directory>
# 或者简写
hsl -p 3000 -d D: 
```

表示在 D: 盘下开启一个静态服务，以 3000 为端口。端口默认值为 3000，目录默认值为当前命令运行的目录。如下静态文件服务器开启成功。

![](D:\code\各种实现\http-server-leo\example.png)

可以在浏览器中访问了：

<img src="D:\code\各种实现\http-server-leo\example1.png" alt="image-20210827140629779" style="zoom:80%;" />