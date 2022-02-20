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
		
		var subsidiary = newRecord.getValue('subsidiary');
		
		if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT){
			
			if (subsidiary.length == 1){
				var newSubsidiary = getSubsidiaryName(subsidiary[0]);
				
				newRecord.setValue('custitem_bcg_subsidiary', newSubsidiary);
			}
			else if (subsidiary.length > 1){
				var temp = '';
				for (var i = 0; i < subsidiary.length; i++){
					var newSubsidiary = getSubsidiaryName(subsidiary[i]);
					var temp = temp+newSubsidiary+'|';
				}
				newRecord.setValue('custitem_bcg_subsidiary', temp.slice(0,-1));
			}
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
	
	
	function getSubsidiaryName(id){
		var subsidiary = '';
		var sRecord = record.load({
			type: record.Type.SUBSIDIARY, 
			id: id,
			isDynamic: true,
		});
		var nameSub = sRecord.getValue('name');
		var parentSub = sRecord.getText('parent');
		
		var newSubsidiary = '';
		if (parentSub != ''){
			newSubsidiary = parentSub + ' : '+nameSub;
		}else{
			newSubsidiary = nameSub;
		}
		return newSubsidiary;
	}
	
    return {
        // beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    };
    
});