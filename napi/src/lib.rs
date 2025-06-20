use markdown::{MdxExpressionKind, MdxSignal};
use napi::{bindgen_prelude::*, Error};
use napi_derive::napi;
use serde_json::Value;

#[napi(object)]
pub struct ParseOptions {
    /// Whether to parse as MDX
    pub mdx: Option<bool>,
    /// Whether to enable GitHub Flavored Markdown (GFM) constructs
    pub gfm: Option<bool>,
    /// Whether to support GFM strikethrough with a single tilde
    pub gfm_strikethrough_single_tilde: Option<bool>,
    /// Whether to support math (text) with a single dollar
    pub math_text_single_dollar: Option<bool>,
    /// Whether to enable basic MDX expression parsing
    pub mdx_expression_parse: Option<bool>,
    /// Whether to enable basic MDX ESM parsing
    pub mdx_esm_parse: Option<bool>,
    /// Whether to support frontmatter
    pub frontmatter: Option<bool>,
}



impl ParseOptions {
    fn to_rust_parse_options(&self) -> markdown::ParseOptions {
        let mut constructs = if self.mdx.unwrap_or(false) {
            markdown::Constructs::mdx()
        } else {
            markdown::Constructs::default()
        };

        // Enable GFM constructs if requested
        if self.gfm.unwrap_or(false) {
            constructs.gfm_autolink_literal = true;
            constructs.gfm_label_start_footnote = true;
            constructs.gfm_footnote_definition = true;
            constructs.gfm_strikethrough = true;
            constructs.gfm_table = true;
            constructs.gfm_task_list_item = true;
        }

        // Enable frontmatter if requested
        if self.frontmatter.unwrap_or(false) {
            constructs.frontmatter = true;
        }

        markdown::ParseOptions {
            constructs,
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


// #[napi]
// pub fn to_html(mdx: String) -> Value {
//     let html = markdown::to_html(&mdx);
//     html.into()
// }
