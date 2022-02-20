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
		var form 			= context.form;
		var itemObj  		= form.getSublist({id : 'item'});
		var userObj = runtime.getCurrentUser();
		
		var rate		= itemObj.getField({id : 'rate'});
		
		// SANBOX	Production 		Administrator user Production
		// 1025		1019 			BAA-Logistic Staff
		// 1023 	1006 			BCF-Receiving
		// 1016		1015 			BAA - Warehouse Keeper
		// 1021		1005 			BCF - Warehouse Supervisor
		
		if ((userObj.role == 1015 || userObj.role == 1005) && ((context.type == context.UserEventType.CREATE)||(context.type == context.UserEventType.EDIT)||(context.type == context.UserEventType.VIEW))){
			rate.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
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