import './App.css';

import { useEffect, useState } from 'react';
import Button from './Button';

const buttons = [
  "AC", "+/-", "%", "÷",
  "7", "8", "9", "x",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", ".", "="];

function App() {

  // You can use this to maintain the calculator buffer
  const [calcBuffer, setCalcBuffer] = useState([]);
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    if(calcBuffer.length === 0){
      setDisplay("0")
    } else {
      setDisplay(calcBuffer.join(""));
    }
    
  }, [calcBuffer]);


  const digitPress = value => {
    let lastVal = calcBuffer[calcBuffer.length -1]
    if(isInt(lastVal)){
      const newArr = [...calcBuffer.slice(0, calcBuffer.lastIndexOf(lastVal)), lastVal + value]
      setCalcBuffer(newArr)
    } else {
      setCalcBuffer([...calcBuffer, value])
    }
  };

  const decimalPress = () => {
    const lastVal = calcBuffer[calcBuffer.length -1];
    if(isInt(lastVal) && !lastVal.includes(".")){
      const newArr = [...calcBuffer.slice(0, calcBuffer.lastIndexOf(lastVal)), lastVal + "."]
      setCalcBuffer(newArr)
    }
  };

  const signPress = () => {
    const lastVal = calcBuffer[calcBuffer.length -1];
    let newArr;
    if(isInt(lastVal) && lastVal.includes("-")){
      newArr = [...calcBuffer.slice(0, calcBuffer.lastIndexOf(lastVal)), lastVal.slice(1)]
    } else {
      newArr = [...calcBuffer.slice(0, calcBuffer.lastIndexOf(lastVal)), "-" + lastVal]
    }
    setCalcBuffer(newArr);
  };

  const percentPress = () => {
    const lastVal = calcBuffer[calcBuffer.length -1];
    if(isInt(lastVal)){
      const newArr = [...calcBuffer.slice(0, calcBuffer.lastIndexOf(lastVal)), lastVal + "%"]
      setCalcBuffer(newArr)
    }
  }

  const operatorPress = value => {
    const lastVal = calcBuffer[calcBuffer.length -1]
    if(!isOperator(lastVal) && calcBuffer.length > 0){
      setCalcBuffer([...calcBuffer, value])
    }
  };

  const performOperations = (prevVal, index) => {
    if(calcBuffer.length <= index + 1){
      return prevVal;
    }

    let result;

    switch(calcBuffer[index + 1]) {
      case "+":
        result = strToNum(prevVal) + strToNum(calcBuffer[index + 2])
        break;
      case "-":
        result = strToNum(prevVal) - strToNum(calcBuffer[index + 2]);
        break;
      case "x":
        result = strToNum(prevVal) * strToNum(calcBuffer[index + 2]);
        break;
      default:
      result = strToNum(prevVal) / strToNum(calcBuffer[index + 2]);
      break;
    }

    return performOperations(result.toString(), index + 2);
  };

  const evaluate = () => {
    const result = performOperations(calcBuffer[0], 0);
    setCalcBuffer([...calcBuffer, "=", result.toString()])
  };

  const isInt = s => !isNaN(parseInt(s));

  const isOperator = s => ["x", "÷", "+", "-"].includes(s);

  const strToNum = s => s.includes("%") ? parseFloat(s) / 100 : parseFloat(s);


  // Handle button clicks here
  const handleClick = (value) => {
    if((isInt(value))){
      digitPress(value);
      return;
    }

   switch (value) {
    case "AC":
      setCalcBuffer([]);
      break;
    case ".":
      decimalPress();
      break;
    case "=":
      evaluate();
      break;
    case "+/-":
      signPress();
      break;
    case "%":
      percentPress();
      break;
    default:
      operatorPress(value);
      break;
   }
  }

  return (
    <div className="App">
      <div>
        <header className="App-header">
          <h1>Calculator</h1>
        </header>
      </div>
      <main className="calculator">
        <div className="display">{display}</div>
        <div className="keypad">
          {buttons.map((button, index) => {
            return <Button label={button} handleClick={() => handleClick(button)} />
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
