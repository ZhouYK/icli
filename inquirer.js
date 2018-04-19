/**
 * Created by ink on 2018/4/19.
 */
var inquirer = require('inquirer');
inquirer.prompt([{
  type: 'list',
  name: '你好，周杰伦',
  message: '我想去你的演唱会',
  choices: ['hello', 'get off']
}, {
  type: 'list',
  name: '你好，张靓颖',
  message: 'I love my city',
  choices: ['成都', '西安']
}]).then(answers => {
  // Use user feedback for... whatever!!
  console.log(answers)
});