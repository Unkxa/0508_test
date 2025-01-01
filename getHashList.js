const args = process.argv.slice(2)
const exec = require('util').promisify(require('child_process').exec)
const path = require('path')
const fs = require('fs')
const zip = new require('jszip')()

;(async function () {
  const folder = args[0] || 'administrative'
  if (!folder) {
    return log('red', `\n请输入要获取的文件夹目录  如:\nnode getHashList.js administrative\n`)
  } else if (!fs.existsSync(`./dist/${folder}/index.html`)) {
    return log('red', `\n文件夹：dist/${folder}不存在\n`)
  }

  log('green', `\nfolder=${folder}\n`)

  const branch = args[1] || (await command('git symbolic-ref --short HEAD'))

  log('green', `branch=${branch}\n`)

  const user = args[2] || (await command('git config user.name'))

  log('green', `user=${user}\n`)

  const COMMIT_SHA = await command('git rev-parse HEAD')

  log('green', `COMMIT_SHA=${COMMIT_SHA}\n`)

  fs.readFile(`./dist/${folder}/index.html`, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const reg =
      /(\/css\/chunk-vendors|\/css\/app)(\w|\.)*css|(\/js\/chunk-vendors|\/js\/app|\/js\/chunk-vendors-legacy|\/js\/app-legacy)(\w|\.)*js/gi
    const result = data.match(reg)
    console.log('regesult------', data, result)
    for (let i = 0; i < result.length; i++) {
      result[i] = result[i].split('.')[1]
    }
    const repairTime = 480
    const timeDifference = new Date().getTimezoneOffset()
    const date = new Date(Date.now() + (repairTime + timeDifference) * 60 * 1000)
    result.push(
      `[gitBranch=${branch}]-[gitUser=${user}]-[打包时间=${dateFormat(
        'YYYY-mm-dd HH:MM',
        date
      )}]-[COMMIT_SHA=${COMMIT_SHA}]`
    )
    fs.writeFile(`./dist/${folder}/${branch.replace(/\//g, '_')}.txt`, result.join(','), 'utf8', function (err) {
      if (err) return console.log(err)
      log('blue', result.toString() + '\n')
      log('green', '--------Hash generation succeeded------\n')
      log('green', '--------开始生成zip包------\n')
      pushZip(zip, `./dist/${folder}`)
      zip
        .generateAsync({
          type: 'nodebuffer',
          compression: 'DEFLATE',
          compressionOptions: {
            level: 9,
          },
        })
        .then(function (content) {
          fs.writeFile(`./dist/${folder}/${folder}-${branch.replace(/\//g, '_')}.zip`, content, (err) => {
            if (err) {
              log('red', '--------生成zip包失败------\n')
              throw err
            }
            log('green', '--------生成zip包成功------\n')
          })
        })
      function pushZip(floder, pPath) {
        const files = fs.readdirSync(pPath, { withFileTypes: true })
        files.forEach((dirent, index) => {
          let filePath = `${pPath}/${dirent.name}`
          if (dirent.isDirectory()) {
            let zipFloder = zip.folder(filePath.replace(`./dist/${folder}/`, ''))
            pushZip(zipFloder, filePath)
          } else {
            floder.file(dirent.name, fs.readFileSync(filePath))
          }
        })
      }
    })
  })
})()

function dateFormat(fmt, date) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
    }
  }
  return fmt
}

function command(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd).then((res) => {
      const { stdout, stderr } = res
      if (stdout) {
        log('cyan', 'command:' + cmd + '  result->' + stdout.replace(/\s+/g, '') + '\n')
        resolve(stdout.replace(/\s+/g, ''))
      }
      if (stderr) {
        console.log('command' + cmd + '  result:')
        console.log(stderr)
        reject(stderr)
      }
    })
  })
}

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
