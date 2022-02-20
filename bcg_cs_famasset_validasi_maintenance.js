 /**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/currentRecord', 'N/record','N/format'],
    function(currentRecord, record, format) {
        function pageInit(context) {

        }
        function saveRecord(context) {

        }
        function validateField(context) {

        }
        function fieldChanged(context) {
			var curRec = context.currentRecord;
			var fieldName = context.fieldId;
			
			var warrantyPeriod = curRec.getValue('custrecord_assetmaintwarrantyperiod');
			var warrantyStart = curRec.getValue('custrecord_assetmaintwarrantystart');
			
			if (fieldName == 'custrecord_assetmaintwarrantystart'){
				if (warrantyPeriod != ''){
					var warrantyEnd = addMonths(warrantyStart, warrantyPeriod);
					curRec.setValue('custrecord_assetmaintwarrantyend', warrantyEnd);
				}
			}
			
			var inspectionInterval = curRec.getValue('custrecord_assetmaintinspinterval');
			var lastInspection = curRec.getValue('custrecord_assetmaintlastdate');
			
			if (fieldName == 'custrecord_assetmaintlastdate'){
				if (inspectionInterval != ''){
					var nextInspectionDate = addMonths(lastInspection, inspectionInterval);
					curRec.setValue('custrecord_assetmaintnextdate', nextInspectionDate);
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
		
		// Custom Function
		function isLeapYear(year) { 
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
		}

		function getDaysInMonth(year, month) {
			return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		}

		function addMonths(date, value) {
			var d = new Date(date),
				n = date.getDate();
			d.setDate(1);
			d.setMonth(d.getMonth() + value);
			d.setDate(Math.min(n, getDaysInMonth(d.getFullYear(), d.getMonth())));
			return d;
		}
			
        return {
            // pageInit: pageInit,
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