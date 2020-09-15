import React, { useState } from 'react';
import CanvasJSReact from './canvasjs.react';
import API, { graphqlOperation } from '@aws-amplify/api';
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function NumberInput(props) {

    var inputValue = null;
    return (
        <div className={`list-item`}>
            <h1> {props.title} </h1>
            <input name="number-input" defaultValue={props.defaultValue} onChange={props.onChange} />
        </div>
    );
}

function Submit(props) {
    return (
        <div className={`list-item`}>
            <button onClick={props.onClick}>
                {props.display}
            </button>
        </div>
    );
}


export default function UserForms(props) {


    const [userNumberInput, setUserNumberInput] = useState({
        current_principal: 535300,
        current_interest_rate: 4,
        current_term_in_months: 336,
        current_upfront_cost: 0,

        other_principal: 540000,
        other_interest_rate: 2.875,
        other_term_in_months: 360,
        other_upfront_cost: 20000,
        assumed_annual_roi: 7
    });

    const [display, setDisplay] = useState("null");
    const [chartData, setChartData] = useState(null
        //     {
        //     animationEnabled: true,
        //     title: {
        //         text: "Cash Position Over Time"
        //     },
        //     axisY: {
        //         title: "Cash in USD"
        //     },
        //     toolTip: {
        //         shared: true
        //     },
        //     data: [{
        //         type: "spline",
        //         name: "base line",
        //         showInLegend: true,
        //         dataPoints: []
        //     },
        //     {
        //         type: "spline",
        //         name: "refinance",
        //         showInLegend: true,
        //         dataPoints: []
        //     }]

        // }
    );

    function submitUserInput() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                current_principal: userNumberInput['current_principal'],
                current_interest_rate: userNumberInput['current_interest_rate'],
                current_term_in_months: userNumberInput['current_term_in_months'],
                current_upfront_cost: 0,

                other_principal: userNumberInput['other_principal'],
                other_interest_rate: userNumberInput['other_interest_rate'],
                other_term_in_months: userNumberInput['other_term_in_months'],
                other_upfront_cost: userNumberInput['other_upfront_cost'],
                assumed_annual_roi: userNumberInput['assumed_annual_roi']

            })
        };
        // todo: use API.post instead
        fetch("https://b275xg70y5.execute-api.us-east-1.amazonaws.com/devv/api/comparison", requestOptions).then(r => r.json()).then(j => {
            console.log(j)

            // setDisplay(JSON.stringify(j))

            var baseline = []
            var other = []

            for (let i = 0; i < j.length; i++) {

                let baseline_datapoint = { y: Math.round(j[i][0]), label: "month " + i }
                baseline.push(baseline_datapoint)

                let other_datapoint = { y: Math.round(j[i][1]), label: "month " + i }
                other.push(other_datapoint)
            }


            const options = {
                animationEnabled: true,
                title: {
                    text: "Cash Position Over Time"
                },
                axisY: {
                    title: "Cash in USD"
                },
                toolTip: {
                    shared: true
                },
                data: [{
                    type: "spline",
                    name: "base line",
                    showInLegend: true,
                    dataPoints: baseline
                },
                {
                    type: "spline",
                    name: "refinance",
                    showInLegend: true,
                    dataPoints: other
                }]

            }
            setChartData(options)
        }
        )
    }

    function handleInputChange(fieldName) {
        return (event) => {
            var copy = JSON.parse(JSON.stringify(userNumberInput));
            copy[fieldName] = event.target.value
            setUserNumberInput(copy)
        }
    }
    return (
        <div>
            <NumberInput title="Current Principal " onChange={handleInputChange('current_principal')} defaultValue={535300} />
            <NumberInput title="Current Interest Rate:" onChange={handleInputChange('current_interest_rate')} defaultValue={4} />
            <NumberInput title="Current Term in Months" onChange={handleInputChange('current_term_in_months')} defaultValue={336} />
            <br />
            <NumberInput title="Refinanced Principal" onChange={handleInputChange('other_principal')} defaultValue={540000} />
            <NumberInput title="Refinanced Interest Rate" onChange={handleInputChange('other_interest_rate')} defaultValue={2.875} />
            <NumberInput title="Refinanced Term in Months" onChange={handleInputChange('other_term_in_months')} defaultValue={360} />
            <NumberInput title="Refinance Closing Clost" onChange={handleInputChange('other_upfront_cost')} defaultValue={20000} />
            <br />
            <NumberInput title="Hypothetical Annual Return on Investments" onChange={handleInputChange('assumed_annual_roi')} defaultValue={7} />
            <p> Assumption 1: The Upfront Cost for Refinance is invested with the Hypothetical anuual return. </p>
            <p> Assumption 2: The current Mortgage is treated as based line. If monthly payments can be reduced by the refinance, the saved amount is invested. </p>
            <Submit display="Submit" onClick={() => submitUserInput()} />


            <CanvasJSChart options={chartData} />
            <p> {display}</p>
        </div>
    );
}
