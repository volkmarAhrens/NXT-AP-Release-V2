/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/FilterBarDelegate","sap/ui/core/Core"],function(e,t){"use strict";const r=t.getLibraryResourceBundle("sap.ui.mdc");const i=Object.assign({},e);i.fetchProperties=function(e){const t=e.getParent();let i="$search";if(t&&!t.isPropertyInitial("filterFields")){i=t.getFilterFields()}return Promise.resolve([{name:i,label:r.getText("filterbar.SEARCH"),dataType:"sap.ui.model.type.String"}])};return i});
//# sourceMappingURL=FilterBarDelegate.js.map