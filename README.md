# AI Battles Frontend

https://github.com/user-attachments/assets/c73de00f-dd06-49f8-9952-8ab362fcfb98

frontend part for AI battlesim project https://github.com/erga-labs/ant-sim-project

> Yes the name "frontend" is misleading cause we also create API routes here but the actual game simulation takes place in Raylib(CPP)

## Tech 

stack

- Next.js
- Vercel
- TailwindCSS

### Starting the server

1. Clone the repo
2. Run `npm install`
3. Run `npm run dev`
4. Rename the `.env.example` to `.env.local` and add the secret key.

#### Notes to self

WASM kinda sucks add lines above `var _glfwInit=()=>{` in emscripten-build.js

```js
var Module = Module || {};

// Assign the canvas element to Module["canvas"]
Module["canvas"] = document.getElementById("canvas");
``;
```

Replace to not use relative path in `emscripten-build.js`

```js
function locateFile(filename) {
  // Return the absolute URL for the WebAssembly file
  return `http://localhost:3000/${filename}`;
}

function findWasmBinary() {
  var f = "emscripten-build.wasm";
  if (!isDataURI(f)) {
    return locateFile(f);
  }
  return f;
}
```

## Reference

[1] https://sdk.vercel.ai/examples/next-app/basics/generating-object

[2] https://sdk.vercel.ai/examples/next-app/basics/generating-text

[3] https://sdk.vercel.ai/docs/foundations/tools
