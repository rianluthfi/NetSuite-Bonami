/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/currentRecord', 'N/record', 'N/runtime'],
    function(currentRecord, record, runtime) {
        function pageInit(context) {
			var curRec = context.currentRecord;
			
			var userObj  = runtime.getCurrentUser();
			var userRole = userObj.role;
			
			// 1029	(DEV) BAA - Store Admin Staff
			// 1016	Store Admin Staff - PT. Bon Ami Abadi
			if (userRole == 1029 || userRole == 1016){
				var userLocation = userObj.location;
				
				if (userLocation == ''){
					alert('Location di Employee belum di set, silahkan hubungi Administrator !');
				}else{
					curRec.setValue('transferlocation', userLocation);
				}
			}else{
				alert('Form ini khusus untuk Store Admin Staff - PT. Bon Ami Abadi, silahkan hubungi Administrator !');
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