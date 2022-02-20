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
		var form = context.form;
      
        var userRole = runtime.getCurrentUser().role;
      
        if (userRole != 3){
          	var fKitCode = form.getField('cseg_bcg_kit_code');
		
            fKitCode.updateDisplayType({
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
		var newRecord = context.newRecord;
		
		var itemid 		= newRecord.getValue('itemid');
		var displayname = newRecord.getValue('displayname');
		var kitcode		= newRecord.getValue('cseg_bcg_kit_code');
		
		var kitsegmentname = itemid+' '+displayname;
		
		if (context.type === context.UserEventType.CREATE){
			var segKitCode = record.create({
			   type: 'customrecord_cseg_bcg_kit_code',
			   isDynamic: true
			});
			
			segKitCode.setValue('name', kitsegmentname);
			segKitCode.save();
			
			newRecord.setValue('cseg_bcg_kit_code', segKitCode.id);
		}
		
		if (context.type === context.UserEventType.EDIT){
			if (kitcode == '' || kitcode == undefined){
				var segKitCode = record.create({
				   type: 'customrecord_cseg_bcg_kit_code',
				   isDynamic: true
				});
				
				segKitCode.setValue('name', kitsegmentname);
				segKitCode.save();
				
				newRecord.setValue('cseg_bcg_kit_code', segKitCode.id);
			}
			else{
				var oldRecord = context.oldRecord;
				var itemid_old 		= oldRecord.getValue('itemid');
				var displayname_old = oldRecord.getValue('displayname');
		
				if (itemid != itemid_old || displayname != displayname_old){
					var segKitCode = record.load({
					   type: 'customrecord_cseg_bcg_kit_code',
					   id : kitcode,
					   isDynamic: true
					});
					
					segKitCode.setValue('name', kitsegmentname);
					segKitCode.save();
				}
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
		var newRecord = context.newRecord;
		
		if (context.type === context.UserEventType.DELETE){
			var kitCode = newRecord.getValue('cseg_bcg_kit_code');
			
			if (kitCode != ''){
				newRecord.setValue('cseg_bcg_kit_code', null);
				
				var customRecord = record.delete({
				   type: 'customrecord_cseg_bcg_kit_code',
				   id : kitCode
				});
			}
		}
	}
	
    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
