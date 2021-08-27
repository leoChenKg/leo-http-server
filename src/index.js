const path = require('path')
const http = require('http')
const chalk = require('chalk')
const fs = require('fs').promises
const mime = require('mime')
const leoTemp = require('leo-template')
const { URL } = require('url')
const { createReadStream } = require('fs')
const { renderTemplate } = require('leo-template')
const { getSelfIp, formatDirs, getStatFromList } = require('./util')

leoTemp.setConfig({
    contentBase: path.join(__dirname, "template")
})

module.exports = class Server {

    constructor(opt) {
        this.port = opt.port
        this.directory = opt.directory
        this.addressArr = getSelfIp()
    }

    async handleRequest(req, res) {
        let { pathname } = new URL(req.url, "http://localhost")
        let filePath = decodeURI(path.join(this.directory, pathname))

        try {
            let statObj = await fs.stat(filePath)

            if (statObj.isDirectory()) { //目录
                this.handleDir(res, statObj, filePath, pathname)
            } else { // 文件
                this.handleFile(res, statObj, filePath, pathname)
            }

        } catch (error) {
            this.handleError(error, res)
        }
    }

    async handleDir(res, statObj, filePath, pathname) {
        try {
            let dirs = await fs.readdir(filePath)
            dirs = formatDirs(dirs, pathname)
            dirs = await getStatFromList(dirs, filePath)
            let temp = await renderTemplate('./filesTemplate.html', { arr: dirs, currentDir: filePath, pathname })
            res.setHeader('Content-Type', "text/html;charset=utf-8")
            res.end(temp)
        } catch (error) {
            this.handleError(error, res)
        }
    }

    handleFile(res, statObj, filePath, pathname) {
        res.setHeader('Content-Type', `${mime.getType(filePath) || 'text/plain'};charset=utf-8`)
        createReadStream(filePath).pipe(res)
    }

    async handleError(error, res) {
        let temp = await renderTemplate('./errorTemplate.html', { message: error.message })
        res.end(temp)
    }

    start() {
        const server = http.createServer(this.handleRequest.bind(this))
        server.listen(this.port, () => {
            console.log(chalk.cyanBright('\nStarting up http-server, Serving for ' + this.directory))
            console.log(chalk.cyanBright('Available on:'))
            this.addressArr.forEach((address) => console.log(chalk.green(`  ${address}:${this.port}`)))
            console.log(chalk.cyanBright('Hit CTRL-C to stop the server.'))
        })

        server.on('error', (err) => {
            if (err.code === "EADDRINUSE") {
                server.listen(++this.port)
            }
        })
    }
}