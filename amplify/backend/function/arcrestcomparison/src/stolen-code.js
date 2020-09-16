// validate data based on data and rules


function _validateInputData(data, rules) {
	var result = {
		error : false,
		data : data
	};
	for(var key in rules) {
		if(rules[key].isRequired && (data[key] == undefined)) {
			result.error = key + " is required.";
			break;
		}
		if(rules[key].isNumber && ((typeof data[key] != "number") || isNaN(data[key]))) {
			result.error = key + " must be a number.";
			break;
		}
		if(rules[key].isNotNegative && (data[key] < 0)) {
			result.error = key + " must be a positive number.";
			break;
		}
		if(rules[key].isNotZero && (data[key] == 0)) {
			result.error = key + " must be greater then 0.";
			break;
		}
		if(rules[key].isNotFloat && ((data[key] % 1) !== 0)) {
			result.error = key + " must be an integer value.";
			break;
		}
	}
	return result;
};

// calculates a monthly interest rate
function calculateMonthlyInterestPayment(monthlyInterestRate,remainingBalance){
	return monthlyInterestRate * remainingBalance;
};

/*  
* Calculate monthly mortgage payments 
*	For a fixed rate Monthly Mortage:
*	c - the montly mortgage payment
*	r - the monthly interest rate, expressed as a decimal, not a percentage. Since the quoted yearly percentage rate is not a compounded rate, the monthly percentage rate is simply the yearly percentage rate divided by 12; dividing the monthly percentage rate by 100 gives r, the monthly rate expressed as a decimal.
*	N - the number of monthly payments, called the loan's term, and
*	P - the amount borrowed, known as the loan's principal.	
*	c =  [r * P * (1+r)^n )] / [(1 + r)^n - 1]
*	
*	Returns raw value of monthly mortgage payment, used in other calculations
*/
function calculateMonthlyMortgagePayment(args){
	var principal = args.loanAmount;
	var interestRate = args.interestRate == 0 ? 0 : args.interestRate/100;
	var monthlyInterestRate = interestRate == 0 ? 0 : interestRate/12;
	var numberOfMonthlyPayments = args.termInMonths;
	return (((monthlyInterestRate * principal * (Math.pow((1+monthlyInterestRate), numberOfMonthlyPayments)))) / ((Math.pow((1+monthlyInterestRate), numberOfMonthlyPayments)) - 1));
};

// calculate loan amount ( reverse the monthly mortgage payment formula)
function calculateExpectedLoanAmount(args){
	var monthlyPrincipalPayment = args.monthlyPrincipalPayment;
	var interestRate = args.interestRate == 0 ? 0 : args.interestRate/100;
	var monthlyInterestRate = interestRate == 0 ? 0 : interestRate/12;
	var numberOfMonthlyPayments = args.termInYears * 12;
	return ( ( monthlyPrincipalPayment * (Math.pow( (1+monthlyInterestRate), numberOfMonthlyPayments) -1 ) ) / (monthlyInterestRate * Math.pow((1+monthlyInterestRate),numberOfMonthlyPayments )) )
};

function formatResult(result){
	return isNaN(parseFloat( result.toFixed(2) )) ? 0 : parseFloat(result.toFixed(2));
};


