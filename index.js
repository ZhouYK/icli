#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const chalk = require('chalk');

const version = require('./package').version;
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
  'page-javascript': 'https://github.com/ZhouYK/javascript-web-framework.git',
  'page-typescript': 'https://github.com/ZhouYK/typescript-web-framework.git',
}

program
  .version(version, '-v, --version')
  .usage('[options]')
  .option('-l, --scaffold-list', 'show scaffold list')
  .option('-s, --select-scaffold', 'show scaffold select list')
  .parse(process.argv);

if (program.scaffoldList) {
  const text = `Scaffold：
  1, page(js)
  2, page(ts)
  `;
  console.log(text)
} else if (program.selectScaffold) {
  inquirer.prompt([{
    type: 'list',
    name: 'scaffold',
    message: 'scaffold list:',
    choices: [{
      name: 'page(js)',
      value: 'page-javascript',
      short: 'page-javascript',
    }, {
      name: 'page(ts)',
      value: 'page-typescript',
      short: 'page-javascript',
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
        console.log(chalk.green('Digging...'));
        cp.execSync(`git clone ${scaffoldGitRepo[choice.scaffold]} ${answer.folder}`, {
          stdio: 'inherit'
        });
        const gitPath = path.resolve(p, './.git');
        deleteFolder(gitPath);
        console.log(chalk.green('Done! Enjoy your work!'));
      } else {
        console.log(chalk.red(`folder：${answer.folder} already exists`));
      }
    })
  });
} else {
  program.outputHelp();
}
