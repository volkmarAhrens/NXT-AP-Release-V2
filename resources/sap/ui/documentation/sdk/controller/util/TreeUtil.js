/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var e=function(e,t){this.nodeIdField=e;this.childrenField=t};e.prototype.getPathToNode=function(e,t){var i=[];this._walkTree(e,t,i);return i};e.prototype._walkTree=function(e,t,i){var r=this._findLeaf(t,e);if(r){i.push(e);return true}for(var n=0;n<t.length;n++){if(t[n][this.childrenField]){i.push(t[n][this.nodeIdField]);if(this._walkTree(e,t[n][this.childrenField],i)){return true}i.pop()}}};e.prototype._findLeaf=function(e,t){for(var i=0;i<e.length;i++){if(e[i][this.nodeIdField]===t){return e[i]}}return null};return e});
//# sourceMappingURL=TreeUtil.js.map