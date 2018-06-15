SRC   = $(shell find src -name "*.js")
BUILD = $(SRC:src/%=build/%)

run: build
	node build/index.js
	
build: $(BUILD)
build/%.js: src/%.js .babelrc
	mkdir -p $(@D)
	babel $< -o $@
