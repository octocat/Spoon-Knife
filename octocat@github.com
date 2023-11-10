@mmu094
Code
Issues
9
More
 hello-world-npm 1.0.2 Latest
A simple npm package to demonstrate GitHub Package Registry

 Install from the command line:
Learn more about npm packages
$ npm install @codertocat/hello-world-npm@1.0.2
 Install via package.json:
"@mmu94/hello-world-npm": "1.0.2"
Recent Versions
1.0.2
Latest
Published over 4 years ago
 350
1.0.1
Published over 4 years ago
 75
1.0.0
Published over 4 years ago
 141
View all versions
README.md
hello-world-npm
This is a simple npm package that demonstrates the GitHub Package Registry.

Installation
Before installing, make sure to authenticate with GitHub Package Registry or using a .npmrc file. See "Configuring npm for use with GitHub Package Registry."

$ npm install @codertocat/hello-world-npm

Or add this package to your package.json file:

"dependencies": {
    "@codertocat/hello-world-npm": "1.0.0"
  }
Usage
const myPackage = require('@codertocat/hello-world-npm');
myPackage.helloWorld();
Details
@Codertocat
Codertocat
hello-world-npm
Readme
Last published
over 4 years ago
Issues
9
Total downloads
566
Contributors
2
@rachmari
rachmari Rachael Sewell
@Codertocat
Codertocat Codertocat

Footer
© 2023 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
rizqshops@googlegroups.com
