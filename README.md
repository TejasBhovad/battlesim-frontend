# Fronted AI battle sim

frontend part for AI battlesim project https://github.com/erga-labs/ant-sim-project

> Yes the name "frontend" is misleading cause we also create API routes here but the actual game simulation takes place in Raylib(CPP)

# Testing

There are two routes created currently for testing if it can be call via CPP.

### Secure route

This is a simple route that returns a message if the auth token is valid.

`http://localhost:3000/api/secure`

```bash
curl -X GET http://localhost:3000/api/secure \
 -H "Authorization: Bearer yoursecretkey"

```

here the `yoursecretkey` is the secret key that is used to validate the token which is stored in `.env.local` file.

### Asking Gemini

Simple route that returns a message if the auth token is valid and API key is valid.

`http://localhost:3000/api/gemini`

```bash
curl -X POST http://localhost:3000/api/gemini \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_auth_key" \
  -d '{"prompt": "What is the capital of France?"}'
```

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

https://sdk.vercel.ai/examples/next-app/basics/generating-object

https://sdk.vercel.ai/examples/next-app/basics/generating-text

https://sdk.vercel.ai/docs/foundations/tools
