import React, { useState } from 'react';
import { NumericTextBox } from 'smart-webcomponents-react/numerictextbox';
import { DateTimePicker } from 'smart-webcomponents-react/datetimepicker';
import { NumberInput } from 'smart-webcomponents-react/numberinput';

const InputMasking: React.FC = () => {
    const [numericValue, setNumericValue] = useState<number>(1000);
    const [dateValue, setDateValue] = useState<Date>(new Date());
    const [currencyValue, setCurrencyValue] = useState<number>(1234.56);

    const handleNumericChange = (event: any) => {
        setNumericValue(event.detail.value);
    };

    const handleDateChange = (event: any) => {
        setDateValue(event.detail.value);
    };

    const handleCurrencyChange = (event: any) => {
        setCurrencyValue(event.detail.value);
    };

    return (
        <div>
            <h3 className="sticky-header component-header">
                7. 输入掩码
                <a href="https://www.htmlelements.com/demos/input/number-input/" target="_blank" rel="noopener noreferrer">
                    {" "}查看 Smart.Input （ NumberInput ） 文档
                </a>
            </h3>

            <h4>数字类型掩码</h4>
            <NumericTextBox
                value={numericValue}
                spinButtons={true}
                inputFormat="0,000.00"
                // decimalDigits={2}
                onChange={handleNumericChange}
            />
            <p>数值: {numericValue}</p>

            <h4>日期类型掩码</h4>
            <DateTimePicker
                value={dateValue}
                formatString="yyyy-MM-dd HH:mm:ss"
                onChange={handleDateChange}
            />
            <p>日期: {dateValue.toLocaleString()}</p>

            <h4>货币类型掩码</h4>
            <NumberInput
                value={currencyValue?.toString()}

                // mask="$#,##0.00"
                numberFormat={
                    {
                        style: 'currency',
                        currency: 'USD',
                        currencySymbol: '$',
                        currencyPosition: 'right',
                    }
                }
                onChange={handleCurrencyChange}
            />
            <p>货币值: {currencyValue}</p>
        </div>
    );
};

export default InputMasking;