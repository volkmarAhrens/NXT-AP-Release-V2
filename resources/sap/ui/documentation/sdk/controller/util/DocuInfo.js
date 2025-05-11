/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/documentation/sdk/util/Resources"],function(jQuery,e){"use strict";var n;function r(r){if(n){return Promise.resolve(n)}return new Promise(function(u,t){jQuery.ajax({async:true,url:e.getResourceOriginPath(r.docuPath+"index.json"),dataType:"json",success:function(e){n=e;u(e)},error:function(e){t(e)}})})}return{getDocuIndexPromise:r}});
//# sourceMappingURL=DocuInfo.js.map