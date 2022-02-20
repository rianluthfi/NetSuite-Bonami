/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/ui/serverWidget', 'N/runtime', 'N/search', 'N/error'],

function(record, serverWidget, runtime, search, error) {
   
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
		var form = context.form;
		
		var relatedMirror = form.getField('custbody_bcg_related_mirror');
		
		log.debug('relatedMirror '+relatedMirror);
		
		if (relatedMirror != null){
			relatedMirror.updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE});
			
			if (context.type === context.UserEventType.CREATE){
				relatedMirror.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
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
    function beforeSubmit(context) {
		var newRecord = context.newRecord;
		
		if (context.type == context.UserEventType.DELETE){
			var relatedMirror = newRecord.getValue('custbody_bcg_related_mirror');
			
			if (relatedMirror != ''){
				deleteMirror(relatedMirror);
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
		
		if (context.type == context.UserEventType.DELETE){
			return false;
		}
		
		var newRecord = context.newRecord;
		
		var relatedMirror	= newRecord.getValue('custbody_bcg_related_mirror');
		
		if (context.type == context.UserEventType.CREATE){
			createMirror(newRecord);
		}
		
		if (context.type == context.UserEventType.EDIT){
			if (relatedMirror != ''){
				editMirror(newRecord, relatedMirror)
			}else{
				createMirror(newRecord);
			}
		}
    }
	
	function setRelated(idInvTransf, idMirror){
		
		var mInvTransfer = record.load({
			type: record.Type.INVENTORY_TRANSFER,
			id: idInvTransf,
			isDynamic: true,
		});
		
		
		mInvTransfer.setValue('custbody_bcg_related_mirror', idMirror);
		
		
		mInvTransfer.save();
	}
	
	function deleteMirror(idMirror){
		var mitRecord = record.load({
			type: 'customtransaction_bcg_mit',
			id : idMirror,
			isDynamic: true
		});
		
		mitRecord.setValue('custbody_bcg_mit_related_trans', '');
		
		mitRecord.save();
		
		var delMirror = record.delete({
		   type: 'customtransaction_bcg_mit',
		   id: idMirror,
		});
	}
	
	function editMirror(newRecord, idMirror){
		var tranid			= newRecord.getValue('tranid');
		var date			= newRecord.getValue('trandate');
		var subsidiary 		= newRecord.getValue('subsidiary');
		var fromLocation	= newRecord.getValue('location');
		var toLocation		= newRecord.getValue('transferlocation');
		var memo			= newRecord.getValue('memo');
		var fromLocationAdd	= newRecord.getValue('custbody_bcg_mit_from_loc_add');
		var toLocationAdd	= newRecord.getValue('custbody_bcg_mit_to_location_add');
		
		var mitRecord = record.load({
		   type: 'customtransaction_bcg_mit',
		   id : idMirror,
		   isDynamic: true
		});
		
		mitRecord.setValue('custbody_bcg_mit_docnum', tranid);
		mitRecord.setValue('trandate', date);
		mitRecord.setValue('subsidiary', subsidiary);
		mitRecord.setValue('custbody_bcg_mit_fromlocation', fromLocation);
		mitRecord.setValue('custbody_bcg_mit_tolocation', toLocation);
		mitRecord.setValue('memo', memo);
		mitRecord.setValue('custbody_bcg_mit_from_loc_add', fromLocationAdd);
		mitRecord.setValue('custbody_bcg_mit_to_location_add', toLocationAdd);
		mitRecord.setValue('custbody_bcg_mit_related_trans', newRecord.id);
		
		var tempLineMirror = mitRecord.getLineCount({
			sublistId : 'line'
		});
		
		if (tempLineMirror > 0){
			for (var i = 0; i <= tempLineMirror-1; tempLineMirror--){
				mitRecord.removeLine({
					sublistId: 'line',
					line: tempLineMirror-1,
					ignoreRecalc: true
				});
			}
		}

		var numLines = newRecord.getLineCount({
			sublistId: 'inventory'
		});
		
		var lineCount = mitRecord.selectNewLine({
			sublistId : 'line'
		});
		
		if (numLines > 0){
			for (var i = 0; i < numLines; i++){
				var item = newRecord.getSublistValue({
					sublistId : 'inventory',
					fieldId	: 'item',
					line : i
				});
				
				var quantity = newRecord.getSublistValue({
					sublistId : 'inventory',
					fieldId	: 'adjustqtyby',
					line : i
				});
				
				var units = newRecord.getSublistValue({
					sublistId : 'inventory',
					fieldId	: 'units',
					line : i
				});
				
				var description = newRecord.getSublistValue({
					sublistId : 'inventory',
					fieldId	: 'description',
					line : i
				});
				
				// log.debug('Line', 'line '+i+' item '+item+'; quantity '+quantity+'; units '+units);
				
				mitRecord.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'custcol_bcg_mit_item',
					value: item
				});
				
				mitRecord.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'custcol_bcg_mit_quantity',
					value: quantity
				});
				
				mitRecord.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'custcol_bcg_mit_unit',
					value: units
				});
				
				mitRecord.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'memo',
					value: description
				});
				
				mitRecord.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'account',
					value: 820 
				}); // Inventory In Transit (But it will not posted)
				
				mitRecord.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'amount',
					value: 1 
				}); // value always 0
				
				mitRecord.commitLine({
					sublistId: 'line'
				});
			}
		}
		
		mitRecord.save();
	}
	
	function createMirror(newRecord){
		
		var tranid			= newRecord.getValue('tranid');
		var date			= newRecord.getValue('trandate');
		var subsidiary 		= newRecord.getValue('subsidiary');
		var fromLocation	= newRecord.getValue('location');
		var toLocation		= newRecord.getValue('transferlocation');
		var memo			= newRecord.getValue('memo');
		var fromLocationAdd	= newRecord.getValue('custbody_bcg_mit_from_loc_add');
		var toLocationAdd	= newRecord.getValue('custbody_bcg_mit_to_location_add');
		
		var mitRecord = record.create({
		   type: 'customtransaction_bcg_mit',
		   isDynamic: true
		});
		
		mitRecord.setValue('custbody_bcg_mit_docnum', tranid);
		mitRecord.setValue('trandate', date);
		mitRecord.setValue('subsidiary', subsidiary);
		mitRecord.setValue('custbody_bcg_mit_fromlocation', fromLocation);
		mitRecord.setValue('custbody_bcg_mit_tolocation', toLocation);
		mitRecord.setValue('memo', memo);
		mitRecord.setValue('custbody_bcg_mit_from_loc_add', fromLocationAdd);
		mitRecord.setValue('custbody_bcg_mit_to_location_add', toLocationAdd);
		mitRecord.setValue('custbody_bcg_mit_related_trans', newRecord.id);


		var numLines = newRecord.getLineCount({
			sublistId: 'inventory'
		});
		
		var lineCount = mitRecord.selectNewLine({
			sublistId : 'line'
		});
		
		if (numLines > 0){
			for (var i = 0; i < numLines; i++){
				var item = newRecord.getSublistValue({
					sublistId : 'inventory',
					fieldId	: 'item',
					line : i
				});
				
				var quantity = newRecord.getSublistValue({
					sublistId : 'inventory',
					fieldId	: 'adjustqtyby',
					line : i
				});
				
				var units = newRecord.getSublistValue({
					sublistId : 'inventory',
					fieldId	: 'units',
					line : i
				});
				
				var description = newRecord.getSublistValue({
					sublistId : 'inventory',
					fieldId	: 'description',
					line : i
				});
				
				// log.debug('Line', 'line '+i+' item '+item+'; quantity '+quantity+'; units '+units);
				
				mitRecord.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'custcol_bcg_mit_item',
					value: item
				});
				
				mitRecord.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'custcol_bcg_mit_quantity',
					value: quantity
				});
				
				mitRecord.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'custcol_bcg_mit_unit',
					value: units
				});
				
				mitRecord.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'memo',
					value: description
				});
				
				mitRecord.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'account',
					value: 820 
				}); // Inventory In Transit (But it will not posted)
				
				mitRecord.setCurrentSublistValue({
					sublistId: 'line',
					fieldId: 'amount',
					value: 1 
				}); // value always 0
				
				mitRecord.commitLine({
					sublistId: 'line'
				});
			}
		}
		
		mitRecord.save();
		
		setRelated(newRecord.id, mitRecord.id);
	}
	
    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});