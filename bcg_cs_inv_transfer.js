/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/currentRecord', 'N/record', 'N/search'],
    function(currentRecord, record, search) {
        function pageInit(context) {
			var curRec = context.currentRecord;
			
			var customForm = curRec.getValue('customform');
			
			if (customForm != 141){
				curRec.setValue('customform', 141);
			}
        }
        function saveRecord(context) {
			
        }
        function validateField(context) {

        }
        function fieldChanged(context) {
			var curRec = context.currentRecord;
			
			var fromLocation = curRec.getValue('location');
			var toLocation = curRec.getValue('transferlocation');
			
			if (fromLocation != '')
				var fromLocationAdd = getAddress(fromLocation);
			
			if (toLocation != '')
				var toLocationAdd = getAddress(toLocation);
			
			
			
			var fieldId = context.fieldId;
			var sublistName = context.sublistId;
			var sublistFieldName = context.fieldId;
			
			if (fieldId == 'location'){
				curRec.setValue('custbody_bcg_mit_from_loc_add', fromLocationAdd);
			}
			
			if (fieldId == 'transferlocation'){
				curRec.setValue('custbody_bcg_mit_to_location_add', toLocationAdd);
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
		
		function getAddress(idLocation){
			var masterLocation = record.load({
				type: record.Type.LOCATION,
				id: idLocation,
				isDynamic: true,
			});
			
			var address = masterLocation.getValue('mainaddress_text');
			
			return address;
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
            // saveRecord: saveRecord
        };
    });