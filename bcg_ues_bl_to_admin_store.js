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
		var newRecord = context.newRecord;
		
		var userObj  = runtime.getCurrentUser();
		var userRole = userObj.role;
			
		var form = context.form;
		
		var customForm = newRecord.getValue('customform');
		log.debug('current customForm '+customForm);
		
		// 131	Permintaan Stok (IN)	
		if (customForm == '131'){
			var toLocation = form.getField('transferlocation');
		
			toLocation.updateDisplayType({
				displayType: serverWidget.FieldDisplayType.INLINE
			});
		}
		// 132	Retur Stok (OUT)
		else if (customForm == '132'){
			var location = form.getField('location');
		
			location.updateDisplayType({
				displayType: serverWidget.FieldDisplayType.INLINE
			});
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

    }
	
    return {
        beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    };
    
});