use markdown::{MdxExpressionKind, MdxSignal};
use napi::{bindgen_prelude::*, Error};
use napi_derive::napi;
use serde_json::Value;

#[napi(object)]
pub struct ParseOptions {
    /// Whether to parse as MDX
    pub mdx: Option<bool>,
    /// Whether to support GFM strikethrough with a single tilde
    pub gfm_strikethrough_single_tilde: Option<bool>,
    /// Whether to support math (text) with a single dollar
    pub math_text_single_dollar: Option<bool>,
    /// Whether to enable basic MDX expression parsing
    pub mdx_expression_parse: Option<bool>,
    /// Whether to enable basic MDX ESM parsing
    pub mdx_esm_parse: Option<bool>,
}

#[napi(object)]
pub struct Section {
    /// Raw text content of the section
    pub raw: String,
    /// Type of the section (e.g., "heading", "paragraph", etc.)
    pub r#type: String,
    /// Position information
    pub position: Option<Value>,
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
    let mut parse_options = match &options {
        Some(opts) => {
            if opts.mdx.unwrap_or(false) {
                markdown::ParseOptions {
                    constructs: markdown::Constructs::mdx(),
                    ..Default::default()
                }
            } else {
                markdown::ParseOptions::default()
            }
        }
        None => markdown::ParseOptions::default(),
    };

    // Override with user-provided options if available
    if let Some(opts) = options {
        let user_options = opts.to_rust_parse_options();
        parse_options.gfm_strikethrough_single_tilde = user_options.gfm_strikethrough_single_tilde;
        parse_options.math_text_single_dollar = user_options.math_text_single_dollar;
        parse_options.mdx_expression_parse = user_options.mdx_expression_parse;
        parse_options.mdx_esm_parse = user_options.mdx_esm_parse;
    }

    let tree = markdown::to_mdast(&input, &parse_options)
        .map_err(|e| Error::from_reason(format!("{:?}", e)))?;
    serde_json::to_value(&tree).map_err(|e| Error::from_reason(e.to_string()))
}

#[napi]
pub fn split_into_sections(input: String, options: Option<ParseOptions>) -> Result<Vec<Section>> {
    let mut parse_options = match &options {
        Some(opts) => {
            if opts.mdx.unwrap_or(false) {
                markdown::ParseOptions {
                    constructs: markdown::Constructs::mdx(),
                    ..Default::default()
                }
            } else {
                markdown::ParseOptions::default()
            }
        }
        None => markdown::ParseOptions::default(),
    };

    // Override with user-provided options if available
    if let Some(opts) = options {
        let user_options = opts.to_rust_parse_options();
        parse_options.gfm_strikethrough_single_tilde = user_options.gfm_strikethrough_single_tilde;
        parse_options.math_text_single_dollar = user_options.math_text_single_dollar;
        parse_options.mdx_expression_parse = user_options.mdx_expression_parse;
        parse_options.mdx_esm_parse = user_options.mdx_esm_parse;
    }

    let tree = markdown::to_mdast(&input, &parse_options)
        .map_err(|e| Error::from_reason(format!("{:?}", e)))?;

    // Convert AST to JSON to extract children
    let ast_value = serde_json::to_value(&tree).map_err(|e| Error::from_reason(e.to_string()))?;

    let mut sections = Vec::new();

    if let Some(children) = ast_value.get("children").and_then(|c| c.as_array()) {
        for child in children {
            let node_type = child
                .get("type")
                .and_then(|t| t.as_str())
                .unwrap_or("unknown")
                .to_string();

            let position = child.get("position").cloned();

            // Extract raw text from position
            let raw = if let Some(pos) = &position {
                if let (Some(start), Some(end)) = (
                    pos.get("start")
                        .and_then(|s| s.get("offset"))
                        .and_then(|o| o.as_u64()),
                    pos.get("end")
                        .and_then(|e| e.get("offset"))
                        .and_then(|o| o.as_u64()),
                ) {
                    let start_idx = start as usize;
                    let end_idx = end as usize;
                    if start_idx <= input.len() && end_idx <= input.len() && start_idx <= end_idx {
                        input[start_idx..end_idx].to_string()
                    } else {
                        String::new()
                    }
                } else {
                    String::new()
                }
            } else {
                String::new()
            };

            sections.push(Section {
                raw,
                r#type: node_type,
                position,
            });
        }
    }

    Ok(sections)
}

// #[napi]
// pub fn to_html(mdx: String) -> Value {
//     let html = markdown::to_html(&mdx);
//     html.into()
// }
