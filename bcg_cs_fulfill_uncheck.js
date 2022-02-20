/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/currentRecord'],
    function(currentRecord) {
        function pageInit(context) {
			var curRec = context.currentRecord;
			
			var subsidiary = curRec.getValue('subsidiary');
			
			if (subsidiary == 8){
				var lineCount = curRec.getLineCount({
					sublistId : 'item'
				});
				
				for (var i = 0; i < lineCount; i++){
					curRec.selectLine({
						sublistId: 'item',
						line: i
					});
					curRec.setCurrentSublistValue({
						sublistId: 'item',
						fieldId: 'itemreceive',
						value: false,
						ignoreFieldChange: false
					});
				}
			}
        }
        function saveRecord(context) {
			
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