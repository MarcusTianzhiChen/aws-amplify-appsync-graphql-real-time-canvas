

var Finance = require('financejs');

class RefinanceMorgage {

    constructor(principal, interest_rate, term_in_months, current_monthly_payments, current_principal, cash, refinance_fees, assumed_roi, current_remaining_terms_in_months) {

        var finance = new Finance();
        this.refinanced_monthly_payment = finance.AM(principal, interest_rate, term_in_months, 1)
        this.principal = principal;
        this.monthly_interest_rate = interest_rate * 1.0 / 12;
        this.refinanced_terms_in_months = term_in_months;
        this.current_monthly_payment = current_monthly_payments;
        this.current_principal = current_principal
        this.cash = cash;
        this.refinance_fees = refinance_fees;
        this.assumed_roi = assumed_roi * 1.0 / 100.0
        this.assumed_monthly_roi = this.assumed_roi / 12
        this.current_remaining_terms_in_months = current_remaining_terms_in_months
    }


    refinanced_investment_gain() {
        let investment = this.cash - this.refinance_fees;
        let current_remaining_terms_in_months_local = this.current_remaining_terms_in_months

        for (let i = 0; i < this.refinanced_terms_in_months; i++) {
            investment = investment * (1 + this.assumed_monthly_roi)

            if (current_remaining_terms_in_months_local > 0) {
                investment += (this.current_monthly_payment - this.refinanced_monthly_payment)
                current_remaining_terms_in_months_local--;
            } else {
                // current_principal_local is the amount left that needs to be paid WITHOUT refinance
                investment -= this.refinanced_monthly_payment
            }

            // console.log(investment, i, current_principal_local)
        }
        return investment
    }

    current_overall_cost() {
        return this.current_monthly_payment * this.current_remaining_terms_in_months
    }

    refinanced_overall_total_payment() {
        return (this.refinanced_monthly_payment * this.refinanced_terms_in_months)
    }

    refinanced_overall_cost() {
        return (this.refinanced_monthly_payment * this.refinanced_terms_in_months) - this.refinanced_investment_gain()
    }

    summary() {

        let str = "Refinanced Principal: " + this.principal + "\n" +
            "Refinanced Interest Rate: " + this.interest_rate + "\n" +
            "Refinanced Term in Months: " + this.refinanced_terms_in_months + "\n" +
            "Refinanced Overall Total Payment: " + this.refinanced_overall_total_payment() + "\n" +
            "Refinanced Investment Gain: " + this.refinanced_investment_gain() + "\n" +
            "Refinanced Overall Cost: " + this.refinanced_overall_cost() + "\n"

        return str
    }
}


class Mortgage {

    constructor(principal, interest_rate, term_in_months, upfront_cost) {
        this.upfront_cost = upfront_cost
        this.finance = new Finance();
        this.monthly_payment = this.finance.AM(principal, interest_rate, term_in_months, 1)
        this.principal = principal;
        this.interest_rate = interest_rate
        this.monthly_interest_rate = interest_rate * 1.0 / 12;
        this.term_in_months = term_in_months
    }


    overall_payment() {
        return (this.monthly_payment * this.term_in_months) + this.upfront_cost
    }

    payments() {

        var ps = []
        for (let i = 0; i < this.term_in_months; i++) {
            ps.push(this.monthly_payment)
        }
        return ps;
    }

    summary() {
        let str = "Principal: " + this.principal + "\n" +
            "Interest Rate: " + this.interest_rate + "\n" +
            "Term in Months: " + this.term_in_months + "\n" +
            "Monthly Payment: " + this.monthly_payment + "\n" +
            "Overall Total Payment: " + this.overall_payment() + "\n"
        return str
    }
}

class Comparison {

    constructor(base_line, other, assumed_annual_roi) {
        this.base_line = base_line
        this.other = other
        this.assumed_annual_roi = assumed_annual_roi
        this.assumed_monthly_roi = assumed_annual_roi * 1.0 / 100.0 / 12
    }

    cash_history() {
        let baseline_payments = this.base_line.payments()
        let other_payments = this.other.payments()


        var max_len = Math.max(baseline_payments.length, other_payments.length);

        var base_line_cash_position = this.other.upfront_cost - this.base_line.upfront_cost
        var other_cash_position = 0

        let baseline_cash_history = []

        let other_cash_history = []

        for (let i = 0; i < max_len; i++) {
            console.log(base_line_cash_position)
            console.log(other_cash_position)
            base_line_cash_position = base_line_cash_position * (1 + this.assumed_monthly_roi)
            baseline_cash_history.push(base_line_cash_position)

            other_cash_position = other_cash_position * (1 + this.assumed_monthly_roi)
            other_cash_history.push(other_cash_position)

            other_cash_position = other_cash_position + ((baseline_payments[i] || 0) - (other_payments[i] || 0))

        }

        var zipped = baseline_cash_history.map(function (e, i) {
            return [e, other_cash_history[i]];
        });
        return zipped
    }

}


module.exports = [RefinanceMorgage, Mortgage, Comparison];