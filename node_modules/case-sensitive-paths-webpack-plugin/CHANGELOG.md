# Changelog

## 2017-5-30: 
### 2.1.1

* Properly support older versions of node. Tested in:
    * 4.8.3
    * 5.11.1
    * 6.10.3

### 2.1.0

* No longer will intercept what should be a standard Webpack "File not found" error.
    * This also resolves the issue where the plugin wouldn't recognize when a file was added.
* Hardened tests.
* Cleaned up code and added an 'engines' config to package.json

## 2017-3-31: 
### 2.0.0

* Use the compiler filesystem, which helps when other plugins change the 'fs' object being used by the compiler.
