import React, { useState } from 'react';
import CanvasJSReact from './canvasjs.react';
import API, { graphqlOperation } from '@aws-amplify/api';
//var CanvasJSReact = require('./canvasjs.react');
import { curveCatmullRom } from 'd3-shape';
import "antd/dist/antd.css";
import { Button, InputNumber, Row, Col, PageHeader, version } from "antd";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function NumberInput(props) {

    var inputValue = null;
    return (

        <div >
            <Row>
                <Col span={8}>{props.title}</Col>
                <Col span={4}><InputNumber name="number-input" defaultValue={props.defaultValue} onChange={props.onChange} /></Col>
            </Row>

            {/* 
        <div>
            <p> {props.title} </p>
            <InputNumber name="number-input" defaultValue={props.defaultValue} onChange={props.onChange} /> */}
        </div>
    );
}

function Submit(props) {
    return (
        <Button type="primary" onClick={props.onClick}>
            {props.display}
        </Button>
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

        assumed_inflation: 2,
        assumed_property_annual_appreciation: 5,
        property_value: 675000,
        assumed_annual_roi: 7

    });

    const [displayReport, setDisplayReport] = useState(false);
    const [cashPositionChartData, setCashPositionChartData] = useState({
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
            dataPoints: []
        },
        {
            type: "spline",
            name: "refinance",
            showInLegend: true,
            dataPoints: []
        }]
    });
    const [principalChartData, setPrincipalChartData] = useState({
        animationEnabled: true,
        title: {
            text: "Princial Over Time"
        },
        axisY: {
            title: "Princial"
        },
        toolTip: {
            shared: true
        },
        data: [{
            type: "spline",
            name: "base line",
            showInLegend: true,
            dataPoints: []
        },
        {
            type: "spline",
            name: "refinance",
            showInLegend: true,
            dataPoints: []
        }]
    });

    const [netWorthChartData, setNetWorthChartData] = useState({
        animationEnabled: true,
        title: {
            text: "Net Worth Over Time"
        },
        axisY: {
            title: "Net Worth"
        },
        toolTip: {
            shared: true
        },
        data: [{
            type: "spline",
            name: "base line",
            showInLegend: true,
            dataPoints: []
        },
        {
            type: "spline",
            name: "refinance",
            showInLegend: true,
            dataPoints: []
        }]
    });


    const [current, setCurrent] = useState({ monthlyPayment: 0, overallPayment: 0 });

    const [refinanced, setRefinanced] = useState({ monthlyPayment: 0, overallPayment: 0 });

    function submitUserInput() {


        // let property_value = body['property_value']
        // let assumed_property_annual_appreciation = body['assumed_property_annual_appreciation']
        // let liquidation_cost_rate = body['liquidation_cost_rate']
        // let assumed_inflation = body['assumed_inflation']
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                current_principal: parseInt(userNumberInput['current_principal']),
                current_interest_rate: parseInt(userNumberInput['current_interest_rate']),
                current_term_in_months: parseInt(userNumberInput['current_term_in_months']),
                current_upfront_cost: 0,

                other_principal: parseInt(userNumberInput['other_principal']),
                other_interest_rate: parseInt(userNumberInput['other_interest_rate']),
                other_term_in_months: parseInt(userNumberInput['other_term_in_months']),
                other_upfront_cost: parseInt(userNumberInput['other_upfront_cost']),

                assumed_annual_roi: parseInt(userNumberInput['assumed_annual_roi']),

                property_value: parseInt(userNumberInput['property_value']),
                assumed_property_annual_appreciation: parseInt(userNumberInput['assumed_property_annual_appreciation']),
                liquidation_cost_rate: 3,
                assumed_inflation: parseInt(userNumberInput['assumed_inflation']),

            })
        };
        // todo: use API.post instead

        let promise = fetch("https://b275xg70y5.execute-api.us-east-1.amazonaws.com/devv/api/comparison", requestOptions).then(r => r.json())
        promise.then(data => {


            setCurrent(data.current)
            setRefinanced(data.refinance)

            var baseline_cash_positions = []
            var other_cash_positions = []
            let snapshots = data.projection

            for (let i = 0; i < snapshots.length; i++) {

                let baseline_cash_position_datapoint = { y: Math.round(snapshots[i][0].cash_position), label: "month " + i }
                baseline_cash_positions.push(baseline_cash_position_datapoint)

                let other_cash_position_datapoint = { y: Math.round(snapshots[i][1].cash_position), label: "month " + i }
                other_cash_positions.push(other_cash_position_datapoint)
            }
            const cashPositionOptions = {
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
                    dataPoints: baseline_cash_positions
                },
                {
                    type: "spline",
                    name: "refinance",
                    showInLegend: true,
                    dataPoints: other_cash_positions
                }]
            }
            setCashPositionChartData(cashPositionOptions)
            return snapshots
        }
        ).then(snapshots => {

            var baseline_principals = []
            var other_principals = []


            for (let i = 0; i < snapshots.length; i++) {

                let baseline_principal_datapoint = { y: Math.round(snapshots[i][0].principal), label: "month " + i }
                baseline_principals.push(baseline_principal_datapoint)

                let other_principal_datapoint = { y: Math.round(snapshots[i][1].principal), label: "month " + i }
                other_principals.push(other_principal_datapoint)

            }
            const principalOptions = {
                animationEnabled: true,
                title: {
                    text: "Princial Over Time"
                },
                axisY: {
                    title: "Princial"
                },
                toolTip: {
                    shared: true
                },
                data: [{
                    type: "spline",
                    name: "base line",
                    showInLegend: true,
                    dataPoints: baseline_principals
                },
                {
                    type: "spline",
                    name: "refinance",
                    showInLegend: true,
                    dataPoints: other_principals
                }]
            }

            setPrincipalChartData(principalOptions)
            return snapshots

        }).then(snapshots => {

            paintChat(snapshots, "Net Worth Over Time", "Net Worth in USD", "net_worth", setNetWorthChartData)
            return snapshots
        }).then(

            setDisplayReport(true)

        )
    }

    function paintChat(snapshots, title, y_title, field_name, set_fn) {

        var baseline_data = []
        var other_data = []


        for (let i = 0; i < snapshots.length; i++) {

            let baseline_datapoint = { y: Math.round(snapshots[i][0][field_name]), label: "month " + i }
            baseline_data.push(baseline_datapoint)

            let other_datapoint = { y: Math.round(snapshots[i][1][field_name]), label: "month " + i }
            other_data.push(other_datapoint)
        }

        const options = {
            animationEnabled: true,
            title: {
                text: title
            },
            axisY: {
                title: y_title
            },
            toolTip: {
                shared: true
            },
            data: [{
                type: "spline",
                name: "base line",
                showInLegend: true,
                dataPoints: baseline_data
            },
            {
                type: "spline",
                name: "refinance",
                showInLegend: true,
                dataPoints: other_data
            }]
        }

        set_fn(options)
    }

    function handleInputChange(fieldName) {
        return (event) => {
            var copy = JSON.parse(JSON.stringify(userNumberInput));
            copy[fieldName] = event
            setUserNumberInput(copy)
        }
    }


    // let property_value = body['property_value']
    // let assumed_property_annual_appreciation = body['assumed_property_annual_appreciation']
    // let liquidation_cost_rate = body['liquidation_cost_rate']
    // let assumed_inflation = body['assumed_inflation']
    return (
        <div>
            <PageHeader
                // className="site-page-header"
                onBack={() => null}
                title="Advanced Refinance Calculator"
                subTitle="Make Informed decisions"
                backIcon={null}
                extra={[
                    <p >
                        Email: Burgess.Chen.Tz@gmail.com
            </p>,
                ]}
            />
            <div class="center">
                <NumberInput title="Current Principal " onChange={handleInputChange('current_principal')} defaultValue={535300} />
                <NumberInput title="Current Interest Rate " onChange={handleInputChange('current_interest_rate')} defaultValue={4} />
                <NumberInput title="Current Term in Months " onChange={handleInputChange('current_term_in_months')} defaultValue={336} />
                <br />
                <NumberInput title="Refinanced Principal" onChange={handleInputChange('other_principal')} defaultValue={540000} />
                <NumberInput title="Refinanced Interest Rate" onChange={handleInputChange('other_interest_rate')} defaultValue={2.875} />
                <NumberInput title="Refinanced Term in Months" onChange={handleInputChange('other_term_in_months')} defaultValue={360} />
                <NumberInput title="Refinance Closing Clost" onChange={handleInputChange('other_upfront_cost')} defaultValue={20000} />
                <br />

                <NumberInput title="Property Value" onChange={handleInputChange('property_value')} defaultValue={675000} />
                <NumberInput title="Assumed Property Annual Appreciation" onChange={handleInputChange('assumed_property_annual_appreciation')} defaultValue={5} />

                <br />
                <NumberInput title="Assumed Annual Return on Investments" onChange={handleInputChange('assumed_annual_roi')} defaultValue={7} />

                <NumberInput title="Assumed Inflation" onChange={handleInputChange('assumed_inflation')} defaultValue={2} />
                <div>
                    <Submit display="Submit" onClick={() => submitUserInput()} />
                </div>

                <div style={{ display: displayReport ? "block" : "none" }}>
                    <br />
                    <h2> Current Mortgage </h2>
                    <p>  Monthly payment: {current.monthlyPayment} </p>
                    <p>  Total payment: {current.overallPayment}  </p>

                    <h2> Refinanced Mortgage </h2>
                    <p>  Monthly payment: {refinanced.monthlyPayment} </p>
                    <p>  Total payment: {refinanced.overallPayment}  </p>

                    <br />
                    <h2> Assumptions: </h2>
                    <p>  - If choose not to refinance, the Refinance Closing Clost is invested with the Assumed Anuual Return of {userNumberInput['assumed_annual_roi']}%. </p>
                    <p>  - The current Mortgage is treated as based line. If monthly payments can be reduced by the refinance, the saved amount is invested, also with he Assumed Anuual Return of {userNumberInput['assumed_annual_roi']}%. </p>

                    <br />
                    <div >
                        <CanvasJSChart options={cashPositionChartData} />
                    </div>
                    <p> Cash Position Over Time: If you are making less monthly payment, and invest the saved amount. </p>


                    <div>
                        <CanvasJSChart options={principalChartData} />
                    </div>

                    <p> Balance Over Time: The amount of balance you own the bank/lender.  </p>

                    <CanvasJSChart options={netWorthChartData} />
                    <p> Net Worth Over Time: Net Worth = Cash + House Value - Balance. This reflect your overall wealth if you decide to sell your house. A 3% selling cost is assumed.  </p>
                </div>
            </div>
        </div>

    );
}
