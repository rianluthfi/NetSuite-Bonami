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
		
		var subsidiary = newRecord.getValue('subsidiary');
		
		if (context.type == context.UserEventType.DELETE){
			log.debug('DELETE '+newRecord.id);
            return;
		}
		
		if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT){
			var numLines = newRecord.getLineCount({
				sublistId: 'item'
			});
			
			if (numLines > 0){
				var tRecord = record.load({
					type: record.Type.TRANSFER_ORDER, 
					id: context.newRecord.id,
					isDynamic: true,
				});
				for (var i = 0; i < numLines; i++){
					var itemId = newRecord.getSublistValue({
						sublistId : 'item',
						fieldId : 'item',
						line : i
					});
					
					var description = newRecord.getSublistValue({
						sublistId : 'item',
						fieldId : 'description',
						line : i
					});
					if (description == ''){
						log.debug('cari displayName item untuk Description');
						var displayName = getDisplayName(itemId);
						
						tRecord.selectLine({
							sublistId : 'item',
							line : i
						});
						tRecord.setCurrentSublistValue({
							sublistId : 'item',
							fieldId : 'description',
							value : displayName
						});
						tRecord.commitLine('item');
					}
				}
				tRecord.save();
			}
		}
    }
	
	function getDisplayName(recordId){
		// type InvtPart
		// type Assembly
		var displayName = '';
		var itemType = getItemType(recordId);
		
		switch(itemType) {
			case 'InvtPart':
				var mRecord = record.load({
					type: record.Type.INVENTORY_ITEM, 
					id: recordId,
					isDynamic: true,
				});
				displayName = mRecord.getValue('displayname');
				return displayName;
			break;
			case 'Assembly':
				var mRecord = record.load({
					type: record.Type.ASSEMBLY_ITEM, 
					id: recordId,
					isDynamic: true,
				});
				displayName = mRecord.getValue('displayname');
				return displayName;
			break;
			default:
			break;
		}
	}
	
	function getItemType(recordId) {
		var recTypeLookup = search.lookupFields({
			type: search.Type.ITEM,
			id: recordId,
			columns: 'type'
		});
		return recTypeLookup['type'][0].value;
	}

	
    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});