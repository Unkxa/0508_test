const scanner = require('sonarqube-scanner')
const exec = require('util').promisify(require('child_process').exec)
;(async function () {
  const ignoreRules = [
    'css:S4667',
    'css:S4649',
    'typescript:S1186',
    'typescript:S107',
    'typescript:S125',
    'Web:S5256',
    'Web:AvoidCommentedOutCodeCheck',
    'Web:BoldAndItalicTagsCheck', // i标签 需要替换成 em 标签
    'Web:ImgWithoutAltCheck', // img 标签需要alt 属性
    'Web:TableHeaderHasIdOrScopeCheck', //"<th>" tags should have "id" or "scope" attributes
  ]
  const ignoreRulesOptions = {}
  const multicriteria = []
  for (let i = 0; i < ignoreRules.length; i++) {
    ignoreRulesOptions['sonar.issue.ignore.multicriteria.rules' + i + '.ruleKey'] = ignoreRules[i]
    ignoreRulesOptions['sonar.issue.ignore.multicriteria.rules' + i + '.resourceKey'] = '**/*'
    multicriteria.push('rules' + i)
  }
  ignoreRulesOptions['sonar.issue.ignore.multicriteria'] = multicriteria.join(',')
  const branch = await command('git symbolic-ref --short HEAD')
  scanner(
    {
      serverUrl: 'http://hzent.amberdata.cn:9900',
      token: '20830b12921d11e019d12edc2eb94876b5fb667d',
      options: {
        'sonar.projectName': 'administrative',
        'sonar.projectKey': 'administrative',
        'sonar.projectVersion': branch,
        'sonar.sources': './src',
        'sonar.exclusions': '**/src/assets/**',
        'sonar.host.url': 'http://hzent.amberdata.cn:9900',
        'sonar.login': '20830b12921d11e019d12edc2eb94876b5fb667d',
        'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
        'sonar.sourceEncoding': 'UTF-8',
        'sonar.branch.name': branch,
        ...ignoreRulesOptions,
      },
    },
    () => process.exit()
  )
})()
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
