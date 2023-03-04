import "./assets/css/ash.min.css";
import Alpine from 'alpinejs';
import MyImageWidget from './components/widget.js';
import './wasm_exec'
import g from "guark";

import wasmURL from "url:./assets/wasm/golib.wasm";

const go = new global.Go();

// register global stores
Alpine.store('images', {
    gifs: {
        keanu: new URL('assets/images/keanu.gif?as=webp&width=480',import.meta.url),
        morpheus: new URL('assets/images/morpheus.gif?as=webp&width=480',import.meta.url),
    },
})

Alpine.store('wasm', {
    go: {},
    setGoFunc(funcName, func) {
        this.go[funcName] =  func
    },
})

// init go functions
export const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) => {
    let response = undefined;
  
    // Check if the browser supports streaming instantiation
    if (WebAssembly.instantiateStreaming) {
      // Fetch the module, and instantiate it as it is downloading
      response = await WebAssembly.instantiateStreaming(
        fetch(wasmModuleUrl),
        importObject
      );
    } else {
      // Fallback to using fetch to download the entire module
      // And then instantiate the module
      const fetchAndInstantiateTask = async () => {
        const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response =>
          response.arrayBuffer()
        );
        return WebAssembly.instantiate(wasmArrayBuffer, importObject);
      };
  
      response = await fetchAndInstantiateTask();
    }
  
    return response;
};

const addWasmFunctions = async () => {
    // Get the importObject from the go instance.
    const importObject = go.importObject;

    // Instantiate our wasm module
    const wasmModule = await wasmBrowserInstantiate(wasmURL, importObject);

    // Allow the wasm_exec go instance, bootstrap and execute our wasm module
    go.run(wasmModule.instance);

    // Call the Add function export from wasm, save the result
    Alpine.store('wasm').setGoFunc("add", wasmModule.instance.exports.add)

    // Set the result onto the body
    console.log(wasmModule.instance.exports.add(1, 2))
    console.log(Alpine.store('wasm').go.add);
    console.log( Alpine.store('wasm').go.add(40, 2));
};
addWasmFunctions();


window.Alpine = Alpine;


 

// Register Components
document.addEventListener('alpine:init', () => {
    Alpine.data('image_widget', MyImageWidget);
})

Alpine.start();

// g.call("foo")
//     .then(res => console.log(res))
//     .catch(err => console.error(err))