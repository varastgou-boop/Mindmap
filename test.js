import MindMap from './src/index.js';

const map = new MindMap('Mind Map');
map.addNode('root', 'a', 'First');
map.addNode('root', 'b', 'Second');
map.addNode('a', 'a1', 'Child of A');
map.connectNodes('a', 'b');
map.setSummary('a', 'Group A');
map.setContent('b', 'Second Node');

console.log('JSON:', map.toJSON());
console.log('HTML:', map.toHTML());

map.undo(); // undo setContent
map.undo(); // undo setSummary
map.redo(); // redo setSummary

console.log('After undo/redo JSON:', map.toJSON());
