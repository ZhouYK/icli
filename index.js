#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');

const version = '0.0.1';

const deleteFolder = (filePath) => {
  if (fs.existsSync(filePath)) {
    const files = fs.readdirSync(filePath);
    files.forEach(file => {
      const nextFolderPath = path.resolve(filePath, `./${file}`);
      const state = fs.statSync(nextFolderPath);
      if (state.isDirectory()) {
        deleteFolder(nextFolderPath)
      } else {
        fs.unlinkSync(nextFolderPath);
      }
    });
    fs.rmdirSync(filePath);
  }
};
const scaffoldGitRepo = {
  npm: 'git@github.com:ZhouYK/npm-scaffold.git',
  'page-javascript': 'git@github.com:ZhouYK/javascript-web-framework.git',
  'page-typescript': 'git@github.com:ZhouYK/typescript-web-framework.git',
  node: ''
}

program
  .version(version, '-v, --version')
  .option('-l, --scaffold-list', 'show scaffold list')
  .option('-s, --select-scaffold', 'show scaffold select list')
  .parse(process.argv);

if (program.scaffoldList) {
  const text = `Scaffold：
  1, npm
  2, page(js)
  3, page(ts)
  4, node(TODO)
  `;
  console.log(text)
} else if (program.selectScaffold) {
  inquirer.prompt([{
    type: 'list',
    name: 'scaffold',
    message: 'scaffold list:',
    choices: [{
      name: 'npm',
      value: 'npm',
      short: 'npm',
    }, {
      name: 'page(js)',
      value: 'page-javascript',
      short: 'page-javascript',
    }, {
      name: 'page(ts)',
      value: 'page-typescript',
      short: 'page-javascript',
    }, {
      name: 'node',
      value: 'node',
      short: 'node',
    }]
  }]).then(choice => {
    // Use user feedback for... whatever!!
    inquirer.prompt({
      type: 'input',
      name: 'folder',
      message: 'folder name:'
    }).then(answer => {
      const p = path.resolve(process.cwd(), `./${answer.folder}`);
      const flag = fs.existsSync(p);
      if (!flag) {
        fs.mkdirSync(p);
        console.log('Digging...');
        cp.execSync(`git clone ${scaffoldGitRepo[choice.scaffold]} ${answer.folder}`);
        const gitPath = path.resolve(p, './.git');
        deleteFolder(gitPath);
        console.log('Done! Enjoy your work!');
      } else {
        console.warn(`folder：${answer.folder} already exists`);
      }
    })
  });
};