function monthlyMortgagePaymentsWithExtraPayments(args){

	// validate our inputs first
	var inputData = _validateInputData(args, {
		loanAmount : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: false },
		interestRate : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false },
		termInMonths : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : true, isNotFloat: true },
		extraPaymentAmount : { isRequired : true, isNumber : true, isNotNegative : true, isNotZero : false, isNotFloat: false }
	});
	if(inputData.error) {
		return { error : inputData.error }
	}
	
	// set some working data.
	var monthlyInterestRate =  (args.interestRate/100)/12;
	var numberOfMonthlyPayments = args.termInMonths;
	var extraPaymentAmount = args.extraPaymentAmount;
	var monthlyMortgagePayment = calculateMonthlyMortgagePayment({
		loanAmount : args.loanAmount,
		interestRate : args.interestRate,
		termInMonths : args.termInMonths
	});
	var remainingBalance = args.loanAmount;
	var totalCostWithoutExtraPayments = 0;
	var totalMonthlyPaymentWithoutExtraPayments = monthlyMortgagePayment;
	// calculate monthly payment without extra payments breakdowns against the number of monthly payments
	for(var i = 0; i<= numberOfMonthlyPayments; i++){
		var monthlyInterestPayment = calculateMonthlyInterestPayment(monthlyInterestRate,remainingBalance);
		var monthlyPrincipalPayment = monthlyMortgagePayment - monthlyInterestPayment;
		// if the total monthly payment is no longer less than remaining balance, then we are at our last payment
		if( (remainingBalance - monthlyPrincipalPayment) >= 0 ){
			if(remainingBalance >= totalMonthlyPaymentWithoutExtraPayments){
				remainingBalance -= monthlyPrincipalPayment;
			}
		}else{
			totalMonthlyPaymentWithoutExtraPayments = remainingBalance;
			remainingBalance -= totalMonthlyPaymentWithoutExtraPayments;
		}
		// as long as remaining balance is greater than zero, lets keep adding it up
		if(remainingBalance > 0){
			totalCostWithoutExtraPayments += monthlyMortgagePayment;
		}
	}
	// initialize the total montlh payment
	var totalMonthlyPayment =  monthlyMortgagePayment + extraPaymentAmount;
	
	// reset that remaining balance to calculate payments with extra payments
	remainingBalance = args.loanAmount;
	// initialize monthly payments breakdown array
	var monthlyPayments = [];
	// calculate monthly payment with extra payments breakdowns against the number of monthly payments
	for(var i = 0; i<= numberOfMonthlyPayments; i++){
		var monthlyInterestPayment = calculateMonthlyInterestPayment(monthlyInterestRate,remainingBalance);
		var monthlyPrincipalPayment = monthlyMortgagePayment - monthlyInterestPayment + extraPaymentAmount;
		// if the total monthly payment is no longer less than remaining balance, then we are at our last payment
		if( (remainingBalance - monthlyPrincipalPayment) >= 0 ){
			if(remainingBalance >= totalMonthlyPayment){
				remainingBalance -= monthlyPrincipalPayment;
			}
		}else{
			totalMonthlyPayment = remainingBalance;
			remainingBalance -= totalMonthlyPayment;
		}
		// as long as remaining balance is greater than zero, lets store those in our monthly payment array
		if(remainingBalance > 0){
			// full monthly payment array
			monthlyPayments.push({
				monthlyPayment : formatResult(monthlyMortgagePayment + extraPaymentAmount),
				principalPayment :  formatResult(monthlyPrincipalPayment),
				interestPayment :  formatResult(monthlyInterestPayment),
				balance :  formatResult(remainingBalance)
			});
		}
	}

	// initialize annual breakdown array
	var annualPayments = [];
	// separate monthly payments into years
	for(var j=0; j <= Math.ceil(monthlyPayments.length); j+=12){
		annualPayments.push(monthlyPayments.slice(j,j+12));
	}
	// intialize array to join annual and monthly payment breakdowns
	var payments = [];
	// set the annual remaining balance as the loan amount to calculate the annual remaining balance breakdown
	var annualRemainingBalance = args.loanAmount;
	// sum up totals for each year
	for(var k=0; k < annualPayments.length; k++){
		// reset annual interest and principal payments for th year
		var annualInterestPayment = 0;
		var annualPrincipalPayment = 0;	
			// add up the payments of the year
			for(var x=0; x < annualPayments[k].length;x++){
				annualInterestPayment += annualPayments[k][x].interestPayment;
				annualPrincipalPayment += annualPayments[k][x].principalPayment;
			}
			
		if( (annualRemainingBalance - annualPrincipalPayment) >= 0){
			if(annualRemainingBalance >= annualPrincipalPayment){
				annualRemainingBalance -=  annualPrincipalPayment;
			}
		}else{
			annualPrincipalPayment = annualRemainingBalance;
			annualRemainingBalance -= annualPrincipalPayment;
		}
		payments.push({
			annualInterestPayment : formatResult(annualInterestPayment),
			annualPrincipalPayment : formatResult(annualPrincipalPayment),
			balance :	formatResult(annualRemainingBalance),
			monthlyBreakdown : annualPayments[k]
		});
	}

	// build response object
	var response = { 
		withExtraPayment : {
			totalMonthlyPayment : formatResult((monthlyMortgagePayment + extraPaymentAmount)),
			interestRate : args.interestRate,
			term : args.termInYears, 
			totalCost :  formatResult( monthlyPayments.length * (monthlyMortgagePayment + extraPaymentAmount)),
			payments : payments
		},
		withoutExtraPayment : {
			totalMonthlyPayment : formatResult(monthlyMortgagePayment),
			interestRate : args.interestRate,
			term : args.termInYears,
			totalCost : formatResult(totalCostWithoutExtraPayments)
		}
	};
	return response;
	
};


module.exports = [monthlyMortgagePaymentsWithExtraPayments];