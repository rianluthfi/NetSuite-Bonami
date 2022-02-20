/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/currentRecord', 'N/record', 'N/search'],
    function(currentRecord, record, search) {
        function pageInit(context) {
			var curRec = context.currentRecord;
			
			var line = curRec.getLineCount('item');
			
			var createdFrom = curRec.getValue('createdfrom');
			
			
			
			// alert('type '+recordType['type'][0].value);
			
			if (createdfrom != '' && line > 0){
				var recordType = search.lookupFields({
					 type: search.Type.TRANSACTION,
					 id: createdFrom,
					 columns: 'type'
				});
			
				if (recordType['type'][0].value == 'TrnfrOrd'){
					return;
				}
				else if (recordType['type'][0].value == 'RtnAuth'){
					return;
				}
				else{
					if (line > 0){
						for (var i = 0; i < line; i++){
						
							curRec.selectLine({
								sublistId : 'item',
								line : i
							});
							
							var quantity = curRec.getCurrentSublistValue({
								sublistId : 'item',
								fieldId : 'quantity',
							});
							
							var rate = curRec.getCurrentSublistValue({
								sublistId : 'item',
								fieldId : 'rate',
							});
							
							curRec.setCurrentSublistValue({
								sublistId : 'item',
								fieldId : 'custcol_bcg_total_item_receipt',
								value : quantity * rate
							});
						}
						curRec.commitLine({
							sublistId : 'item'
						});
					}
				}
			}
        }
        function saveRecord(context) {
			
        }
        function validateField(context) {

        }
        function fieldChanged(context) {
			var curRec = context.currentRecord;
			var sublistName = context.sublistId;
			var sublistFieldName = context.fieldId;
			
			var createdFrom = curRec.getValue('createdfrom');
			
			var recordType = search.lookupFields({
				 type: search.Type.TRANSACTION,
				 id: createdFrom,
				 columns: 'type'
			});
			
			if (recordType['type'][0].value == 'TrnfrOrd'){
				return;
			}else{
				if (sublistName == 'item'){
					if (sublistFieldName == 'quantity'){
						var tempQuantity = 0;
						var currIndex = curRec.getCurrentSublistIndex({
							sublistId: 'item'
						});
						curRec.selectLine({
							sublistId : 'item',
							line : currIndex
						});
						var quantity = curRec.getCurrentSublistValue({
							sublistId : sublistName,
							fieldId : 'quantity',
						});
						var rate = curRec.getCurrentSublistValue({
							sublistId : 'item',
							fieldId : 'rate',
						});
						
						curRec.setCurrentSublistValue({
							sublistId : 'item',
							fieldId : 'custcol_bcg_total_item_receipt',
							value : quantity * rate
						});
					}
				}
			}
        }
        function postSourcing(context) {
			
        }
        function lineInit(context) {
			
        }
        function validateDelete(context) {

        }
        function validateInsert(context) {
			
        }
        function validateLine(context) {
			
        }
        function sublistChanged(context) {

        }
        return {
			pageInit: pageInit,
            // fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            // saveRecord: saveRecord
        };
    });