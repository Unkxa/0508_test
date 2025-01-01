const fs = require('fs')
const { Client } = require('node-scp')
const params = process.argv.slice(2)
// 通过命令行传入的参数 params，并提取了第一个参数作为 FOLDER_NAME
const FOLDER_NAME = params[0] || 'administrative'
;(async function () {
  if (!FOLDER_NAME) {
    return log('red', `\n请输入要上传的文件夹目录  如:\nnode nodeScp.js administrative\n`)
  } else if (!fs.existsSync(`./dist/${FOLDER_NAME}/`)) {
    return log('red', `\n文件夹：dist/${FOLDER_NAME}不存在\n`)
  }
  const client = await Client({
    host: '192.168.10.27',
    port: 22,
    username: 'root',
    password: 'Ckjb[[5/jzk',
  })
  log('green', '----------start upload----------')

  await client.uploadDir(
    `./dist/${FOLDER_NAME}/`,
    `/nfs-data/web-server-www-data-pvc-4eba5991-362b-4b21-b6dd-34a5557bd06b/${FOLDER_NAME}`
  )
  log('green', '----------success upload----------')
  client.close()
})()

function log(key, ...info) {
  const str = {
    red: '\x1B[31m%s\x1B[0m', // 红色
    green: '\x1B[32m%s\x1B[0m', // 绿色
    yellow: '\x1B[33m%s\x1B[0m', // 黄色
    blue: '\x1B[34m%s\x1B[0m', // 蓝色
    cyan: '\x1B[36m%s\x1B[0m', // 青色
  }[key]
  return console.log(str, ...info)
}
