import "./assets/css/ash.min.css";
import Alpine from 'alpinejs';
import MyPillComponent from './components/pill.js';
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

// Function declaration
function hello_world() {
    g.call("hello_world")
    .then(res => console.log(res))
    .catch(err => console.log(err))
}

Alpine.store('global_funcs', {
    go: {},
    setGoFunc(funcName, func) {
        this.go[funcName] =  func
    },
    guark: {
        hello_world: hello_world
    }
})

Alpine.store('global_funcs').guark.hello_world()

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

    // Set the add function into the wasm store
    Alpine.store('global_funcs').setGoFunc("add", wasmModule.instance.exports.add)

    // Test running the add function
    console.log( Alpine.store('global_funcs').go.add(40, 2));
};
addWasmFunctions();


window.Alpine = Alpine;


 

// Register Components
document.addEventListener('alpine:init', () => {
    Alpine.data('pill', MyPillComponent);
})

Alpine.start();

