const os = require('os')
const path = require('path')
const fs = require('fs').promises
const moment = require('moment')
moment.locale('zh-cn');

const utils = {
    // 获取IP
    getSelfIp() {
        let networkMag = os.networkInterfaces()
        let netList = Object.values(networkMag).flat()

        let IPs = []

        netList.forEach((item) => {
            if (item.family === "IPv4") {
                IPs.push(`http://${item.address}`)
            }
        })
        return IPs
    },

    // 格式化目录
    formatDirs(dirs, pathname) {

        return dirs.map((dir) => ({
            label: dir,
            url: path.join(pathname, dir),
        }))

    },

    // 循环获取列表中文件的相关信息
    getStatFromList(list, prePath) {
        return new Promise((resolve) => {
            let resArr = []
            list = list.map(async (item) => {
                try {
                    let resourcePath = path.join(prePath, item.label)
                    let statObj = await fs.stat(resourcePath)
                    item.size = statObj.size
                    item.mtime = moment(new Date(statObj.mtimeMs)).format("YYYY/MM/DD a h:mm:ss")
                    if (statObj.isDirectory()) {
                        item.type = "dir"
                    } else {
                        item.type = "file"
                    }
                } catch (error) {
                    item.size = '??'
                    item.mtime = "??"
                    item.type = "unkown"
                }
                return item
            })



            let fileRes = []
            let dirRes = []
            let unkownRes = []
            let fun = utils.timeToExe(list.length, resolve)
            if (list.length === 0) fun([])
            list.forEach((item) => item.then((res) => {
                if (res.type === 'dir') {
                    dirRes.push(res)
                } else if (res.type === 'file') {
                    fileRes.push(res)
                } else {
                    unkownRes.push(res)
                }
                resArr = [...dirRes, ...fileRes, ...unkownRes]
                fun(resArr)
            }))
        })

    },

    timeToExe(time, fn) {
        return (...args) => {
            if (--time <= 0) {
                fn(...args)
            }
        }
    }

}

module.exports = utils
