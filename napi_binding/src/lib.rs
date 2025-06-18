use markdown::{to_mdast, ParseOptions};
use napi::{bindgen_prelude::*, Error};
use napi_derive::napi;
use serde_json::Value;

#[napi]
pub fn parse(input: String) -> Result<Value> {
    let tree = to_mdast(&input, &ParseOptions::default())
        .map_err(|e| Error::from_reason(format!("{:?}", e)))?;
    serde_json::to_value(&tree).map_err(|e| Error::from_reason(e.to_string()))
}

#[napi]
pub fn parse_mdx(mdx: String) -> Result<Value> {
    let ast =
        to_mdast(&mdx, &ParseOptions::mdx()).map_err(|e| Error::from_reason(format!("{:?}", e)))?;
    serde_json::to_value(&ast).map_err(|e| Error::from_reason(e.to_string()))
}
