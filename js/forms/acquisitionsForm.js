/*
**************************************************************************************************************************
** CORAL Resources Module v. 1.0
**
** Copyright (c) 2010 University of Notre Dame
**
** This file is part of CORAL.
**
** CORAL is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
**
** CORAL is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License along with CORAL.  If not, see <http://www.gnu.org/licenses/>.
**
**************************************************************************************************************************
*/

 $(function(){
	$('.date-pick').datePicker({startDate:'01/01/1996'});

	//bind all of the inputs

	 $("#submitOrder").click(function () {
		submitOrderForm();
	 });


	//do submit if enter is hit
	$('#orderNumber').keyup(function(e) {
	      if(e.keyCode == 13) {
		submitOrderForm();
	      }
	}); 

	//do submit if enter is hit
	$('#systemNumber').keyup(function(e) {
	      if(e.keyCode == 13) {
		submitOrderForm();
	      }
	}); 


	//the following are all to change the look of the inputs when they're clicked
	$('.changeDefault').live('focus', function(e) {
		if (this.value == this.defaultValue){
			this.value = '';
		}
	});

	 $('.changeDefault').live('blur', function() {
		if(this.value == ''){
			this.value = this.defaultValue;
		}		
	 });

	
    	$('.changeInput').addClass("idleField");
    	
	$('.changeInput').live('focus', function() {


		$(this).removeClass("idleField").addClass("focusField");

		if(this.value != this.defaultValue){
			this.select();
		}

	 });


	 $('.changeInput').live('blur', function() {
		$(this).removeClass("focusField").addClass("idleField");
	 });




	$('select').addClass("idleField");
	$('select').live('focus', function() {
		$(this).removeClass("idleField").addClass("focusField");

	});

	$('select').live('blur', function() {
		$(this).removeClass("focusField").addClass("idleField");
	});



	$('textarea').addClass("idleField");
	$('textarea').focus(function() {
		$(this).removeClass("idleField").addClass("focusField");
	});
	    
	$('textarea').blur(function() {
		$(this).removeClass("focusField").addClass("idleField");
	});




	$(".remove").live('click', function () {
	    $(this).parent().parent().parent().fadeTo(400, 0, function () { 
		$(this).remove();
	    });
	    return false;
	});



	$(".addPayment").live('click', function () {

                var pYr = $('.newPaymentTable').children().children().children().children('.paymentYear').val();
		var fName = $('.newPaymentTable').children().children().children().children('.fundName').val();
		var typeID = $('.newPaymentTable').children().children().children().children('.orderTypeID').val();
		var pAmount = $('.newPaymentTable').children().children().children().children('.paymentAmount').val();
                var pDetail = $('.newPaymentTable').children().children().children().children('.paymentDetail').val();
						
		if (((pAmount == '') || (pAmount == null)) && ((fName == '') || (fName == null))){
			$('#div_errorPayment').html('Error - Either fund or price is required');
			return false;		
		}else if((typeID == '') || (typeID == null)){
			$('#div_errorPayment').html('Error - order type is a required field');
			return false;
		}else if ((pAmount != '') && (pAmount != null) && (isAmount(pAmount) === false)){
			$('#div_errorPayment').html('Error - price is not numeric');
			return false;		
		}else{

			//we're going to strip out the $ of the payment amount
			pAmount = pAmount.replace('$','');
		
			$('#div_errorPayment').html('');
			
			//first copy the new payment being added
			var originalTR = $('.newPaymentTR').clone();

			//next append to to the existing table
			//it's too confusing to chain all of the children.
			$('.newPaymentTR').appendTo('.paymentTable');

			$('.newPaymentTR').children().children().children('.addPayment').attr({
			  src: 'images/cross.gif',
			  alt: 'remove this payment',
			  title: 'remove this payment'
			});
			$('.newPaymentTR').children().children().children('.addPayment').addClass('remove').css("text-align","center");
			$('.newPaymentTR').children().children('.paymentAmount').val(pAmount);
			$('.paymentTypeID').addClass('changeSelect');
			$('.paymentTypeID').addClass('idleField');
			$('.paymentTypeID').css("background-color","");
			$('.paymentName').addClass('changeInput');
			$('.paymentName').addClass('idleField');

			
			$('.addPayment').removeClass('addPayment');
			$('.newPaymentTR').removeClass('newPaymentTR');

			//next put the original clone back, we just need to reset the values
			originalTR.appendTo('.newPaymentTable');
			$('.newPaymentTable').children().children().children().children('.orderTypeID').val('');
                        $('.newPaymentTable').children().children().children().children('.paymentYear').val('');
			$('.newPaymentTable').children().children().children().children('.fundName').val('');
			$('.newPaymentTable').children().children().children().children('.paymentAmount').val('');
                        $('.newPaymentTable').children().children().children().children('.paymentDetail').val('');
			

			return false;
		}
	});


});



