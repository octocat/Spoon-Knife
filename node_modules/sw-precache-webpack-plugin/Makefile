BUILD_CMD := ./node_modules/.bin/babel ./src -d ./lib --ignore 'test' --presets latest,stage-0
TEST_CMD := ./node_modules/.bin/ava test/plugin.spec.js

build_es6:
	@$(BUILD_CMD)

ci:
	@$(BUILD_CMD) --watch

clean:
	@rm -rf ./lib
	@rm -rf ./test/tmp

build: clean build_es6

lint:
	@node_modules/.bin/eslint src

unit_test: build
	@$(TEST_CMD)

integration_test: build
	@cd examples && npm install && npm t && npm run webpack

test: lint build unit_test integration_test

major:
	npm version major

minor:
	npm version minor

patch:
	npm version patch

changelog.template.ejs:
	@echo "## x.x.x\n\n<% commits.forEach(function(commit) { -%>\n* <%= commit.title %>\n<% }) -%>" > changelog.template.ejs

changelog: changelog.template.ejs
	@touch CHANGELOG.md
	@git-release-notes $$(git describe --abbrev=0)..HEAD $< | cat - CHANGELOG.md >> CHANGELOG.md.new
	@mv CHANGELOG.md{.new,}
	@rm changelog.template.ejs
	@echo "Added changes since $$(git describe --abbrev=0) to CHANGELOG.md"

.PHONY: clean dev lint examples test major minor patch
