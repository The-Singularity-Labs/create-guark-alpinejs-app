
all: run

dev:
	guark run

build: build-linux build-windows build-osx

build-linux:
	guark build  --target linux --rm

build-windows:
	guark build  --target windows --rm

build-osx:
	guark build  --target darwin --rm