function submitOrderForm(){
	
	purchaseSitesList ='';
	$(".check_purchaseSite:checked").each(function(id) {
	      purchaseSitesList += $(this).val() + ":::";
	}); 
	
	orderTypeList ='';
	$(".orderTypeID").each(function(id) {
	      orderTypeList += $(this).val() + ":::";
	}); 

        paymentYearList ='';
        $(".paymentYear").each(function(id) {
              paymentYearList += $(this).val() + ":::";
        });

	fundNameList ='';
	$(".fundName").each(function(id) {
	      fundNameList += $(this).val() + ":::";
	}); 

	paymentAmountList ='';
	$(".paymentAmount").each(function(id) {
	      paymentAmountList += $(this).val() + ":::";
	}); 

	currencyCodeList ='';
	$(".currencyCode").each(function(id) {
	      currencyCodeList += $(this).val() + ":::";
	}); 
	
        paymentDetailList ='';
        $(".paymentDetail").each(function(id) {
              paymentDetailList += $(this).val() + ":::";
        });


	if (validateForm() === true) {
		$('#submitOrder').attr("disabled", "disabled"); 
		  $.ajax({
			 type:       "POST",
			 url:        "ajax_processing.php?action=submitAcquisitions",
			 cache:      false,
			 data:       { resourceID: $("#editResourceID").val(), acquisitionTypeID: $("#acquisitionTypeID").val(), orderNumber: $("#orderNumber").val(), systemNumber: $("#systemNumber").val(), subscriptionStartDate: $("#subscriptionStartDate").val(), subscriptionEndDate: $("#subscriptionEndDate").val(), invoiceDate: $("#invoiceDate").val(), subscriptionAlertEnabledInd: $("#subscriptionAlertEnabledInd:checked").val(), invoiceAlertEnabledInd: $("#invoiceAlertEnabledInd:checked").val(), purchaseSites: purchaseSitesList, orderTypes: orderTypeList, paymentYears: paymentYearList, fundNames: fundNameList, paymentAmounts: paymentAmountList, currencyCodes: currencyCodeList, paymentDetails: paymentDetailList, },
			 success:    function(html) {
				if (html){
					$("#span_errors").html(html);
					$("#submitOrder").removeAttr("disabled");
				}else{
					kill();
					window.parent.tb_remove();
					window.parent.updateAcquisitions();
					return false;
				}					

			 }


		 });
	 }

}





 
 function validateForm (){
 	myReturn=0;

        var pYr = $('.newPaymentTable').children().children().children().children('.paymentYear').val();
	var fName = $('.newPaymentTable').children().children().children().children('.fundName').val();
	var typeID = $('.newPaymentTable').children().children().children().children('.orderTypeID').val();
	var pAmount = $('.newPaymentTable').children().children().children().children('.paymentAmount').val();
        var pDetail = $('.newPaymentTable').children().children().children().children('.paymentDetail').val();

	//also perform same checks on the current record in case add button wasn't clicked
	if ((((pAmount == '') || (pAmount == null)) && ((fName == '') || (fName == null))) && ((pAmount != '') || (fName != ''))){
		$('#div_errorPayment').html('Error - Either price or fund is required');
		myReturn="1";		

	}

	if(((typeID == '') || (typeID == null)) && ((pAmount != '') || (fName != ''))){
		$('#div_errorPayment').html('Error - order type is a required field');
		myReturn="1";
	}

	
	if ((pAmount != '') && (pAmount != null) && (isAmount(pAmount) === false)){
		$('#div_errorPayment').html('Error - price is not numeric');
		myReturn="1";		
	}
 	
 	 
 	if (myReturn == "1"){
		return false; 	
 	}else{
 		return true;
 	}
}
 





//kill all binds done by jquery live
function kill(){

	$('.addPayment').die('click'); 
	$('.changeDefault').die('blur');
	$('.changeDefault').die('focus');
	$('.changeInput').die('blur');
	$('.changeInput').die('focus');
	$('.select').die('blur');
	$('.select').die('focus');
	$('.remove').die('click');

}
