sap.ui.define([
	"sap/ui/comp/filterbar/FilterBar",
	"sap/ui/comp/smartvariants/PersonalizableInfo",
	"sap/ui/comp/smartvariants/SmartVariantManagement"
], function (FilterBar, PersonalizableInfo, SmartVariantManagement) {
	"use strict";

	/**
	 * @class SVMFilterBar
	 * @classdesc
	 * Standard sap.ui.comp.filterbar.FilterBar with *built-in* SmartVariantManagement
	 * @augments sap.ui.comp.filterbar.FilterBar
	 */

	var SVMFilterBar = FilterBar.extend("sample.SVMFilterBar.control.SVMFilterBar.SVMFilterBar", {
		renderer: function (oRm, oControl) {
			FilterBar.getMetadata().getRenderer().render(oRm, oControl);
		}
	});
	/**
	 * @memberOf SVMFilterBar
	 * @private
	 * @description Initialise the variant management
	 */
	SVMFilterBar.prototype._initializeVariantManagement = function (oEvt) {
		if (this._oSmartVM && this.getPersistencyKey()) {
			var oPersInfo = new PersonalizableInfo({
				type: "filterBar",
				keyName: "persistencyKey"
			});
			oPersInfo.setControl(this);
			if (this._oSmartVM._loadFlex) {
				this._oSmartVM._loadFlex().then(function () {
					this._oSmartVM.addPersonalizableControl(oPersInfo);
					FilterBar.prototype._initializeVariantManagement.apply(this, arguments);
				}.bind(this));
			} else {
				this._oSmartVM.addPersonalizableControl(oPersInfo);
				FilterBar.prototype._initializeVariantManagement.apply(this, arguments);
			}
		} else {
			this.fireInitialise();
		}
	};
	/**
	 * @memberOf SVMFilterBar
	 * @private
	 * @description Use sap.ui.comp.smartvariants.SmartVariantManagement instead of the sap.ui.comp.smartvariants.SmartVariantManagementUi2
	 */
	SVMFilterBar.prototype._createVariantManagement = function () {
		this._oSmartVM = new SmartVariantManagement({
			showExecuteOnSelection: true,
			showShare: true
		});
		return this._oSmartVM;
	};
	/**
	 * @memberOf SVMFilterBar
	 * @private
	 * @description The original method accepts only SmartVariantManagementUi2
	 */
	SVMFilterBar.prototype._isTINAFScenario = function () {
		if (this._oVariantManagement) {
			if (!this._isUi2Mode() && !(this._oVariantManagement instanceof SmartVariantManagement)) {
				return true;
			}
		} else {
			/* eslint-disable no-lonely-if */
			// scenario: VH dialog: VM replaced with collective search control
			if (this._oCollectiveSearch && this.getAdvancedMode()) {
				return true;
			}
			/* eslint-enable no-lonely-if */
		}
		return false;
	};
	return SVMFilterBar;
});