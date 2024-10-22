import React, { useState, useEffect } from 'react'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface CurrencyConverterProps {
  initialAmount: number
  initialFromCurrency: string
  initialToCurrency: string
  autoConvert?: boolean
  className?: string
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  initialAmount,
  initialFromCurrency,
  initialToCurrency,
  autoConvert = false,
  className = '',
}) => {
  const [amount, setAmount] = useState(initialAmount.toString())
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency)
  const [toCurrency, setToCurrency] = useState(initialToCurrency)
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (autoConvert) {
      handleConvert()
    }
  }, [amount, fromCurrency, toCurrency, autoConvert])

  const handleConvert = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCY_API_KEY}&base_currency=${fromCurrency}&currencies=${toCurrency}`)
      if (!response.ok) {
        throw new Error('Failed to fetch conversion rate')
      }
      const data = await response.json()
      const rate = data.data[toCurrency].value
      setConvertedAmount(parseFloat(amount) * rate)
    } catch (err) {
      setError('Failed to convert currency. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const currencies = [
    { value: 'USD', label: 'US Dollar' },
    { value: 'EUR', label: 'Euro' },
    { value: 'GBP', label: 'British Pound' },
    { value: 'JPY', label: 'Japanese Yen' },
    { value: 'AUD', label: 'Australian Dollar' },
    { value: 'CAD', label: 'Canadian Dollar' },
    { value: 'CHF', label: 'Swiss Franc' },
    { value: 'CNY', label: 'Chinese Yuan' },
    { value: 'INR', label: 'Indian Rupee' },
    // Add more currencies as needed
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <Select
        value={fromCurrency}
        onValueChange={(value) => setFromCurrency(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="From Currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.value} value={currency.value}>
              {currency.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={toCurrency}
        onValueChange={(value) => setToCurrency(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="To Currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.value} value={currency.value}>
              {currency.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!autoConvert && (
        <Button onClick={handleConvert} disabled={isLoading}>
          {isLoading ? 'Converting...' : 'Convert'}
        </Button>
      )}
      {convertedAmount !== null && (
        <p>
          {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
        </p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}

export default CurrencyConverter
