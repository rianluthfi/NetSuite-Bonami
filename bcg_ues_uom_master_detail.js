/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/ui/serverWidget', 'N/runtime', 'N/search'],

function(record, serverWidget, runtime, search) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(context) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(context) {
		var newRecord = context.newRecord;
		
		if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT){
			var unitsType = newRecord.getValue('unitstype');
			var stockunit = newRecord.getValue('stockunit');
			var purchaseunit = newRecord.getValue('purchaseunit');
			var saleunit = newRecord.getValue('saleunit');
			var consumptionunit = newRecord.getValue('consumptionunit');
			var baseunit = newRecord.getValue('baseunit');
			
			if (unitsType != ''){
				var master = record.load({
					type: 'unitstype', 
					id: unitsType,
					isDynamic: true,
				});
				
				var lineCount = master.getLineCount('uom');
				
				for (var i = 0; i < lineCount; i++){
					var id = master.getSublistValue({
						sublistId : 'uom',
						fieldId : 'internalid',
						line : i
					});
					
					if (id == stockunit){
						setStock(newRecord, master, i);
					}
					
					if (id == purchaseunit){
						setPurchase(newRecord, master, i);
					}
					
					if (id == saleunit){
						setSale(newRecord, master, i);
					}
					
					if (id == consumptionunit){
						setConsumption(newRecord, master, i);
					}
					
					if (id == baseunit){
						setBase(newRecord, master, i);
					}
				}
			}
			else{
				return;
			}
		}
		else{
			return;
		}
    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(context) {
		
    }
	
	function setConsumption(newRecord, master, i){
		var unitname = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'unitname',
			line : i
		});
		var pluralname = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'pluralname',
			line : i
		});
		var abbreviation = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'abbreviation',
			line : i
		});
		var pluralabbreviation = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'pluralabbreviation',
			line : i
		});
		var conversionrate = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'conversionrate',
			line : i
		});
		
		newRecord.setValue('custitem_bcg_cons_unit_name', unitname);
		newRecord.setValue('custitem_bcg_cons_unit_plural_name', pluralname);
		newRecord.setValue('custitem_bcg_cons_unit_abbr', abbreviation);
		newRecord.setValue('custitem_bcg_cons_unit_plural_abbr', pluralabbreviation);
		newRecord.setValue('custitem_bcg_cons_unit_conversion', conversionrate);
	}
	
	function setSale(newRecord, master, i){
		var unitname = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'unitname',
			line : i
		});
		var pluralname = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'pluralname',
			line : i
		});
		var abbreviation = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'abbreviation',
			line : i
		});
		var pluralabbreviation = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'pluralabbreviation',
			line : i
		});
		var conversionrate = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'conversionrate',
			line : i
		});
		
		newRecord.setValue('custitem_bcg_sale_unit_name', unitname);
		newRecord.setValue('custitem_bcg_sale_unit_plural_name', pluralname);
		newRecord.setValue('custitem_bcg_sale_unit_abbr', abbreviation);
		newRecord.setValue('custitem_bcg_sale_unit_plural_abbr', pluralabbreviation);
		newRecord.setValue('custitem_bcg_sale_unit_conversion', conversionrate);
	}
	
	function setPurchase(newRecord, master, i){
		var unitname = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'unitname',
			line : i
		});
		var pluralname = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'pluralname',
			line : i
		});
		var abbreviation = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'abbreviation',
			line : i
		});
		var pluralabbreviation = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'pluralabbreviation',
			line : i
		});
		var conversionrate = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'conversionrate',
			line : i
		});
		
		newRecord.setValue('custitem_bcg_purchase_unit_name', unitname);
		newRecord.setValue('custitem_bcg_purchase_unit_plural_name', pluralname);
		newRecord.setValue('custitem_bcg_purchase_unit_abbr', abbreviation);
		newRecord.setValue('custitem_bcg_purchase_unit_plural_abbr', pluralabbreviation);
		newRecord.setValue('custitem_bcg_purchase_unit_conversion', conversionrate);
	}
	
	function setBase(newRecord, master, i){
		var unitname = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'unitname',
			line : i
		});
		var pluralname = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'pluralname',
			line : i
		});
		var abbreviation = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'abbreviation',
			line : i
		});
		var pluralabbreviation = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'pluralabbreviation',
			line : i
		});
		var conversionrate = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'conversionrate',
			line : i
		});
		
		newRecord.setValue('custitem_bcg_base_unit_name', unitname);
		newRecord.setValue('custitem_bcg_base_unit_plural_name', pluralname);
		newRecord.setValue('custitem_bcg_base_unit_abbr', abbreviation);
		newRecord.setValue('custitem_bcg_base_unit_plural_abbr', pluralabbreviation);
		newRecord.setValue('custitem_bcg_base_unit_conversion', conversionrate);
	}
	
	function setStock(newRecord, master, i){
		var unitname = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'unitname',
			line : i
		});
		var pluralname = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'pluralname',
			line : i
		});
		var abbreviation = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'abbreviation',
			line : i
		});
		var pluralabbreviation = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'pluralabbreviation',
			line : i
		});
		var conversionrate = master.getSublistValue({
			sublistId : 'uom',
			fieldId : 'conversionrate',
			line : i
		});
		
		newRecord.setValue('custitem_bcg_stock_unit_name', unitname);
		newRecord.setValue('custitem_bcg_stock_unit_plural_name', pluralname);
		newRecord.setValue('custitem_bcg_stock_unit_abbr', abbreviation);
		newRecord.setValue('custitem_bcg_stock_unit_plural_abbr', pluralabbreviation);
		newRecord.setValue('custitem_bcg_stock_unit_conversion', conversionrate);
	}

    return {
        // beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    };
    
});
