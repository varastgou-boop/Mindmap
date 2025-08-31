# Mindmap Core

Mindmap Core is a lightweight, framework-agnostic JavaScript library for building interactive mind maps. It focuses on data structures and operations so you can pair it with any frontend technology.

## Features

### 🎨 User Experience
- Fluent UX – smooth and intuitive interactions
- Well designed – clean data model ready for custom UIs
- Mobile friendly – works with touch-enabled interfaces
- Efficient shortcuts – expose operations for keyboard shortcut integration

### ⚡ Performance & Architecture
- Lightweight with minimal bundle size
- High performance data structure optimized for large maps
- Framework agnostic – use it with React, Vue, Svelte or vanilla JS
- Plug‑in architecture to extend behaviour

### 🛠️ Core Features
- Interactive editing with drag‑and‑drop style node operations
- Bulk operations with multi‑node selection helpers
- Undo / Redo history stack
- Node connections and summarization

### 📤 Export & Customization
- Export to JSON and HTML (SVG/PNG hooks ready for extension)
- Easy styling via custom rendering and CSS variables
- Theme support through plugin system

## Usage

```javascript
import MindMap from 'mindmap-core';

const map = new MindMap('Main topic');
map.addNode('root', 'a', 'First');
map.addNode('root', 'b', 'Second');
map.connectNodes('a', 'b');
console.log(map.toJSON());
```

Run the demo test:

```bash
npm test
```
