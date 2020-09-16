const [RefinanceMorgage, Mortgate, Comparison] = require("./refinance-calculator.js");

exports.handler = async (event) => {

    if (event.body) {
        let body = JSON.parse(event.body)

        console.log("request body: " + event.body)
        let assumed_annual_roi = body['assumed_annual_roi']

        let current_principal = body['current_principal']
        let current_interest_rate = body['current_interest_rate']
        let current_term_in_months = body['current_term_in_months']
        let current_upfront_cost = body['current_upfront_cost']

        let other_principal = body['other_principal']
        let other_interest_rate = body['other_interest_rate']
        let other_term_in_months = body['other_term_in_months']
        let other_upfront_cost = body['other_upfront_cost']


        let property_value = body['property_value']
        let assumed_property_annual_appreciation = body['assumed_property_annual_appreciation']
        let liquidation_cost_rate = body['liquidation_cost_rate']
        let assumed_inflation = body['assumed_inflation']


        let baseline = new Mortgate(current_principal, current_interest_rate, current_term_in_months, current_upfront_cost, property_value, assumed_property_annual_appreciation, liquidation_cost_rate)
        let other = new Mortgate(other_principal, other_interest_rate, other_term_in_months, other_upfront_cost, property_value, assumed_property_annual_appreciation, liquidation_cost_rate)
        let comparison = new Comparison(baseline, other, assumed_annual_roi) // this only returns cash position now, can return, principal, (sell off cash position = net worth)

        const response = {
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            statusCode: 200,
            body: JSON.stringify(comparison.projection()),
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
