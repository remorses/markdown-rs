import { bench, describe } from "vitest";
import { parse, splitIntoSections } from "../";
import { remark } from "remark";
import remarkMdx from "remark-mdx";

// Create remark processor
const remarkProcessor = remark().use(remarkMdx);

// Long MDX content for benchmarking
let longMdxContent = `import React from 'react'
import { Button, Card, Chart } from './components'
import { useEffect, useState } from 'react'

export const metadata = {
  title: 'Performance Benchmark Document',
  author: 'Benchmark Suite',
  date: '2024-01-01'
}

# Performance Test Document

This is a comprehensive MDX document designed to test parsing performance across different implementations.

## Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Interactive Components

<Card title="Performance Metrics" variant="outlined">
  <p>This document contains various MDX elements to stress-test the parser:</p>

  <ul>
    <li>**JSX Components** with props</li>
    <li>*JavaScript expressions* in {new Date().getFullYear()}</li>
    <li>\`Inline code\` and code blocks</li>
    <li>Tables, lists, and blockquotes</li>
  </ul>

  <Button
    onClick={() => console.log('Clicked!')}
    disabled={false}
    variant="primary"
  >
    Interactive Button {Math.random()}
  </Button>
</Card>

## Data Visualization

<Chart
  data={[
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 }
  ]}
  type="line"
  width={500}
  height={300}
/>

## Code Examples

Here's a TypeScript example:

\`\`\`typescript
interface PerformanceMetrics {
  parseTime: number;
  memoryUsage: number;
  operationsPerSecond: number;
}

class BenchmarkRunner {
  private metrics: PerformanceMetrics[] = [];

  async runBenchmark(iterations: number): Promise<PerformanceMetrics> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;

    for (let i = 0; i < iterations; i++) {
      await this.executeOperation();
    }

    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    return {
      parseTime: endTime - startTime,
      memoryUsage: endMemory - startMemory,
      operationsPerSecond: iterations / ((endTime - startTime) / 1000)
    };
  }
}
\`\`\`

### JavaScript Example

\`\`\`javascript
function calculatePerformance(data) {
  return data
    .filter(item => item.value > 0)
    .map(item => ({
      ...item,
      normalized: item.value / Math.max(...data.map(d => d.value))
    }))
    .sort((a, b) => b.normalized - a.normalized);
}

const results = calculatePerformance([
  { name: 'Parser A', value: 1200 },
  { name: 'Parser B', value: 800 },
  { name: 'Parser C', value: 1500 }
]);
\`\`\`

## Mathematical Expressions

Performance can be measured using various metrics: $T = \\frac{n}{ops/sec}$

Where:
- $T$ is total time
- $n$ is number of operations
- $ops/sec$ is operations per second

Complex equation: $$\\sum_{i=1}^{n} \\frac{1}{T_i} = \\frac{n}{\\bar{T}}$$

## Tables and Data

| Parser | Speed (ops/sec) | Memory (MB) | Bundle Size (KB) |
|--------|-----------------|-------------|------------------|
| markdown-rs | {1000 + Math.floor(Math.random() * 500)} | 12.4 | 89.2 |
| remark | {800 + Math.floor(Math.random() * 300)} | 18.7 | 156.8 |
| marked | {900 + Math.floor(Math.random() * 400)} | 15.2 | 45.6 |

## Lists and Formatting

### Features Comparison

1. **Parsing Speed**
   - Raw text processing
   - AST generation time
   - Memory allocation efficiency

2. **Bundle Size**
   - Core library size
   - Plugin ecosystem impact
   - Tree-shaking effectiveness

3. **Developer Experience**
   - API simplicity
   - TypeScript support
   - Error handling

### Pros and Cons

- ✅ Fast parsing performance
- ✅ Low memory footprint
- ✅ Rust-based reliability
- ❌ Smaller ecosystem
- ❌ Learning curve for Rust integration

> **Important Note**: Performance benchmarks can vary significantly based on:
> - Hardware specifications
> - Node.js version
> - System load
> - Input document complexity

## Complex Nested Components

<Card>
  <header>
    <h3>Nested Component Example</h3>
    <span>Performance: {(Math.random() * 100).toFixed(2)}%</span>
  </header>

  <main>
    <p>This tests deeply nested JSX parsing with multiple levels:</p>

    <div className="metrics-grid">
      <div className="metric">
        <strong>Parse Time:</strong>
        <span>{(Math.random() * 50).toFixed(2)}ms</span>
      </div>
      <div className="metric">
        <strong>Memory:</strong>
        <span>{(Math.random() * 20).toFixed(1)}MB</span>
      </div>
    </div>

    <Button variant="secondary" size="small">
      Nested Button {Date.now()}
    </Button>
  </main>
</Card>

## Multiple Sections for Load Testing

${Array(5)
  .fill(
    `
### Section {index}

This is section number {index} with various content types:

- Regular **bold** and *italic* text
- \`Inline code snippets\`
- [External links](https://example.com)

#### Subsection Code

\`\`\`json
{
  "benchmark": "section-{index}",
  "timestamp": {Date.now()},
  "data": [1, 2, 3, 4, 5]
}
\`\`\`

<div>
  <p>JSX content in section {index}</p>
  <Button onClick={() => alert('Section {index}')}>
    Section {index} Button
  </Button>
</div>

> Blockquote in section {index} with **formatting** and \`code\`

| Item | Value |
|------|-------|
| A{index} | {Math.random()} |
| B{index} | {Math.random()} |
`,
  )
  .join("\n\n")}

## Final Performance Summary

<Card title="Benchmark Results" className="summary">
  <Chart
    data={[
      { parser: 'markdown-rs', score: 95 },
      { parser: 'remark', score: 78 },
      { parser: 'marked', score: 82 }
    ]}
    type="bar"
  />

  <p>
    Based on our comprehensive testing, markdown-rs shows significant
    performance advantages in parsing speed and memory efficiency.
    Current timestamp: {new Date().toISOString()}
  </p>
</Card>

---

*End of benchmark document. This is a comprehensive MDX performance test.*

`;

longMdxContent = longMdxContent.repeat(10);

describe("MDX Parsing Performance Comparison", () => {
  bench("markdown-rs parse", () => {
    const res = parse(longMdxContent, {
      mdx: true,
      mdxExpressionParse: true,
      mdxEsmParse: true,
    });
    console.log(res);
  });

  bench("markdown-rs splitIntoSections", () => {
    splitIntoSections(longMdxContent, {
      mdx: true,
      mdxExpressionParse: true,
      mdxEsmParse: true,
    });
  });

  bench("remark + remark-mdx parse", () => {
    remarkProcessor.runSync(remarkProcessor.parse(longMdxContent));
  });
});
