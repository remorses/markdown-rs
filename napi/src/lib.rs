use napi::{bindgen_prelude::*, Error};
use napi_derive::napi;
use serde_json::Value;

#[napi]
pub fn parse(input: String) -> Result<Value> {
    let tree = markdown::to_mdast(&input, &markdown::ParseOptions::default())
        .map_err(|e| Error::from_reason(format!("{:?}", e)))?;
    serde_json::to_value(&tree).map_err(|e| Error::from_reason(e.to_string()))
}

#[napi]
pub fn parse_mdx(mdx: String) -> Result<Value> {
    // Enable ESM parsing in addition to MDX options
    // markdown::ParseOptions::mdx()
    let options = markdown::ParseOptions {
        constructs: markdown::Constructs::mdx(),
        ..Default::default()
    };

    let ast = markdown::to_mdast(&mdx, &options).map_err(|e| Error::from_reason(format!("{:?}", e)))?;
    serde_json::to_value(&ast).map_err(|e| Error::from_reason(e.to_string()))
}

#[napi]
pub fn to_html(mdx: String) -> Value {
    let html = markdown::to_html(&mdx);
    html.into()
}
