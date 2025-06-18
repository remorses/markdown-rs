
This is the package that handles NAPI bindings for markdown-rs. It also supports wasm.

## Testing

Tests use vitest, use expect().toMatchInlineSnapshot() mostly. Never pass the snapshot yourself, instead leave it empty and then run the test with `pnpm vitest --run -u` to update snapshots, then read the test file again and make sure it has the expected result.

When making changes in rust run `pnpm build:debug` to make sure the Rust compiles. If not fix all the errors. Try to not change other crates source code, which are unrelated to the npm package
