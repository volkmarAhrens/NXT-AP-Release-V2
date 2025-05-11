/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";function t(t,e,n){if(n!==""||n.toLowerCase()==="auto"){t.style(e,n)}}function e(t){return Object.keys(t).filter(e=>t[e]).map(t=>t.replace(/[A-Z]/g,"-$&").toLowerCase()).join(" ")}var n={apiVersion:2};n.render=function(n,a){n.openStart("iframe",a);t(n,"width",a.getWidth());t(n,"height",a.getHeight());n.style("display","block");n.style("border","none");const i=a.getAdvancedSettings();const{additionalSandboxParameters:r,...o}=i;const s=r?.join(" ");const c=e(o);const l=s?`${c} ${s}`:c;n.attr("sandbox",l);if(a.getUseLegacyNavigation()){n.attr("src",a.getUrl())}else{n.attr("src","about:blank")}var d=a.getTitle();if(d){n.attr("title",d)}n.openEnd();n.close("iframe")};return n},true);
//# sourceMappingURL=IFrameRenderer.js.map