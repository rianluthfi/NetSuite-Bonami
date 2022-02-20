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
		
		var estimatedtotal 	= form.getField({id : 'estimatedtotal'});
		var total 			= form.getField({id : 'total'});
		
		var povendor		= itemObj.getField({id : 'povendor'});
		var vendorname		= itemObj.getField({id : 'vendorname'});
		var estimatedamount = itemObj.getField({id : 'estimatedamount'});
		var amount			= itemObj.getField({id : 'amount'});
		
		estimatedtotal.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
		total.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
		
		// Selain Admin (3)
		if (userObj.role != 3 && ((context.type == context.UserEventType.CREATE)||(context.type == context.UserEventType.EDIT)||(context.type == context.UserEventType.VIEW))){
			// povendor.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
			vendorname.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
			estimatedamount.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
			amount.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
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