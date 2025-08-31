class Node {
  constructor(id, content) {
    this.id = id;
    this.content = content;
    this.children = [];
    this.parent = null;
    this.links = new Set();
    this.summary = '';
  }
}

export default class MindMap {
  constructor(rootContent = 'root') {
    this.root = new Node('root', rootContent);
    this.nodes = new Map([[this.root.id, this.root]]);
    this.history = [];
    this.redoStack = [];
    this.plugins = [];
  }

  _record(action, payload) {
    this.history.push({ action, payload });
    this.redoStack = [];
  }

  addNode(parentId, id, content, record = true) {
    const parent = this.nodes.get(parentId);
    if (!parent) throw new Error('Parent not found');
    const node = new Node(id, content);
    node.parent = parent;
    parent.children.push(node);
    this.nodes.set(id, node);
    if (record) this._record('add', { parentId, id, content });
    return node;
  }

  removeNode(id, record = true) {
    const node = this.nodes.get(id);
    if (!node || id === 'root') return;
    const parent = node.parent;
    parent.children = parent.children.filter(c => c.id !== id);
    this.nodes.delete(id);
    if (record) this._record('remove', { parentId: parent.id, node });
    return node;
  }

  moveNode(id, newParentId, record = true) {
    const node = this.nodes.get(id);
    const newParent = this.nodes.get(newParentId);
    if (!node || !newParent) return;
    const oldParent = node.parent;
    oldParent.children = oldParent.children.filter(c => c.id !== id);
    node.parent = newParent;
    newParent.children.push(node);
    if (record) this._record('move', { id, oldParentId: oldParent.id, newParentId });
  }

  connectNodes(sourceId, targetId, record = true) {
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);
    if (!source || !target) return;
    source.links.add(targetId);
    if (record) this._record('connect', { sourceId, targetId });
  }

  setSummary(id, summary, record = true) {
    const node = this.nodes.get(id);
    if (!node) return;
    const prevSummary = node.summary;
    node.summary = summary;
    if (record) this._record('summary', { id, prevSummary, summary });
  }

  setContent(id, content, record = true) {
    const node = this.nodes.get(id);
    if (!node) return;
    const prevContent = node.content;
    node.content = content;
    if (record) this._record('content', { id, prevContent, content });
  }

  select(ids) {
    return ids.map(id => this.nodes.get(id)).filter(Boolean);
  }

  bulk(ids, fn) {
    this.select(ids).forEach(fn);
  }

  undo() {
    const cmd = this.history.pop();
    if (!cmd) return;
    const { action, payload } = cmd;
    switch (action) {
      case 'add':
        this.removeNode(payload.id, false);
        break;
      case 'remove':
        const { parentId, node } = payload;
        const parent = this.nodes.get(parentId);
        node.parent = parent;
        parent.children.push(node);
        this.nodes.set(node.id, node);
        break;
      case 'move':
        this.moveNode(payload.id, payload.oldParentId, false);
        break;
      case 'connect':
        this.connectNodes(payload.sourceId, payload.targetId, false);
        const source = this.nodes.get(payload.sourceId);
        source.links.delete(payload.targetId);
        break;
      case 'summary':
        this.setSummary(payload.id, payload.prevSummary, false);
        break;
      case 'content':
        this.setContent(payload.id, payload.prevContent, false);
        break;
      default:
        break;
    }
    this.redoStack.push(cmd);
  }

  redo() {
    const cmd = this.redoStack.pop();
    if (!cmd) return;
    const { action, payload } = cmd;
    switch (action) {
      case 'add':
        this.addNode(payload.parentId, payload.id, payload.content, false);
        break;
      case 'remove':
        this.removeNode(payload.node.id, false);
        break;
      case 'move':
        this.moveNode(payload.id, payload.newParentId, false);
        break;
      case 'connect':
        this.connectNodes(payload.sourceId, payload.targetId, false);
        break;
      case 'summary':
        this.setSummary(payload.id, payload.summary, false);
        break;
      case 'content':
        this.setContent(payload.id, payload.content, false);
        break;
      default:
        break;
    }
    this.history.push(cmd);
  }

  use(plugin) {
    if (typeof plugin === 'function') {
      plugin(this);
    } else if (plugin && typeof plugin.init === 'function') {
      plugin.init(this);
    }
    this.plugins.push(plugin);
  }

  toJSON() {
    const serialize = node => ({
      id: node.id,
      content: node.content,
      summary: node.summary,
      links: Array.from(node.links),
      children: node.children.map(serialize)
    });
    return JSON.stringify(serialize(this.root));
  }

  toHTML() {
    const build = node => {
      const childrenHTML = node.children.map(build).join('');
      const summary = node.summary ? `<em>${node.summary}</em>` : '';
      const links = node.links.size
        ? `<span class="links">${Array.from(node.links).join(',')}</span>`
        : '';
      return `<li data-id="${node.id}">${node.content}${summary}${links}${childrenHTML ? `<ul>${childrenHTML}</ul>` : ''}</li>`;
    };
    return `<ul>${build(this.root)}</ul>`;
  }
}

export { Node };
