import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';


function App() {

  const [result, setResult] = useState(0);
  const [input, setInput] = useState(1);
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [destinationCurrency, setDestinationCurrency] = useState('INR');
  const [currencyInfo, setCurrencyInfo] = useState({});

  useEffect(() => {
    axios.get('https://open.er-api.com/v6/latest/USD')
      .then((response) => {
        setCurrencyInfo(response.data.rates);
        setResult(response.data.rates['INR']);
      })
  }, []);

  

  const flip = () => {
    const currentSource = sourceCurrency;
    setSourceCurrency(destinationCurrency);
    setDestinationCurrency(currentSource);
  }

  const reset = () => {
    setSourceCurrency('USD');
    setDestinationCurrency('INR');
    setInput(1);
  }

  useEffect(() => {
    const scRate = currencyInfo[sourceCurrency];
    const dcRate = currencyInfo[destinationCurrency];

    setResult(((1/scRate) * dcRate) * (input || 1));
  }, [sourceCurrency, destinationCurrency, input, currencyInfo]);

  const inputOnChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue < 1 || selectedValue > 10000) {
      alert("Please set the value between 1 and 10000");
    } else {
      setInput(event.target.value);
    }
  }

  return (
    <div className="App">
      <input type="number" value={input} onChange={(e) => inputOnChange(e)} min="1" max="10000"/>
      <div>
        Source Currency: 
        <select onChange={(e) => setSourceCurrency(e.target.value)} value={sourceCurrency}>
          {
            Object.keys(currencyInfo).filter(currency => currency !== destinationCurrency).map((currency) => {
                return <option>{currency}</option>
            })
          }
        </select>
      </div>
      <div>
        Destination Currency: 
        <select onChange={(e) => setDestinationCurrency(e.target.value)} value={destinationCurrency}>
          {
            Object.keys(currencyInfo).filter(currency => currency !== sourceCurrency).map((currency) => {
              return <option>{currency}</option>
            })
          }
        </select>
      </div>
      
      <div>
        <button onClick={reset}>Reset</button>
        <button onClick={flip}>Flip</button>
      </div>
      <p>The converted value of {input} from: {sourceCurrency} to: {destinationCurrency} is {result}</p>
    </div>
  );
}

export default App;
