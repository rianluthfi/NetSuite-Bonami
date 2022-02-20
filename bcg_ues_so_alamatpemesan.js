/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/ui/serverWidget', 'N/runtime'],

function(record, serverWidget, runtime) {
   
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
		
		var customer = newRecord.getValue('entity');
		
		if (customer != ''){
			var fromObjCus = record.load({
				type: record.Type.CUSTOMER,
				id: customer,
				isDynamic: true,
			});
			var defaultAddress = fromObjCus.getValue('defaultaddress');
			var toAddress = newRecord.getValue('custbody_bcg_to_address');
			
			if (toAddress == '')
				newRecord.setValue('custbody_bcg_to_address', defaultAddress);
		}
		// ===============================================================================
		
		var location = newRecord.getValue('location');
		if (location != ''){
			var fromObjLocation = record.load({
				type: record.Type.LOCATION,
				id: location,
				isDynamic: true,
			});
			var fromLocAddress = fromObjLocation.getValue('mainaddress_text');
			var fromAddress = newRecord.getValue('custbody_bcg_from_address');
			
			if (fromAddress == '')
				newRecord.setValue('custbody_bcg_from_address', fromLocAddress);
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

    return {
        // beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    };
    
});
