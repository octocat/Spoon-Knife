<a name="4.8.0"></a>
# [4.8.0](https://github.com/reactstrap/reactstrap/compare/4.7.0...4.8.0) (2017-06-28)


### Features

* **DropdownItem:** support the "active" property for dropdown items ([#469](https://github.com/reactstrap/reactstrap/issues/469)) ([83df86e](https://github.com/reactstrap/reactstrap/commit/83df86e))



<a name="4.7.0"></a>
# [4.7.0](https://github.com/reactstrap/reactstrap/compare/4.6.2...4.7.0) (2017-06-27)


### Bug Fixes

* **Alert:** map close class css modules ([#471](https://github.com/reactstrap/reactstrap/issues/471)) ([2e3c687](https://github.com/reactstrap/reactstrap/commit/2e3c687)), closes [#470](https://github.com/reactstrap/reactstrap/issues/470)
* **DropdownToggle:** ensures color attribute is not leaked ([d1448e0](https://github.com/reactstrap/reactstrap/commit/d1448e0)), closes [#461](https://github.com/reactstrap/reactstrap/issues/461) [PR#402](https://github.com/PR/issues/402)
* **Label:** add form-control-label to appropriate Label components ([#452](https://github.com/reactstrap/reactstrap/issues/452)) ([2e86132](https://github.com/reactstrap/reactstrap/commit/2e86132))
* **Modal:** add back attribute passthrough ([#444](https://github.com/reactstrap/reactstrap/issues/444)) ([b598a40](https://github.com/reactstrap/reactstrap/commit/b598a40)), closes [#443](https://github.com/reactstrap/reactstrap/issues/443)
* **Navbar:** remove default navigation role ([f607b2c](https://github.com/reactstrap/reactstrap/commit/f607b2c)), closes [#463](https://github.com/reactstrap/reactstrap/issues/463)



<a name="4.6.2"></a>
## [4.6.2](https://github.com/reactstrap/reactstrap/compare/4.6.1...4.6.2) (2017-05-16)


### Bug Fixes

* **build:** replace process.env in builds ([#429](https://github.com/reactstrap/reactstrap/issues/429)) ([#435](https://github.com/reactstrap/reactstrap/issues/435)) ([fcc5264](https://github.com/reactstrap/reactstrap/commit/fcc5264))



<a name="4.6.1"></a>
## [4.6.1](https://github.com/reactstrap/reactstrap/compare/4.6.0...4.6.1) (2017-05-15)


### Bug Fixes

* **PropTypes:** clean up prop-types usage ([#427](https://github.com/reactstrap/reactstrap/issues/427)) ([94bbb82](https://github.com/reactstrap/reactstrap/commit/94bbb82))



<a name="4.6.0"></a>
# [4.6.0](https://github.com/reactstrap/reactstrap/compare/4.5.0...4.6.0) (2017-05-15)


### Bug Fixes

* **ButtonDropdown:** allow overwriting the group prop ([#425](https://github.com/reactstrap/reactstrap/issues/425)) ([663551b](https://github.com/reactstrap/reactstrap/commit/663551b))
* **DropdownToggle:** add missing proptype (color) ([#402](https://github.com/reactstrap/reactstrap/issues/402)) ([c137697](https://github.com/reactstrap/reactstrap/commit/c137697))
* **Modal:** fix bug where closing modal removed wrong modal-open string in class ([#410](https://github.com/reactstrap/reactstrap/issues/410)) ([22d5c3f](https://github.com/reactstrap/reactstrap/commit/22d5c3f))
* **PropTypes:** import PropTypes from prop-types ([#395](https://github.com/reactstrap/reactstrap/issues/395)) ([9080217](https://github.com/reactstrap/reactstrap/commit/9080217))
* **react-addons:** move to external react-transition-group dependency ([#399](https://github.com/reactstrap/reactstrap/issues/399)) ([a4fec3c](https://github.com/reactstrap/reactstrap/commit/a4fec3c))


### Features

* **Modal:** add autoFocus prop for disabling auto focus ([#389](https://github.com/reactstrap/reactstrap/issues/389)) ([6338fc3](https://github.com/reactstrap/reactstrap/commit/6338fc3))
* **Modal:** Support fade and timeout props in the Modal component to allow configuring + disabling of the fade effect ([#339](https://github.com/reactstrap/reactstrap/issues/339)) ([babee0f](https://github.com/reactstrap/reactstrap/commit/babee0f))



<a name="4.5.0"></a>
# [4.5.0](https://github.com/reactstrap/reactstrap/compare/4.4.0...v4.5.0) (2017-04-03)


### Bug Fixes

* **Button:** only default to button when click is handled ([#383](https://github.com/reactstrap/reactstrap/issues/383)) ([af3ccbe](https://github.com/reactstrap/reactstrap/commit/af3ccbe))
* **lib:** import/export not getting transpiled in lib dir ([#384](https://github.com/reactstrap/reactstrap/issues/384)) ([2e2a5da](https://github.com/reactstrap/reactstrap/commit/2e2a5da))



<a name="4.4.0"></a>
# [4.4.0](https://github.com/reactstrap/reactstrap/compare/4.3.0...v4.4.0) (2017-03-31)


### Bug Fixes

* **Col:** account for 0 col properties ([#378](https://github.com/reactstrap/reactstrap/issues/378)) ([fe48e9e](https://github.com/reactstrap/reactstrap/commit/fe48e9e))
* **DropDownItem:** when href use `a` tag ([#377](https://github.com/reactstrap/reactstrap/issues/377)) ([96616af](https://github.com/reactstrap/reactstrap/commit/96616af)), closes [#367](https://github.com/reactstrap/reactstrap/issues/367)
* **Modal:** pass in cssModule to Fade components ([#373](https://github.com/reactstrap/reactstrap/issues/373)) ([be34d19](https://github.com/reactstrap/reactstrap/commit/be34d19))


### Features

* **Button:** default type to button ([#376](https://github.com/reactstrap/reactstrap/issues/376)) ([ebbeba7](https://github.com/reactstrap/reactstrap/commit/ebbeba7))
* **DropdownItem:** Add toggle switch to allow conditional toggle ([#346](https://github.com/reactstrap/reactstrap/issues/346)) ([578a61b](https://github.com/reactstrap/reactstrap/commit/578a61b))
* **Tooltip:** enable target element option ([#356](https://github.com/reactstrap/reactstrap/issues/356)) ([2023036](https://github.com/reactstrap/reactstrap/commit/2023036))



<a name="4.3.0"></a>
# [4.3.0](https://github.com/reactstrap/reactstrap/compare/4.2.0...v4.3.0) (2017-03-14)


### Bug Fixes

* **Modal:** default zIndex to 1050 ([#343](https://github.com/reactstrap/reactstrap/issues/343)) ([8d0f4ec](https://github.com/reactstrap/reactstrap/commit/8d0f4ec)), closes [#342](https://github.com/reactstrap/reactstrap/issues/342)
* **Nav:** update props available ([#338](https://github.com/reactstrap/reactstrap/issues/338)) ([992e4e6](https://github.com/reactstrap/reactstrap/commit/992e4e6))



<a name="4.2.0"></a>
# [4.2.0](https://github.com/reactstrap/reactstrap/compare/4.1.1...v4.2.0) (2017-02-14)


### Bug Fixes

* **Modal:** unmounting nested modals ([#321](https://github.com/reactstrap/reactstrap/issues/321)) ([ecf51b2](https://github.com/reactstrap/reactstrap/commit/ecf51b2))
* **Progress:** add custom classNames to progress-bar ([#319](https://github.com/reactstrap/reactstrap/issues/319)) ([25fdb77](https://github.com/reactstrap/reactstrap/commit/25fdb77)), closes [#318](https://github.com/reactstrap/reactstrap/issues/318)


### Features

* **Modal:** add various className props to modal ([#320](https://github.com/reactstrap/reactstrap/issues/320)) ([c7b2b3e](https://github.com/reactstrap/reactstrap/commit/c7b2b3e)), closes [#257](https://github.com/reactstrap/reactstrap/issues/257)
* **Modal:** Make toggle prop optional ([#325](https://github.com/reactstrap/reactstrap/issues/325)) ([5e98ea3](https://github.com/reactstrap/reactstrap/commit/5e98ea3))



<a name="4.1.1"></a>
## [4.1.1](https://github.com/reactstrap/reactstrap/compare/4.1.0...v4.1.1) (2017-01-31)


### Bug Fixes

* make sure everything can have a Tag ([#315](https://github.com/reactstrap/reactstrap/issues/315)) ([3373a90](https://github.com/reactstrap/reactstrap/commit/3373a90)), closes [#314](https://github.com/reactstrap/reactstrap/issues/314)


### Features

* **CardDeck:** set flex as only option ([#316](https://github.com/reactstrap/reactstrap/issues/316)) ([feb9a70](https://github.com/reactstrap/reactstrap/commit/feb9a70))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/reactstrap/reactstrap/compare/4.0.1...v4.1.0) (2017-01-28)


### Features

* **Col:** add custom widths ability to Col ([#309](https://github.com/reactstrap/reactstrap/issues/309)) ([8487598](https://github.com/reactstrap/reactstrap/commit/8487598)), closes [#297](https://github.com/reactstrap/reactstrap/issues/297)
* **Collapse:** Add onOpened and onClosed events ([#277](https://github.com/reactstrap/reactstrap/issues/277)) ([#301](https://github.com/reactstrap/reactstrap/issues/301)) ([6c5621f](https://github.com/reactstrap/reactstrap/commit/6c5621f))
* **Uncontrolled:** add uncontrolled components ([#307](https://github.com/reactstrap/reactstrap/issues/307)) ([2f648c1](https://github.com/reactstrap/reactstrap/commit/2f648c1))



<a name="4.0.1"></a>
## [4.0.1](https://github.com/reactstrap/reactstrap/compare/4.0.0...v4.0.1) (2017-01-11)


### Bug Fixes

* **Navbar:** updated fixed class names ([481bc14](https://github.com/reactstrap/reactstrap/commit/481bc14))


### Features

* **Navbar:** support sticky prop on navbar ([d8a9727](https://github.com/reactstrap/reactstrap/commit/d8a9727))


<a name="4.0.0"></a>
# [4.0.0](https://github.com/reactstrap/reactstrap/compare/4.0.0-alpha.8...v4.0.0) (2017-01-11)


### Bug Fixes

* **Col:** support disabled width props ([#283](https://github.com/reactstrap/reactstrap/issues/283)) ([2a36601](https://github.com/reactstrap/reactstrap/commit/2a36601))
* **Collapse:** component height & navbar class ([#284](https://github.com/reactstrap/reactstrap/issues/284)) ([0237cd4](https://github.com/reactstrap/reactstrap/commit/0237cd4))
* **Modal:** Update ModalHeader close button ([#281](https://github.com/reactstrap/reactstrap/issues/281)) ([a9dc654](https://github.com/reactstrap/reactstrap/commit/a9dc654))
* **Navbar:** remove default toggleable class ([#285](https://github.com/reactstrap/reactstrap/issues/285)) ([19b32cd](https://github.com/reactstrap/reactstrap/commit/19b32cd))


### Features

* **Collapse:** add delay prop ([#287](https://github.com/reactstrap/reactstrap/issues/287)) ([2b69ad6](https://github.com/reactstrap/reactstrap/commit/2b69ad6))


### BREAKING CHANGES

* Navbar: - Navbar no longer applies a default `.navbar-toggleable` class, as it is not required for all Navbar configurations.


<a name="4.0.0-alpha.8"></a>
# [4.0.0-alpha.8](https://github.com/reactstrap/reactstrap/compare/3.9.5...v4.0.0-alpha.8) (2017-01-06)


### Features

* **cssModules:** adding missing classes ([#271](https://github.com/reactstrap/reactstrap/issues/271)) ([e8e818b](https://github.com/reactstrap/reactstrap/commit/e8e818b))
* **Progress:** enchance multiple progress bars ([#271](https://github.com/reactstrap/reactstrap/issues/274))

### BREAKING CHANGE:

Progress component now requires `multi` prop on the outer component for nested progress bars. Inner Progress components will require the `bar` prop for nested progress bars.

<a name="4.0.0-alpha.7"></a>
# [4.0.0-alpha.7](https://github.com/reactstrap/reactstrap/compare/4.0.0-alpha.6...v4.0.0-alpha.7) (2017-01-05)


### Features

* **Col:** update classes based on alpha.6 changes ([#267](https://github.com/reactstrap/reactstrap/issues/267)) ([89ff16c](https://github.com/reactstrap/reactstrap/commit/89ff16c))
* **Collapse:** add navbar prop ([#266](https://github.com/reactstrap/reactstrap/issues/266)) ([c1b633a](https://github.com/reactstrap/reactstrap/commit/c1b633a))
* **Nav:** update navbar prop class value ([#265](https://github.com/reactstrap/reactstrap/pull/265))([f979aae54a8662d151d6216dac45b9dc3541ca7e] (https://github.com/reactstrap/reactstrap/pull/265/commits/f979aae54a8662d151d6216dac45b9dc3541ca7e))
* **Navbar:** rename dark prop to inverse, add toggleable size prop ([#265](https://github.com/reactstrap/reactstrap/pull/265))([3ee55f19792bd803d937837f4599ff0ee88974fb] (https://github.com/reactstrap/reactstrap/pull/265/commits/3ee55f19792bd803d937837f4599ff0ee88974fb))


### BREAKING CHANGES

* Col: The default xs prop now returns `.col` instead of
`.col-xs-12`. The `auto` size value now returns `.col-auto` or
`.col-sm-auto` for variable width content columns. Use `true` or `''`
as the size value to return `.col` or `.col-sm` for auto layout of
columns (not to be confused with `auto`  -> (variable width of
content)).


<a name="4.0.0-alpha.6"></a>
# [4.0.0-alpha.6](https://github.com/reactstrap/reactstrap/compare/4.0.0-alpha.5...v4.0.0-alpha.6) (2017-01-03)


### Bug Fixes

* **className:** update "active" to "show" for stateful components ([#259](https://github.com/reactstrap/reactstrap/issues/259)) ([7df9a01](https://github.com/reactstrap/reactstrap/commit/7df9a01))


### Features

* **Progress:** update markup & support nested progress bars ([#261](https://github.com/reactstrap/reactstrap/issues/261)) ([0b19b41](https://github.com/reactstrap/reactstrap/commit/0b19b41))
* **Row:** add noGutters prop ([#260](https://github.com/reactstrap/reactstrap/issues/260)) ([c79bb3e](https://github.com/reactstrap/reactstrap/commit/c79bb3e))


<a name="4.0.0-alpha.5"></a>
# [4.0.0-alpha.5](https://github.com/reactstrap/reactstrap/compare/4.0.0-alpha.4...v4.0.0-alpha.5) (2016-12-18)


### Features

* **Modal:** Pass through props in Modal ([#254](https://github.com/reactstrap/reactstrap/issues/254)) ([c99e873](https://github.com/reactstrap/reactstrap/commit/c99e873))


<a name="3.9.5"></a>
## [3.9.5](https://github.com/reactstrap/reactstrap/compare/3.9.4...v3.9.5) (2016-12-18)


### Features

* **Modal:** Pass through props in Modal ([#254](https://github.com/reactstrap/reactstrap/issues/254)) ([a783308](https://github.com/reactstrap/reactstrap/commit/a783308))


<a name="4.0.0-alpha.4"></a>
# [4.0.0-alpha.4](https://github.com/reactstrap/reactstrap/compare/3.9.4...v4.0.0-alpha.4) (2016-12-15)

* **Modal:** clear timeouts when toggling of modal - [#166](https://github.com/reactstrap/reactstrap/issues/166) ([5e0f5d2](https://github.com/reactstrap/reactstrap/commit/5e0f5d2))


<a name="3.9.4"></a>
## [3.9.4](https://github.com/reactstrap/reactstrap/compare/3.9.3...v3.9.4) (2016-12-12)

### Bug Fixes

* **Modal:** clear timeouts when toggling of modal - [#166](https://github.com/reactstrap/reactstrap/issues/166) ([5e0f5d2](https://github.com/reactstrap/reactstrap/commit/5e0f5d2))

<a name="4.0.0-alpha.3"></a>
# [4.0.0-alpha.3](https://github.com/reactstrap/reactstrap/compare/4.0.0-alpha.2...v4.0.0-alpha.3) (2016-12-01)


<a name="4.0.0-alpha.2"></a>
# [4.0.0-alpha.2](https://github.com/reactstrap/reactstrap/compare/4.0.0-alpha.1...v4.0.0-alpha.2) (2016-11-28)


### Bug Fixes

* **className:** update "in" to "active" for stateful components ([#241](https://github.com/reactstrap/reactstrap/issues/241)) ([ea2439e](https://github.com/reactstrap/reactstrap/commit/ea2439e))


<a name="3.9.3"></a>
## [3.9.3](https://github.com/reactstrap/reactstrap/compare/3.9.2...v3.9.3) (2016-12-01)


### Features

* **ListGroup:** prevent onClick when disabled & add docs [#185](https://github.com/reactstrap/reactstrap/issues/185) ([#236](https://github.com/reactstrap/reactstrap/issues/236)) ([1301b11](https://github.com/reactstrap/reactstrap/commit/1301b11))


<a name="3.9.2"></a>
## [3.9.2](https://github.com/reactstrap/reactstrap/compare/3.9.1...v3.9.2) (2016-11-28)


### Bug Fixes

* **Popover:** remove old arrow markup, correct enabled className ([b9d3ea7](https://github.com/reactstrap/reactstrap/commit/b9d3ea7))
* **TetherContent:** Fixes className prop typo, removes arrow & position relative hack ([d9e7621](https://github.com/reactstrap/reactstrap/commit/d9e7621))
* **Tooltip:** remove old arrow markup, correct enabled className ([62d622b](https://github.com/reactstrap/reactstrap/commit/62d622b))


<a name="4.0.0-alpha.1"></a>
# [4.0.0-alpha.1](https://github.com/reactstrap/reactstrap/compare/4.0.0-alpha.0...v4.0.0-alpha.1) (2016-11-23)


### Features

* **Badge:** rename Tag component to Badge ([#230](https://github.com/reactstrap/reactstrap/issues/230)) ([dfc9943](https://github.com/reactstrap/reactstrap/commit/dfc9943))


<a name="4.0.0-alpha.0"></a>
# [4.0.0-alpha.0](https://github.com/reactstrap/reactstrap/compare/v4...v4.0.0-alpha.0) (2016-11-23)


<a name="3.9.1"></a>
## [3.9.1](https://github.com/reactstrap/reactstrap/compare/3.9.0...v3.9.1) (2016-11-23)


### Bug Fixes

* **modal:** fix multi-modal backdrop ([#227](https://github.com/reactstrap/reactstrap/issues/227)) ([9ddeb8a](https://github.com/reactstrap/reactstrap/commit/9ddeb8a)), closes [#222](https://github.com/reactstrap/reactstrap/issues/222)



<a name="3.9.0"></a>
# [3.9.0](https://github.com/reactstrap/reactstrap/compare/3.8.1...v3.9.0) (2016-11-13)


### Bug Fixes

* **DropdownToggle:** support non Button styles ([#221](https://github.com/reactstrap/reactstrap/issues/221)) ([cd3c1ce](https://github.com/reactstrap/reactstrap/commit/cd3c1ce))


### Features

* **ListGroup:** add ListGroupItem, ListGroupItemHeading, ListGroupItemText components ([#192](https://github.com/reactstrap/reactstrap/issues/192)) ([d09e81a](https://github.com/reactstrap/reactstrap/commit/d09e81a))



<a name="3.8.1"></a>
## [3.8.1](https://github.com/reactstrap/reactstrap/compare/3.8.0...v3.8.1) (2016-11-01)


### Features

* **refs:** add getRef to focusable components ([#218](https://github.com/reactstrap/reactstrap/issues/218)) ([cbfa0e0](https://github.com/reactstrap/reactstrap/commit/cbfa0e0))



<a name="3.8.0"></a>
# [3.8.0](https://github.com/reactstrap/reactstrap/compare/3.7.1...v3.8.0) (2016-11-01)


### Features

* **Collapse:** add Collapse component [#79](https://github.com/reactstrap/reactstrap/issues/79) ([#201](https://github.com/reactstrap/reactstrap/issues/201)) ([ddbf0dd](https://github.com/reactstrap/reactstrap/commit/ddbf0dd))



<a name="3.7.1"></a>
## [3.7.1](https://github.com/reactstrap/reactstrap/compare/3.7.0...v3.7.1) (2016-10-29)


### Bug Fixes

* **NavbarToggler:** remove unnecessary menu char ([#200](https://github.com/reactstrap/reactstrap/issues/200)) ([67544a3](https://github.com/reactstrap/reactstrap/commit/67544a3))



<a name="3.7.0"></a>
# [3.7.0](https://github.com/reactstrap/reactstrap/compare/3.6.0...v3.7.0) (2016-10-27)


### Bug Fixes

* **events:** add useCapture to events attached to document ([#202](https://github.com/reactstrap/reactstrap/issues/202)) ([18d7d04](https://github.com/reactstrap/reactstrap/commit/18d7d04))


### Features

* **cssModule:** add support for css module ([#206](https://github.com/reactstrap/reactstrap/issues/206)) ([3a69f14](https://github.com/reactstrap/reactstrap/commit/3a69f14)), closes [#205](https://github.com/reactstrap/reactstrap/issues/205)



<a name="3.6.0"></a>
# [3.6.0](https://github.com/reactstrap/reactstrap/compare/3.5.0...v3.6.0) (2016-10-23)


### Features

* **DropdownToggle:** add nav prop to enable Nav specific functionality ([#197](https://github.com/reactstrap/reactstrap/issues/197))([9b28cbc](https://github.com/reactstrap/reactstrap/commit/9b28cbc))



<a name="3.5.0"></a>
# [3.5.0](https://github.com/reactstrap/reactstrap/compare/3.4.1...v3.5.0) (2016-10-18)


### Bug Fixes

* **Tooltip:** fix when toggle is not provided ([#182](https://github.com/reactstrap/reactstrap/issues/182)) ([47239f3](https://github.com/reactstrap/reactstrap/commit/47239f3))


### Features

* **Col:** add flex-support to Col component ([#169](https://github.com/reactstrap/reactstrap/issues/169)) ([#175](https://github.com/reactstrap/reactstrap/issues/175)) ([ebdecb8](https://github.com/reactstrap/reactstrap/commit/ebdecb8))
* **Popover:** add `tetherRef` to Popover ([#183](https://github.com/reactstrap/reactstrap/issues/183)) ([00d08ad](https://github.com/reactstrap/reactstrap/commit/00d08ad))
* **TetherContent:** Add `tetherRef` to TetherContent  ([#181](https://github.com/reactstrap/reactstrap/issues/181)) ([6be1a67](https://github.com/reactstrap/reactstrap/commit/6be1a67)), closes [#174](https://github.com/reactstrap/reactstrap/issues/174)



<a name="3.4.1"></a>
## [3.4.1](https://github.com/reactstrap/reactstrap/compare/3.4.0...v3.4.1) (2016-10-16)


### Features

* **Input:** enable refs on Input components ([#178](https://github.com/reactstrap/reactstrap/issues/178)) ([ed9e584](https://github.com/reactstrap/reactstrap/commit/ed9e584))



<a name="3.4.0"></a>
# [3.4.0](https://github.com/reactstrap/reactstrap/compare/3.3.2...v3.4.0) (2016-10-06)


### Features

* **Alert:** Add Alert component ([#162](https://github.com/reactstrap/reactstrap/issues/162)) ([240e776](https://github.com/reactstrap/reactstrap/commit/240e776))



<a name="3.3.2"></a>
## [3.3.2](https://github.com/reactstrap/reactstrap/compare/3.3.1...v3.3.2) (2016-10-01)


### Bug Fixes

* **Modal:** Account for body padding when scrollbar is present ([#165](https://github.com/reactstrap/reactstrap/issues/165)) ([e159628](https://github.com/reactstrap/reactstrap/commit/e159628))



<a name="3.3.1"></a>
## [3.3.1](https://github.com/reactstrap/reactstrap/compare/3.3.0...v3.3.1) (2016-09-28)


### Bug Fixes

* **label:** add disabled class when form-check-inline and disabled ([#159](https://github.com/reactstrap/reactstrap/issues/159)) ([312b29e](https://github.com/reactstrap/reactstrap/commit/312b29e))



<a name="3.3.0"></a>
# [3.3.0](https://github.com/reactstrap/reactstrap/compare/3.2.2...v3.3.0) (2016-09-24)


### Features

* **Jumbotron:** add Jumbotron Component ([#151](https://github.com/reactstrap/reactstrap/issues/151)) ([20f9c03](https://github.com/reactstrap/reactstrap/commit/20f9c03)), closes [#73](https://github.com/reactstrap/reactstrap/issues/73)



<a name="3.2.2"></a>
## [3.2.2](https://github.com/reactstrap/reactstrap/compare/3.2.1...v3.2.2) (2016-09-19)

### Features

* **Tooltip:** add ability to disable autohide on tooltip content hover ([#149](https://github.com/reactstrap/reactstrap/issues/149)) ([68a0ed7](https://github.com/reactstrap/reactstrap/commit/68a0ed7))

<a name="3.2.1"></a>
## [3.2.1](https://github.com/reactstrap/reactstrap/compare/3.2.0...v3.2.1) (2016-09-18)


### Features

* **Tooltip:** add delay prop ([#143](https://github.com/reactstrap/reactstrap/issues/143)) ([b18fb74](https://github.com/reactstrap/reactstrap/commit/b18fb74)), closes [#115](https://github.com/reactstrap/reactstrap/issues/115)



<a name="3.2.0"></a>
# [3.2.0](https://github.com/reactstrap/reactstrap/compare/3.1.0...v3.2.0) (2016-09-14)


### Features

* **modal:** add backdrop and keyboard options ([#135](https://github.com/reactstrap/reactstrap/issues/135)) ([7bf5d0a](https://github.com/reactstrap/reactstrap/commit/7bf5d0a)), closes [#134](https://github.com/reactstrap/reactstrap/issues/134)
* **Modal:** allow for multiple modals ([#138](https://github.com/reactstrap/reactstrap/issues/138)) ([7ada8cf](https://github.com/reactstrap/reactstrap/commit/7ada8cf)), closes [#137](https://github.com/reactstrap/reactstrap/issues/137)



<a name="3.1.0"></a>
# [3.1.0](https://github.com/reactstrap/reactstrap/compare/3.0.1...v3.1.0) (2016-09-11)


### Features

* **Tabs:** add TabContent & TabPane components ([#131](https://github.com/reactstrap/reactstrap/issues/131)) ([2957ede](https://github.com/reactstrap/reactstrap/commit/2957ede))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/reactstrap/reactstrap/compare/3.0.0...v3.0.1) (2016-09-08)


### Bug Fixes

* **docs:** update deploy script ([8fd0761](https://github.com/reactstrap/reactstrap/commit/8fd0761))
* **modal:** fix event listener for modal ([#127](https://github.com/reactstrap/reactstrap/issues/127)) ([c778608](https://github.com/reactstrap/reactstrap/commit/c778608)), closes [#126](https://github.com/reactstrap/reactstrap/issues/126)
* **TetherContent:** rerender when other props change ([#128](https://github.com/reactstrap/reactstrap/issues/128)) ([25600d4](https://github.com/reactstrap/reactstrap/commit/25600d4)), closes [#125](https://github.com/reactstrap/reactstrap/issues/125)



<a name="3.0.0"></a>
# [3.0.0](https://github.com/reactstrap/reactstrap/compare/2.6.1...v3.0.0) (2016-09-06)


### Code Refactoring

* **Button,DropdownToggle:** default to secondary style, remove cloning ([#120](https://github.com/reactstrap/reactstrap/issues/120)) ([5c56749](https://github.com/reactstrap/reactstrap/commit/5c56749)), closes [#98](https://github.com/reactstrap/reactstrap/issues/98)


### BREAKING CHANGES

* Button,DropdownToggle: DropdownToggle no longer clones each element in props.children when it’s an array, instead it renders props.children inside a single component (Butt
* Button,DropdownToggle: Button color now defaults to “secondary”. This behavior aligns with DropdownToggle color default.



<a name="2.6.1"></a>
## [2.6.1](https://github.com/reactstrap/reactstrap/compare/2.6.0...v2.6.1) (2016-09-01)


### Features

* **ModalClassName:** Adds custom class name for modal-dialogs for namespacing ([#111](https://github.com/reactstrap/reactstrap/issues/111)) ([5f7cab6](https://github.com/reactstrap/reactstrap/commit/5f7cab6))



<a name="2.6.0"></a>
# [2.6.0](https://github.com/reactstrap/reactstrap/compare/2.5.0...v2.6.0) (2016-08-21)


### Features

* **Pagination:** add Pagination component ([#108](https://github.com/reactstrap/reactstrap/issues/108)) ([fdc5c45](https://github.com/reactstrap/reactstrap/commit/fdc5c45))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/reactstrap/reactstrap/compare/2.4.0...v2.5.0) (2016-08-19)


### Bug Fixes

* **Modal:** set focus state before showing ([#104](https://github.com/reactstrap/reactstrap/issues/104)) ([a358233](https://github.com/reactstrap/reactstrap/commit/a358233))
* **Modal:** use togglePortal on componentDidMount ([#106](https://github.com/reactstrap/reactstrap/issues/106)) ([942b24a](https://github.com/reactstrap/reactstrap/commit/942b24a))


### Features

* **Progress:** add Progress component ([#105](https://github.com/reactstrap/reactstrap/issues/105)) ([bc185d8](https://github.com/reactstrap/reactstrap/commit/bc185d8)), closes [#78](https://github.com/reactstrap/reactstrap/issues/78)



<a name="2.4.0"></a>
# [2.4.0](https://github.com/reactstrap/reactstrap/compare/2.3.0...v2.4.0) (2016-08-18)


### Features

* **Media:** add Media component ([#94](https://github.com/reactstrap/reactstrap/issues/94)) ([d4c0f2d](https://github.com/reactstrap/reactstrap/commit/d4c0f2d))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/reactstrap/reactstrap/compare/2.2.0...v2.3.0) (2016-08-18)


### Features

* **inputGroup:** add InputGroup components ([#99](https://github.com/reactstrap/reactstrap/issues/99)) ([18a2ef7](https://github.com/reactstrap/reactstrap/commit/18a2ef7)), closes [#74](https://github.com/reactstrap/reactstrap/issues/74)



<a name="2.2.0"></a>
# [2.2.0](https://github.com/reactstrap/reactstrap/compare/2.1.0...v2.2.0) (2016-08-13)


### Features

* **Card:** update img position classes ([#91](https://github.com/reactstrap/reactstrap/issues/91)) ([920e2f8](https://github.com/reactstrap/reactstrap/commit/920e2f8))
* **Dropdown:** add size prop ([#90](https://github.com/reactstrap/reactstrap/issues/90)) ([92c62b1](https://github.com/reactstrap/reactstrap/commit/92c62b1))
* **Dropdowns:** use split class for split dropdowns ([#92](https://github.com/reactstrap/reactstrap/issues/92)) ([ee17a47](https://github.com/reactstrap/reactstrap/commit/ee17a47))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/reactstrap/reactstrap/compare/2.0.0...v2.1.0) (2016-08-06)


### Features

* **breadcrumb:** Add Breadcrumb and BreadcrumbItem ([d34d738](https://github.com/reactstrap/reactstrap/commit/d34d738))
* **form:** add forms and form element components ([#67](https://github.com/reactstrap/reactstrap/issues/67)) ([7c32483](https://github.com/reactstrap/reactstrap/commit/7c32483))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/reactstrap/reactstrap/compare/1.6.1...v2.0.0) (2016-07-28)


### Features

* **bootstrap:** update for v4 alpha 3 ([f617dc5](https://github.com/reactstrap/reactstrap/commit/f617dc5))
* **Col:** Update Col component with alpha 3 changes ([b62ee01](https://github.com/reactstrap/reactstrap/commit/b62ee01))
* **outline:** Make outline a separate prop for Card & Button ([#62](https://github.com/reactstrap/reactstrap/issues/62)) ([c65e952](https://github.com/reactstrap/reactstrap/commit/c65e952))


### BREAKING CHANGES

* bootstrap: Components were updated for v4 alpha 3

 - Button outline class change from `.{variant}-outline` to `.outline-{variant}`.
 - label is now tag and all of the label variants are now tag variants.
 - Cards now have an outline variant.



<a name="1.6.1"></a>
## [1.6.1](https://github.com/reactstrap/reactstrap/compare/1.6.0...v1.6.1) (2016-07-16)



<a name="1.6.0"></a>
# [1.6.0](https://github.com/reactstrap/reactstrap/compare/1.5.0...v1.6.0) (2016-07-11)



<a name="1.5.0"></a>
# [1.5.0](https://github.com/reactstrap/reactstrap/compare/1.4.0...v1.5.0) (2016-06-26)


### Bug Fixes

* **docs:** make buttons display block on xs views ([#46](https://github.com/reactstrap/reactstrap/issues/46))([fd14292](https://github.com/reactstrap/reactstrap/commit/fd14292))


### Features

* **Tables:** Add Table component ([#47](https://github.com/reactstrap/reactstrap/issues/47))([c935487](https://github.com/reactstrap/reactstrap/commit/c935487))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/reactstrap/reactstrap/compare/1.3.4...v1.4.0) (2016-06-26)


### Features

* **Card:** add Card related components ([#44](https://github.com/reactstrap/reactstrap/issues/44))([b782807](https://github.com/reactstrap/reactstrap/commit/b782807))



<a name="1.3.4"></a>
## [1.3.4](https://github.com/reactstrap/reactstrap/compare/1.3.3...v1.3.4) (2016-06-12)


### Bug Fixes

* **Modal:** handle prop updates ([#35](https://github.com/reactstrap/reactstrap/issues/35)) ([#40](https://github.com/reactstrap/reactstrap/issues/40))([23a3561](https://github.com/reactstrap/reactstrap/commit/23a3561))



<a name="1.3.3"></a>
## [1.3.3](https://github.com/reactstrap/reactstrap/compare/1.3.2...v1.3.3) (2016-06-12)



<a name="1.3.2"></a>
## [1.3.2](https://github.com/reactstrap/reactstrap/compare/1.3.1...v1.3.2) (2016-06-12)



<a name="1.3.1"></a>
## [1.3.1](https://github.com/reactstrap/reactstrap/compare/1.3.0...v1.3.1) (2016-04-24)




<a name="1.3.0"></a>
# [1.3.0](https://github.com/reactstrap/reactstrap/compare/1.2.4...v1.3.0) (2016-03-31)


### Bug Fixes

* **.gitignore:** add root directories to ignore ([8952445](https://github.com/reactstrap/reactstrap/commit/8952445))



<a name="1.2.4"></a>
## [1.2.4](https://github.com/reactstrap/reactstrap/compare/1.2.3...v1.2.4) (2016-03-28)


### Bug Fixes

* **src:** update paths to src ([c61c466](https://github.com/reactstrap/reactstrap/commit/c61c466))



<a name="1.2.3"></a>
## [1.2.3](https://github.com/reactstrap/reactstrap/compare/1.2.2...v1.2.3) (2016-03-28)


### Bug Fixes

* **build:** update scripts ([051e805](https://github.com/reactstrap/reactstrap/commit/051e805))



<a name="1.2.2"></a>
## [1.2.2](https://github.com/reactstrap/reactstrap/compare/1.2.1...v1.2.2) (2016-03-28)


### Bug Fixes

* **src:** update path to src ([5e0caa6](https://github.com/reactstrap/reactstrap/commit/5e0caa6))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/reactstrap/reactstrap/compare/1.2.0...v1.2.1) (2016-03-28)




<a name="1.2.0"></a>
# [1.2.0](https://github.com/reactstrap/reactstrap/compare/1.1.0...v1.2.0) (2016-03-28)


### Features

* **Navbar:** add Navbar components ([91ad2b4](https://github.com/reactstrap/reactstrap/commit/91ad2b4))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/reactstrap/reactstrap/compare/1.0.0...v1.1.0) (2016-03-27)


### Features

* **Navs:** Add nav components ([5e2ba03](https://github.com/reactstrap/reactstrap/commit/5e2ba03))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/reactstrap/reactstrap/compare/0.8.0...v1.0.0) (2016-03-27)


### Code Refactoring

* **components:** standardize custom tag names ([494e4ec](https://github.com/reactstrap/reactstrap/commit/494e4ec))


### BREAKING CHANGES

* components: `El` prop is now `tag`. This standardizes the way
custom elements should render their html “tags”.



<a name="0.8.0"></a>
# [0.8.0](https://github.com/reactstrap/reactstrap/compare/0.7.2...v0.8.0) (2016-03-27)


### Features

* **Layout:** Add Container, Row, Col components ([69ada73](https://github.com/reactstrap/reactstrap/commit/69ada73))



<a name="0.7.2"></a>
## [0.7.2](https://github.com/reactstrap/reactstrap/compare/0.7.1...v0.7.2) (2016-03-26)




<a name="0.7.1"></a>
## [0.7.1](https://github.com/reactstrap/reactstrap/compare/0.7.0...v0.7.1) (2016-03-26)




<a name="0.7.0"></a>
# [0.7.0](https://github.com/reactstrap/reactstrap/compare/0.6.1...v0.7.0) (2016-03-26)


### Features

* **Button:** render anchor tag if href prop exists ([61f4a11](https://github.com/reactstrap/reactstrap/commit/61f4a11))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/reactstrap/reactstrap/compare/0.6.0...v0.6.1) (2016-03-26)




<a name="0.6.0"></a>
# [0.6.0](https://github.com/reactstrap/reactstrap/compare/0.5.7...v0.6.0) (2016-03-26)


### Features

* **package:** add bootstrap@4.0.0-alpha.2 and css loaders ([046079b](https://github.com/reactstrap/reactstrap/commit/046079b))



<a name="0.5.7"></a>
## [0.5.7](https://github.com/reactstrap/reactstrap/compare/0.5.6...v0.5.7) (2016-03-25)


### Bug Fixes

* **ButtonGroup:** remove btn-group when vertical ([9b70e37](https://github.com/reactstrap/reactstrap/commit/9b70e37))
* **docs:** add and use reactstrap alias ([fcfe88d](https://github.com/reactstrap/reactstrap/commit/fcfe88d))



<a name="0.5.6"></a>
## [0.5.6](https://github.com/reactstrap/reactstrap/compare/0.5.5...v0.5.6) (2016-03-24)




<a name="0.5.5"></a>
## [0.5.5](https://github.com/reactstrap/reactstrap/compare/0.5.4...v0.5.5) (2016-03-24)


### Bug Fixes

* **ModalHeader:** update close character ([7128e78](https://github.com/reactstrap/reactstrap/commit/7128e78))



<a name="0.5.4"></a>
## [0.5.4](https://github.com/reactstrap/reactstrap/compare/0.5.3...v0.5.4) (2016-03-20)




<a name="0.5.3"></a>
## [0.5.3](https://github.com/reactstrap/reactstrap/compare/0.5.2...v0.5.3) (2016-03-14)




<a name="0.5.2"></a>
## [0.5.2](https://github.com/reactstrap/reactstrap/compare/0.5.1...v0.5.2) (2016-03-14)


### Bug Fixes

* **examples:** remove .min from example script ([b051dc1](https://github.com/reactstrap/reactstrap/commit/b051dc1))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/reactstrap/reactstrap/compare/0.5.0...0.5.1) (2016-03-13)




<a name="0.5.0"></a>
# [0.5.0](https://github.com/reactstrap/reactstrap/compare/0.4.0...0.5.0) (2016-03-13)


### Bug Fixes

* **tests:** make them faster & fix dropdown ([5dadc6f](https://github.com/reactstrap/reactstrap/commit/5dadc6f))

### Features

* **Fade:** enable fading components ([a84df68](https://github.com/reactstrap/reactstrap/commit/a84df68))
* **Label:** add component ([28d3edf](https://github.com/reactstrap/reactstrap/commit/28d3edf))
* **Layout:** add PopoverExample ([8200ee2](https://github.com/reactstrap/reactstrap/commit/8200ee2))
* **Layout:** include LabelsExample in Layout ([df1baa4](https://github.com/reactstrap/reactstrap/commit/df1baa4))
* **lib:** export Label component ([2856cd0](https://github.com/reactstrap/reactstrap/commit/2856cd0))
* **Modal:** add modal components ([6c2293e](https://github.com/reactstrap/reactstrap/commit/6c2293e))
* **Popover:** add component ([bc66aec](https://github.com/reactstrap/reactstrap/commit/bc66aec))
* **PopoverContent:** add component ([7282225](https://github.com/reactstrap/reactstrap/commit/7282225))
* **PopoverTitle:** add component ([bdf6623](https://github.com/reactstrap/reactstrap/commit/bdf6623))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/reactstrap/reactstrap/compare/0.3.0...0.4.0) (2016-02-29)


### Features

* **Tooltips:** add component and utils ([0ddbed5](https://github.com/reactstrap/reactstrap/commit/0ddbed5))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/reactstrap/reactstrap/compare/0.2.0...0.3.0) (2016-02-28)


### Bug Fixes

* **Button:** add disabled class ([96627ef](https://github.com/reactstrap/reactstrap/commit/96627ef))

### Features

* **Dropdowns:** add TetherContent support ([16c0f86](https://github.com/reactstrap/reactstrap/commit/16c0f86))
* **Dropdowns:** pass more methods to children ([87596e4](https://github.com/reactstrap/reactstrap/commit/87596e4))
* **TetherContent:** support Tethering Content to Targets ([573d47e](https://github.com/reactstrap/reactstrap/commit/573d47e))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/reactstrap/reactstrap/compare/065e978...0.2.0) (2016-02-21)


### Bug Fixes

* **package.json:** add missing dev-dep babel-polyfill ([065e978](https://github.com/reactstrap/reactstrap/commit/065e978))

### Features

* **ButtonDropdown:** wrap Dropdown for ButtonDropdown ([a2ea178](https://github.com/reactstrap/reactstrap/commit/a2ea178))
* **ButtonGroup:** Add button group and toolbar ([123b435](https://github.com/reactstrap/reactstrap/commit/123b435))
* **buttons:** update examples & tests ([52fd2fb](https://github.com/reactstrap/reactstrap/commit/52fd2fb))
* **Buttons:** support block level buttons ([f9cf8db](https://github.com/reactstrap/reactstrap/commit/f9cf8db))
* **Dropdowns:** add examples ([3d48e8c](https://github.com/reactstrap/reactstrap/commit/3d48e8c))
* **Dropdowns:** basic dropdown, toggle, menu & menu items ([750aaf9](https://github.com/reactstrap/reactstrap/commit/750aaf9))

