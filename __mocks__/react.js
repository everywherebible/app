const react = require('react');

window.requestAnimationFrame = callback => setTimeout(callback, 0);

module.exports = react;

