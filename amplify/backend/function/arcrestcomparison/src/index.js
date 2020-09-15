const [RefinanceMorgage, Mortgate, Comparison] = require("./refinance-calculator.js");

exports.handler = async (event) => {

    console.log(" /api/arc/calc received request: " + JSON.stringify(event)) // todo: there must be utils about this
    if (event.body) {
        let body = JSON.parse(event.body)
        let assumed_annual_roi = body['assumed_annual_roi']

        let current_principal = body['current_principal']
        let current_interest_rate = body['current_interest_rate']
        let current_term_in_months = body['current_term_in_months']
        let current_upfront_cost = body['current_upfront_cost']

        let other_principal = body['other_principal']
        let other_interest_rate = body['other_interest_rate']
        let other_term_in_months = body['other_term_in_months']
        let other_upfront_cost = body['other_upfront_cost']

        let baseline = new Mortgate(current_principal, current_interest_rate, current_term_in_months, current_upfront_cost)
        let other = new Mortgate(other_principal, other_interest_rate, other_term_in_months, other_upfront_cost)
        let comparison = new Comparison(baseline, other, assumed_annual_roi)

        const response = {
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            statusCode: 200,
            body: JSON.stringify(comparison.cash_history()),
        };
        return response
    }
    return {
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        statusCode: 501,
        body: { error: "no valid put" },
    };
};
