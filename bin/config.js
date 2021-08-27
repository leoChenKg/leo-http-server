module.exports = [
    {
        option: "-p,--port <port>",
        description: "set the port",
        usage: "hsl --port <port>",
        default: "3000"
    },
    {
        option: "-d,--directory <directory>",
        description: "set the port",
        usage: "hsl --directory D:",
        default: process.cwd(),
    }
]