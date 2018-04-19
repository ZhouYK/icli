#!/usr/bin/env node
'use strict'
const cp = require('child_process')
process.stdin.setEncoding('utf8')
const infoText = ['请输入姓名：', '请输入年龄：', '请输入性别：']
const infoArr = []
let index = 0
let nextText = infoText[index]
const confirm = (info) => {
  return `请确认您的信息：${info.join(' ')}，y/n？`
}
process.stdout.write(nextText)
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (index > infoText.length - 1) {
    nextText = confirm(infoArr)
  }
  if (chunk !== null) {
    const temp = chunk.substring(0, chunk.length - 1)
    if (!temp) return process.stdout.write(nextText)
    if (index > infoText.length - 1) {
      nextText = confirm(infoArr)
      if (temp === 'y') {
        return process.stdin.push(null)
      }
    } else {
      infoArr[index] = temp
      index = index + 1
      if (index > infoText.length - 1) {
        nextText = confirm(infoArr)
      } else {
        nextText = infoText[index]
      }
    }
    process.stdout.write(`${nextText}`);
  }
})

process.stdin.on('end', () => {
  'use strict'
  console.log(`正在拉取代码仓库...`)
  cp.execSync(`git clone --verbose --progress https://github.com/monkeyInShell/react-redux-iapp.git`)
})
