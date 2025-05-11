/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/TreeItemBaseRenderer","sap/ui/core/Core","sap/ui/core/Renderer"],function(e,t,n){"use strict";var r=n.extend(e);r.apiVersion=2;r.renderEntityType=function(e,t){var n=t.getEntityType(),r=n?n[0].toUpperCase():"";if(!n){return}e.openStart("span").class("sapUiDemoKitTreeItemIcon").class("sapUiDemoKitTreeItem"+r).openEnd().text(r).close("span")};r.renderTooltip=function(e,t){var n=t.getEntityType(),r=t.getTarget();if(n&&r){e.attr("title",n+" "+r)}};r.renderLIContent=function(e,n){var r;this.renderEntityType(e,n);e.openStart("a").attr("href",n.getHref()).openEnd();e.openStart("span").class("sapDemokitTreeItemTitle").class("sapUiTinyMarginEnd").openEnd().text(n.getTitle()).close("span");e.close("a");if(n.getDeprecated()){r=t.getLibraryResourceBundle("sap.ui.documentation");e.openStart("span").class("sapDemokitTreeItemLabel").openEnd().text(r.getText("API_MASTER_DEPRECATED")).close("span")}};return r},true);
//# sourceMappingURL=DemokitTreeItemRenderer.js.map