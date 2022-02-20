/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/currentRecord', 'N/record'],
    function(currentRecord, record) {
        function pageInit(context) {
			var curRec = context.currentRecord;
			
			var line = curRec.getLineCount('item');
			
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
					
					var threshold = curRec.getCurrentSublistValue({
						sublistId : 'item',
						fieldId : 'custcol_bcg_threshold',
					});
					
					// Set nilai Threshold
					if (threshold == ''){
						var newThreshold = quantity + (quantity * 0.2);
						curRec.setCurrentSublistValue({
							sublistId : 'item',
							fieldId : 'custcol_bcg_threshold',
							value : newThreshold
						});
					}
				}
				curRec.commitLine({
					sublistId : 'item'
				});
			}
        }
        function saveRecord(context) {
			var curRec = context.currentRecord;
			var sublistName = context.sublistId;
			var line = curRec.getLineCount('item');

			var invalidRecipt = 0;
			for (var i = 0; i < line; i++){
				curRec.selectLine({
					sublistId : 'item',
					line : i
				});
				var itemReceive = curRec.getCurrentSublistValue({
					sublistId : 'item',
					fieldId : 'itemreceive'
				});
				if (itemReceive){
					var quantity = curRec.getCurrentSublistValue({
						sublistId : 'item',
						fieldId : 'quantity'
					});
					var threshold = curRec.getCurrentSublistValue({
						sublistId : 'item',
						fieldId : 'custcol_bcg_threshold'
					});
					// alert('loop ke-'+i+' quantity '+quantity+' n threshold '+threshold);
					if (quantity > threshold){
						alert('Quantity item pada line : '+(i+1)+' yang diterima tidak boleh lebih dari '+threshold+' (Threshold 20% )');
						invalidRecipt += 1;
					}
				}
			}
			if (invalidRecipt > 0){
				return false;
			}else{
				return true;
			}
        }
        function validateField(context) {

        }
        function fieldChanged(context) {
			var curRec = context.currentRecord;
			var sublistName = context.sublistId;
			var sublistFieldName = context.fieldId;
			
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
					var item = curRec.getCurrentSublistValue({
						sublistId : sublistName,
						fieldId : 'itemdescription',
					});
					var threshold = curRec.getCurrentSublistValue({
						sublistId : sublistName,
						fieldId : 'custcol_bcg_threshold',
					});
					var quantity = curRec.getCurrentSublistValue({
						sublistId : sublistName,
						fieldId : 'quantity',
					});
					if (quantity > 0 && tempQuantity == 0){
						var tempQuantity = quantity;
					}
					if (quantity > threshold){
						alert('Quantity pada item line ke '+(currIndex+1)+' tidak boleh melebihi Threshold '+threshold+' !');
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
            fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            saveRecord: saveRecord
        };
    });