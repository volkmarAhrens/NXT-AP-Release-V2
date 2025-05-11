/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(){"use strict";window.addEventListener("message",function(t){if(t.origin!==window.location.protocol+"//"+window.location.host){return}var o=t.data,i,r,a;if(!o||!o.src||!o.moduleNameToRequire){return}n();e(o);i=sap.ui.getCore();r=i.getConfiguration().getTheme();a=o.activeTheme;if(r!==a){i.applyTheme(a)}});function e(e){sap.ui.require.preload(e.src);sap.ui.require([e.moduleNameToRequire])}function n(){window.addEventListener("error",function(e){e.preventDefault();var n=document.createElement("span");n.innerText=e.message;n.style.cssText="position:absolute; top:1rem; left:1rem";if(!document.body){document.write("<span></span>")}document.body.appendChild(n)});window.addEventListener("unhandledrejection",function(e){e.preventDefault();var n=document.createElement("span");n.innerText=e.reason&&e.reason.message;n.style.cssText="position:absolute; top:1rem; left:1rem";if(!document.body){document.write("<span></span>")}document.body.appendChild(n)})}})();
//# sourceMappingURL=LiveEditorOutput.js.map