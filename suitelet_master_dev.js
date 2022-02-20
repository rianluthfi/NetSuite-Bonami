/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
 
define(['N/ui/serverWidget'], function(serverWidget) {
 
        function onRequest(context) {
          try {
            if (context.request.method == 'GET') {
                var form = serverWidget.createForm({ title: 'Suitelet Master (DEV)' });
				
				form.addField({
                    id: 'custpage_subsidiary',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Subsidiary',
                    source: 'subsidiary'
                });
				
                form.addField({
                    id: 'custpage_account',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Account',
                    source: 'account'
                });
				
				form.addSubmitButton('Submit Approve');
			
				var sublist = form.addSublist({
					id: 'custpage_table',
					type: serverWidget.SublistType.LIST,
					label: 'Vendor Payment'
				});
				
				sublist.addMarkAllButtons();
				
				var date = sublist.addField({
					id: 'custpage_trandate',
					label: 'Date',
					type: serverWidget.FieldType.DATE
				});
				
				var tranid = sublist.addField({
					id: 'custpage_rec_id',
					label: 'Bill Payment#',
					type: serverWidget.FieldType.TEXT
				});
				
				var entity = sublist.addField({
					id: 'custpage_entity',
					label: 'Vendor',
					type: serverWidget.FieldType.TEXT
				});
				
                form.clientScriptModulePath = './suitelet_client_dev.js';
				// log.debug('Run On GET !');
                context.response.writePage(form);
            } else {
                
            }
 
          } catch(e) {
            log.debug('onRequest:error',e);
          }
        }
 
        return {
            onRequest: onRequest
        };
 
 
    });