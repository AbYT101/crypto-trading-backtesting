// BacktestForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/'; 

const BacktestForm = ({ token }) => {
  const [formData, setFormData] = useState({
    coin: '',
    name: '',
    start_date: '',
    end_date: '',
    parameters: [{ indicator_id: '', value: '' }],
  });
  const [coins, setCoins] = useState([]);
  const [indicators, setIndicators] = useState([]);

  // Fetch coins and indicators on component mount
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/coins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCoins(response.data.coins); // Assuming API returns coins array
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    const fetchIndicators = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/indicators`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIndicators(response.data.indicators); // Assuming API returns indicators array
      } catch (error) {
        console.error('Error fetching indicators:', error);
      }
    };

    // Call functions to fetch coins and indicators
    fetchCoins();
    fetchIndicators();
  }, [token]);

  // Function to handle form input change
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedParameters = [...formData.parameters];
    updatedParameters[index][name] = value;
    setFormData({ ...formData, parameters: updatedParameters });
  };

  // Function to add new parameter field
  const addParameter = () => {
    setFormData({
      ...formData,
      parameters: [...formData.parameters, { indicator_id: '', value: '' }],
    });
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/backtests`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle successful response
      console.log('Backtest created:', response.data);
      // Reset form fields after successful submission (optional)
      setFormData({
        coin: '',
        name: '',
        start_date: '',
        end_date: '',
        parameters: [{ indicator_id: '', value: '' }],
      });
    } catch (error) {
      console.error('Error creating backtest:', error);
      // Handle error, show error message to user
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Create Backtest</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="coin" className="block text-sm font-medium text-gray-700">Coin:</label>
          <select
            id="coin"
            name="coin"
            value={formData.coin}
            onChange={(e) => setFormData({ ...formData, coin: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a Coin</option>
            {coins.map((coin) => (
              <option key={coin.id} value={coin.symbol}>
                {coin.name} ({coin.symbol})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date:</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <fieldset className="mb-4">
          <legend className="block text-sm font-medium text-gray-700">Parameters:</legend>
          {formData.parameters.map((param, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-grow">
                <label htmlFor={`indicator_id_${index}`} className="block text-sm font-medium text-gray-700">Indicator:</label>
                <select
                  id={`indicator_id_${index}`}
                  name="indicator_id"
                  value={param.indicator_id}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select an Indicator</option>
                  {indicators.map((indicator) => (
                    <option key={indicator.id} value={indicator.id}>
                      {indicator.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-grow">
                <label htmlFor={`value_${index}`} className="block text-sm font-medium text-gray-700">Value:</label>
                <input
                  type="number"
                  id={`value_${index}`}
                  name="value"
                  value={param.value}
                  onChange={(e) => handleInputChange(index, e)}
                  step="any"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Value"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addParameter}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Parameter
          </button>
        </fieldset>
        <div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BacktestForm;
