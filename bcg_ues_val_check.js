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
			var subsidiary = newRecord.getValue('subsidiary');
			
			if (subsidiary != '')
				newRecord.setValue('custbody_bcg_subsidiary_if', subsidiary);
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
		// var newRecord = context.newRecord;
		// var sublistName = context.sublistId;
		// var fieldName = context.fieldId;
		
		// if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT){
			// // var objRecord = record.load({
				// // type: record.Type.CHECK, 
				// // id: newRecord.id,
				// // isDynamic: true,
			// // });
			
			// // var subsidiary = objRecord.getValue('subsidiary');
			// // objRecord.setValue('custbody_bcg_subsidiary_if', subsidiary);
			// // objRecord.save();
		// }
    }

    return {
        // beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    };
});
