 /**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/currentRecord', 'N/record','N/format'],
    function(currentRecord, record, format) {
        function pageInit(context) {

        }
        function saveRecord(context) {
			var curRec = context.currentRecord;
			
			var receiveBy = curRec.getValue('duedate');
			var numLines = curRec.getLineCount({
				sublistId: 'item'
			});
			
			// Masuk receiveBy tidak sama dengan kosong dan item lebih dari nol
			if (receiveBy != '' && numLines > 0){
				for (var i = 0; i < numLines; i++){
					var expectedReceiptDate = curRec.getSublistValue({
						sublistId : 'item',
						fieldId : 'expectedreceiptdate',
						line : i
					});
					
					if (expectedReceiptDate == ''){
						curRec.selectLine({
							sublistId: 'item',
							line: i
						});
						curRec.setCurrentSublistValue({
							sublistId : 'item',
							fieldId : 'expectedreceiptdate',
							value : receiveBy,
							ignoreFieldChange: true
						});
						curRec.commitLine({sublistId : 'item'});
					}
				}
				return true;
			}
			else{
				return true;
			}
        }
        function validateField(context) {
			
        }
        function fieldChanged(context) {
			
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
			// alert('Validate Line');
			var curRec = context.currentRecord;
			
			var location = curRec.getValue('location');
			var transType = curRec.getValue('cseg1');
			var receiveBy = curRec.getValue('duedate');

			if (location == '' || transType == ''){
				alert('Location dan Transaction Type tidak boleh Kosong !');
			}
			else{
				// Validasi saat estimateAmount sama dengan 0
				var estimateAmount = curRec.getCurrentSublistValue({
					sublistId : 'item',
					fieldId : 'estimatedamount'
				});
				
				if (estimateAmount == 0){
					curRec.setCurrentSublistValue({
						sublistId: 'item',
						fieldId: 'estimatedamount',
						value: 1,
						ignoreFieldChange: true
					});
				}
				
				// Validasi saat receiveBy dan expectedReceiptDate tidak sama dengan kosong
				var expectedReceiptDate = curRec.getCurrentSublistValue({
					sublistId : 'item',
					fieldId : 'expectedreceiptdate'
				});
				
				if (receiveBy != '' & expectedReceiptDate == ''){
					curRec.setCurrentSublistValue({
						sublistId: 'item',
						fieldId: 'expectedreceiptdate',
						value: receiveBy,
						ignoreFieldChange: true
					});
				}
				return true;
			}
        }
        function sublistChanged(context) {
			
        }
			
        return {
            // pageInit: pageInit,
            // fieldChanged: fieldChanged,
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