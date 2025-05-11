//@ui5-bundle sap/ui/fl/designtime/library-preload.designtime.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/fl/designtime/library.designtime", [],function(){"use strict";return{}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/fl/designtime/util/IFrame.designtime", ["sap/ui/fl/designtime/util/editIFrame"],function(e){"use strict";return{actions:{settings(){return{icon:"sap-icon://write-new",name:"CTX_EDIT_IFRAME",isEnabled:true,handler:e}},remove:{changeType:"hideControl"},reveal:{changeType:"unhideControl"}}}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/fl/designtime/util/editIFrame", ["sap/base/util/restricted/_isEqual","sap/base/util/deepClone","sap/ui/core/Element","sap/ui/rta/plugin/iframe/AddIFrameDialog"],function(e,t,a,i){"use strict";return async function n(r){const s=new i;const c=r.get_settings();const g=r.getRenameInfo();if(g){const e=a.getElementById(g.sourceControlId);c.title=e.getProperty(g.propertyName)}const o=await i.buildUrlBuilderParametersFor(r);const d={parameters:o,frameUrl:c.url,frameWidth:c.width,frameHeight:c.height,title:c.title,asContainer:!!c.title,useLegacyNavigation:c.useLegacyNavigation,advancedSettings:t(c.advancedSettings),updateMode:true};const u=await s.open(d,r);if(!u){return[]}const l=[];let h=false;const f={url:c.url,height:c.height,width:c.width,useLegacyNavigation:c.useLegacyNavigation,advancedSettings:c.advancedSettings};if(u.frameHeight+u.frameHeightUnit!==c.height){h=true;f.height=u.frameHeight+u.frameHeightUnit}if(u.frameWidth+u.frameWidthUnit!==c.width){h=true;f.width=u.frameWidth+u.frameWidthUnit}if(u.frameUrl!==c.url){h=true;f.url=u.frameUrl}if(u.useLegacyNavigation!==!!c.useLegacyNavigation){h=true;f.useLegacyNavigation=u.useLegacyNavigation}if(!e(u.advancedSettings,c.advancedSettings)){h=true;f.advancedSettings=u.advancedSettings}if(h){l.push({selectorControl:r,changeSpecificData:{changeType:"updateIFrame",content:f}})}if(u.title!==c.title){const e={selectorControl:a.getElementById(g.selectorControlId),changeSpecificData:{changeType:"rename",content:{value:u.title}}};l.push(e)}return l}});
/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine("sap/ui/fl/designtime/variants/VariantManagement.designtime", ["sap/ui/core/Lib","sap/ui/fl/apply/api/ControlVariantApplyAPI","sap/ui/fl/Utils"],function(e,t,r){"use strict";var a=function(e,a){var o=r.getAppComponentForControl(e);var n=e.getId();var i=o.getModel(t.getVariantModelName());var l=o.getLocalId(n)||n;if(!i){return}if(a){i.waitForVMControlInit(l).then(function(){i.setModelPropertiesForControl(l,a,e);i.checkUpdate(true)})}else{i.setModelPropertiesForControl(l,a,e);i.checkUpdate(true)}};return{annotations:{},properties:{showSetAsDefault:{ignore:false},inErrorState:{ignore:false},editable:{ignore:false},modelName:{ignore:false},updateVariantInURL:{ignore:true},resetOnContextChange:{ignore:true},executeOnSelectionForStandardDefault:{ignore:false},displayTextForExecuteOnSelectionForStandardVariant:{ignore:false},headerLevel:{ignore:false}},variantRenameDomRef(e){return e.getTitle().getDomRef("inner")},customData:{},tool:{start(e){var t=true;a(e,t);e.enteringDesignMode()},stop(e){var t=false;a(e,t);e.leavingDesignMode()}},actions:{controlVariant(a){var o=r.getAppComponentForControl(a);var n=a.getId();var i=o.getModel(t.getVariantModelName());var l=o.getLocalId(n)||n;return{validators:["noEmptyText",{validatorFunction(e){var t=i._getVariantTitleCount(e,l)||0;return t===0},errorMessage:e.getResourceBundleFor("sap.m").getText("VARIANT_MANAGEMENT_ERROR_DUPLICATE")}]}}}}});
//# sourceMappingURL=library-preload.designtime.js.map
