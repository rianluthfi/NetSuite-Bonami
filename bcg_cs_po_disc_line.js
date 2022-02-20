 /**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/currentRecord', 'N/record','N/format'],
    function(currentRecord, record, format) {
        function pageInit(context) {
			var curRec = context.currentRecord;
			var sublistName = context.sublistId;
			var sublistFieldName = context.fieldId;
			
			var numLines = curRec.getLineCount({
				sublistId: 'item'
			});
			
			// alert('numLines '+numLines);
			
			for (var i = 0; i < numLines; i++){
				curRec.selectLine({
					sublistId: 'item',
					line: i
				});
				var rate = curRec.getCurrentSublistValue({
					sublistId : 'item',
					fieldId : 'rate'
				});
				var rateBeforeDiscount = curRec.getCurrentSublistValue({
					sublistId : 'item',
					fieldId : 'custcol_bcg_rate_before_discount'
				});
				// alert('rateBeforeDiscount '+rateBeforeDiscount+' rate '+rate);
				if (rateBeforeDiscount == ''){
					curRec.setCurrentSublistValue({
						sublistId : 'item',
						fieldId : 'custcol_bcg_rate_before_discount',
						value : rate
					});
					curRec.commitLine({sublistId : 'item'});
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

			if (sublistName == 'item'){
				if (sublistFieldName == 'item'){
					curRec.setCurrentSublistValue({
						sublistId : sublistName,
						fieldId : 'custcol_bcg_rate_before_discount',
						value : 0,
						ignoreFieldChange: true
					});
				}
				
				if (sublistFieldName == 'custcol_bcg_discount'){
					var rateBeforeDiscount = curRec.getCurrentSublistValue({
						sublistId : sublistName,
						fieldId : 'custcol_bcg_rate_before_discount'
					});
					var discount = curRec.getCurrentSublistValue({
						sublistId : sublistName,
						fieldId : 'custcol_bcg_discount'
					});
					var newDiscountPerc = (discount * 100)/rateBeforeDiscount;
					curRec.setCurrentSublistValue({
						sublistId : sublistName,
						fieldId : 'custcol_bcg_discount_perc',
						value : newDiscountPerc,
						ignoreFieldChange: false
					});
					var newRate = rateBeforeDiscount - discount;
					curRec.setCurrentSublistValue({
						sublistId : sublistName,
						fieldId : 'rate',
						value : newRate,
						ignoreFieldChange: false
					});
				}
				
				if (sublistFieldName == 'rate'){
					var rate = curRec.getCurrentSublistValue({
						sublistId : sublistName,
						fieldId : sublistFieldName
					});
					var rateBeforeDiscount = curRec.getCurrentSublistValue({
						sublistId : sublistName,
						fieldId : 'custcol_bcg_rate_before_discount'
					});
					var discount = curRec.getCurrentSublistValue({
						sublistId : sublistName,
						fieldId : 'custcol_bcg_discount'
					});
					if (rate > 0 && (discount == 0)){
						curRec.setCurrentSublistValue({
							sublistId : sublistName,
							fieldId : 'custcol_bcg_rate_before_discount',
							value : rate,
							ignoreFieldChange: true
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