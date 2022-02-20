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
		var newRecord = context.newRecord;
		
		var subsidiary = newRecord.getText('subsidiary');
		var objRecord = record.load({
			type: record.Type.ACCOUNT, 
			id: newRecord.id,
			isDynamic: true,
		});
		
		if (subsidiary.length == 1){
			objRecord.setValue('custrecord_bcg_subsidiary', subsidiary.toString());
			objRecord.save();
		}
		else if (subsidiary.length > 1){
			var temp = '';
			for (var i = 0; i < subsidiary.length; i++){
				var temp = temp+subsidiary[i]+'|';
				// log.debug(temp);
			}
			// log.debug(temp.slice(0,-1));
			objRecord.setValue('custrecord_bcg_subsidiary', temp.slice(0,-1));
			objRecord.save();
		}
    }
	
    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});