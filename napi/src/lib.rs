use napi::{bindgen_prelude::*, Error};
use napi_derive::napi;
use serde_json::Value;
use markdown::{MdxExpressionKind, MdxSignal};

#[napi(object)]
pub struct ParseOptions {
    /// Whether to support GFM strikethrough with a single tilde
    pub gfm_strikethrough_single_tilde: Option<bool>,
    /// Whether to support math (text) with a single dollar
    pub math_text_single_dollar: Option<bool>,
    /// Whether to enable basic MDX expression parsing
    pub mdx_expression_parse: Option<bool>,
    /// Whether to enable basic MDX ESM parsing
    pub mdx_esm_parse: Option<bool>,
}

impl ParseOptions {
    fn to_rust_parse_options(&self) -> markdown::ParseOptions {
        markdown::ParseOptions {
            gfm_strikethrough_single_tilde: self.gfm_strikethrough_single_tilde.unwrap_or(true),
            math_text_single_dollar: self.math_text_single_dollar.unwrap_or(true),
            mdx_expression_parse: if self.mdx_expression_parse.unwrap_or(false) {
                Some(Box::new(|_value: &str, _kind: &MdxExpressionKind| {
                    // Basic expression parsing that just returns success
                    MdxSignal::Ok
                }))
            } else {
                None
            },
            mdx_esm_parse: if self.mdx_esm_parse.unwrap_or(false) {
                Some(Box::new(|_value: &str| {
                    // Basic ESM parsing that just returns success
                    MdxSignal::Ok
                }))
            } else {
                None
            },
            ..Default::default()
        }
    }
}

#[napi]
pub fn parse(input: String, options: Option<ParseOptions>) -> Result<Value> {
    let parse_options = match options {
        Some(opts) => opts.to_rust_parse_options(),
        None => markdown::ParseOptions::default(),
    };

    let tree = markdown::to_mdast(&input, &parse_options)
        .map_err(|e| Error::from_reason(format!("{:?}", e)))?;
    serde_json::to_value(&tree).map_err(|e| Error::from_reason(e.to_string()))
}

#[napi]
pub fn parse_mdx(mdx: String, options: Option<ParseOptions>) -> Result<Value> {
    let mut mdx_options = markdown::ParseOptions {
        constructs: markdown::Constructs::mdx(),
        ..Default::default()
    };

    // Override with user-provided options if available
    if let Some(opts) = options {
        let user_options = opts.to_rust_parse_options();
        mdx_options.gfm_strikethrough_single_tilde = user_options.gfm_strikethrough_single_tilde;
        mdx_options.math_text_single_dollar = user_options.math_text_single_dollar;
        mdx_options.mdx_expression_parse = user_options.mdx_expression_parse;
        mdx_options.mdx_esm_parse = user_options.mdx_esm_parse;
    }

    let ast = markdown::to_mdast(&mdx, &mdx_options).map_err(|e| Error::from_reason(format!("{:?}", e)))?;
    serde_json::to_value(&ast).map_err(|e| Error::from_reason(e.to_string()))
}

#[napi]
pub fn to_html(mdx: String) -> Value {
    let html = markdown::to_html(&mdx);
    html.into()
}
