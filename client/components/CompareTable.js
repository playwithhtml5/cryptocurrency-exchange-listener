import React from 'react'
import {ListGroup, ListGroupItem} from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../css/main.css';
const textGlow={
  textShadow: "#6AD8C9 0 0 10px"
}

const typing = {
  fontSize: '14px',
  fontStyle: 'italic',
  opacity: '.5'
}
let bittrexData = {};
let poloniexData = {};
let exchangeData = [{},{}, {}];
let bitfinexData = {};
let bittrexPoloniexDifferenceData = {};
let bittrexBitfinexDifferenceData = {};
let localExchangeData;

//TODO need to make this scalable
//convert to smart components
const CompareTable = (props) => {
  //transform the data so it fits the table format
  //check vs object.keys
  if (props.exchangeData != undefined && Object.keys(props.exchangeData).length) {
    localExchangeData = props.exchangeData;
    Object.keys(props.exchangeData).map((tradingPair)=> {
      Object.keys(props.exchangeData[tradingPair]['All_Prices']).map((exchange,index) => {
        Object.assign(exchangeData[index], {exchange})
        exchangeData[index][tradingPair] = 20*1/props.exchangeData[tradingPair]['All_Prices'][exchange]
      });
      //TODO - this needs to be build to scale and remove hard coded values
      if (Object.keys(props.exchangeData[tradingPair]['All_Prices']).length > 2) {
        bittrexData[tradingPair] = 20*1/props.exchangeData[tradingPair]['All_Prices']['Bittrex'];
        poloniexData[tradingPair] = 20*1/props.exchangeData[tradingPair]['All_Prices']['Poloniex'];
        bitfinexData[tradingPair] = 20*1/props.exchangeData[tradingPair]['All_Prices']['Bitfinex'];
        Object.assign(bittrexData, bittrexData, {'exchange': 'Bittrex'});
        Object.assign(poloniexData, poloniexData, {'exchange': 'Poloniex'});
        Object.assign(bitfinexData, bitfinexData, {'exchange': 'Bitfinex'});

        // console.log('Bittrex data', bittrexData);
        // console.log('Poloniex data', poloniexData);
        // exchangeData = [bittrexData, poloniexData, bitfinexData];
        bittrexPoloniexDifferenceData['exchange'] = 'Bitrex vs Poloniex';
        let bittrexPoloniexDifference = bittrexData[tradingPair] -  poloniexData[tradingPair]+' '+tradingPair.split('-')[1];
        bittrexPoloniexDifferenceData[tradingPair] = bittrexPoloniexDifference;
        // console.log('Difference Data', differenceData);
        exchangeData[3] = bittrexPoloniexDifferenceData;
        bittrexBitfinexDifferenceData['exchange'] = 'Bitfinex vs Bitfinex';
        let bittrexBitfinexDifference = bittrexData[tradingPair] -  bitfinexData[tradingPair]+' '+tradingPair.split('-')[1];
        bittrexBitfinexDifferenceData[tradingPair] = bittrexBitfinexDifference;
        // console.log('Difference Data', differenceData);
        exchangeData[4] = bittrexBitfinexDifferenceData;
        // console.log('Exchange Data', exchangeData);
      } else {
        // console.log('Waiting for data from both exchanges to arrive...');
      }
    });
  } else {
    console.log('Exchange data arriving', props.exchangeData)
  }

  return (
    <div className="compareTable">
      <h2>Compare Table  for 20 BTC</h2>
      <p>Orange highlights the best trade</p>
      <BootstrapTable data={exchangeData} striped={true} hover={true}  tableStyle={ { height: '250px' } }>
        <TableHeaderColumn width='150' columnClassName="row-bottom-padded-md" dataField="exchange" isKey={true} dataAlign="center">Exchange</TableHeaderColumn>
        <TableHeaderColumn width='150' dataField="BTC-LTC" dataSort={true} columnClassName={ columnClassNameFormat }>BTC-LTC</TableHeaderColumn>
        <TableHeaderColumn width='150' dataField="BTC-DASH" dataSort={true} columnClassName={ columnClassNameFormat }>BTC-DASH</TableHeaderColumn>
        <TableHeaderColumn width='150' dataField="BTC-ETH" dataSort={true} columnClassName={ columnClassNameFormat }>BTC-ETH</TableHeaderColumn>
      </BootstrapTable>
    </div>
  )
}
function columnClassNameFormat(fieldValue, row, rowIdx, colIdx) {
  // fieldValue is column value
  // row is whole row object
  // rowIdx is index of row
  // colIdx is index of column
  // console.log(fieldValue)
  let columnValues;
  if (localExchangeData) {
    if (colIdx === 1) {
      columnValues = Object.values(localExchangeData['BTC-LTC']['All_Prices']);
    } else if (colIdx === 2 ) {
      columnValues = Object.values(localExchangeData['BTC-DASH']['All_Prices']);
    } else {
      columnValues =Object.values(localExchangeData['BTC-ETH']['All_Prices']);
    }
    let trades = columnValues.map(value=> {
      return 20*1/value;
    })
    // console.log('Field Value', fieldValue);
    return fieldValue == Math.max(...trades) ? 'td-column-function-best-price' : 'td-column-function-not-best';
  }


}
export default CompareTable;
