(function() {
    const type = typeof global;
    if (type == 'object') {  //node.js
        module.exports = require('./nodejs/index.js');
    } else if (type == 'function') {  //Rhino JS Engine
        module.exports = require('./rhino/index.js');
    } else {  //???
        module.exports = {};
    }
})();

