# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.18.2"></a>
## [0.18.2](https://github.com/webpack/style-loader/compare/v0.18.1...v0.18.2) (2017-06-05)


### Bug Fixes

* **url:** use `loaderUtils.stringifyRequest` to avoid invalidating hashes due to absolute paths ([#242](https://github.com/webpack/style-loader/issues/242)) ([97508ec](https://github.com/webpack/style-loader/commit/97508ec))
* Add `null` check to `removeStyleElement` ([#245](https://github.com/webpack/style-loader/issues/245)) ([0a4845c](https://github.com/webpack/style-loader/commit/0a4845c))



<a name="0.18.1"></a>
## [0.18.1](https://github.com/webpack/style-loader/compare/v0.18.0...v0.18.1) (2017-05-23)


### Bug Fixes

* **addStyles:** revert merged loops ([#236](https://github.com/webpack/style-loader/issues/236)) ([fbd04b1](https://github.com/webpack/style-loader/commit/fbd04b1))



<a name="0.18.0"></a>
# [0.18.0](https://github.com/webpack/style-loader/compare/v0.17.0...v0.18.0) (2017-05-22)


### Bug Fixes

* stringify the options.transform request ([#230](https://github.com/webpack/style-loader/issues/230)) ([5888095](https://github.com/webpack/style-loader/commit/5888095))


### Features

* add options validation ([#224](https://github.com/webpack/style-loader/issues/224)) ([4b6b70d](https://github.com/webpack/style-loader/commit/4b6b70d))



<a name="0.17.0"></a>
# [0.17.0](https://github.com/webpack/style-loader/compare/v0.16.1...v0.17.0) (2017-05-01)


### Features

* add option.base ([#164](https://github.com/webpack/style-loader/issues/164)) ([e4ac886](https://github.com/webpack/style-loader/commit/e4ac886))
* add option.transform ([#146](https://github.com/webpack/style-loader/issues/146)) ([1c3943f](https://github.com/webpack/style-loader/commit/1c3943f))



<a name="0.16.1"></a>
## [0.16.1](https://github.com/webpack/style-loader/compare/v0.16.0...v0.16.1) (2017-03-28)


### Bug Fixes

* negative refs ([#122](https://github.com/webpack/style-loader/issues/122)) ([f6f577a](https://github.com/webpack/style-loader/commit/f6f577a))



<a name="0.16.0"></a>
# [0.16.0](https://github.com/webpack/style-loader/compare/v0.15.0...v0.16.0) (2017-03-22)


### Bug Fixes

* **addStyles:** update for test for old IE versions ([#196](https://github.com/webpack/style-loader/issues/196)) ([1f68495](https://github.com/webpack/style-loader/commit/1f68495))


### Features

* Set custom attributes for tag in url mode ([#198](https://github.com/webpack/style-loader/issues/198)) ([2c4f427](https://github.com/webpack/style-loader/commit/2c4f427))



<a name="0.15.0"></a>
# [0.15.0](https://github.com/webpack/style-loader/compare/v0.14.1...v0.15.0) (2017-03-21)


### Bug Fixes

* match parens recursively on URLs to not fix embeded calls ([#192](https://github.com/webpack/style-loader/issues/192)) ([71e0908](https://github.com/webpack/style-loader/commit/71e0908))


### Features

* add insertInto option ([#135](https://github.com/webpack/style-loader/issues/135)) ([6636868](https://github.com/webpack/style-loader/commit/6636868))



<a name="0.14.1"></a>
## [0.14.1](https://github.com/webpack/style-loader/compare/v0.14.0...v0.14.1) (2017-03-15)


### Bug Fixes

* syntax error in IE10 and below because of `const` keyword ([#190](https://github.com/webpack/style-loader/issues/190)) ([01080cf](https://github.com/webpack/style-loader/commit/01080cf))



<a name="0.14.0"></a>
# [0.14.0](https://github.com/webpack/style-loader/compare/v0.13.1...v0.14.0) (2017-03-15)


### Bug Fixes

* Adds type attr. to the generated link element ([2a2f261](https://github.com/webpack/style-loader/commit/2a2f261))
* **fixUrls:** add param to fix relative urls ([#186](https://github.com/webpack/style-loader/issues/186)) ([19959ee](https://github.com/webpack/style-loader/commit/19959ee))
* **usable:** Export locals if available([#128](https://github.com/webpack/style-loader/issues/128)) ([e280cb6](https://github.com/webpack/style-loader/commit/e280cb6))


### Features

* **tag-attribute:** Add support for custom tag attribute ([995f3de](https://github.com/webpack/style-loader/commit/995f3de))
