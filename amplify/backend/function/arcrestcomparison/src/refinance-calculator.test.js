const [RefinanceMorgage, Mortgate, Comparison] = require("./refinance-calculator.js");

const [monthlyMortgagePaymentsWithExtraPayments] = require("./stolen-code.js");
// import "./components/extra-monthly-payments.js"
// test("correct calculation", () => {

//     myMortgage = new RefinanceMorgage(540000, 2.875, 360, 2616, 535837, 0, 25000, 7, 360 - 16)
//     // constructor(principal, interest_rate, term_in_months, current_monthly_payments, current_principal, cash, refinance_feeds, assumed_roi) {
//     expect((myMortgage.refinanced_monthly_payment)).toBe(2240.42);
//     expect((myMortgage.refinanced_investment_gain())).toBe(211546.26194239614);
//     expect((myMortgage.refinanced_overall_cost())).toBe(595004.9380576039);
//     expect((myMortgage.current_overall_cost())).toBe(899904)


// });

test("just to print", () => {

    myMortgage = new Mortgate(535384, 4, 344, 0, 675000, 5, 3)
    console.log(myMortgage.summary())

    newMorgage = new Mortgate(540000, 2.875, 360, 20000, 675000, 5, 3)
    console.log(newMorgage.summary())

    console.log((new Comparison(myMortgage, newMorgage, 7)).projection())

    // console.log(JSON.stringify(monthlyMortgagePaymentsWithExtraPayments(

    //     {
    //         loanAmount: 540000,
    //         interestRate: 2.875,
    //         termInMonths: 360,
    //         extraPaymentAmount: 0
    //     }
    // )))

});