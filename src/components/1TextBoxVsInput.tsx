import React, { useState } from 'react';
import { TextBox } from 'smart-webcomponents-react/textbox';
import { Input } from 'smart-webcomponents-react/input';
import { Button } from 'smart-webcomponents-react/button';

const TextBoxVsInput: React.FC = () => {
    const [textBoxValue, setTextBoxValue] = useState('');
    const [inputValue, setInputValue] = useState('');

    const handleTextBoxChange = (event: any) => {
        setTextBoxValue(event.detail.value);
    };

    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    };

    return (
        <div>
            <h3 className="sticky-header component-header">
                1. TextBox、Inputs控件的差异
                <a href="https://www.htmlelements.com/demos/textbox/overview/" target="_blank" rel="noopener noreferrer">
                    {" "}查看 Smart.TextBox 文档 /
                </a>
                <a href="https://www.htmlelements.com/demos/input/overview/" target="_blank" rel="noopener noreferrer">
                    {" "}查看 Smart.Input 文档
                </a>
            </h3>

            <h4>1. 基本 Input 控件</h4>
            <Input
                placeholder="Basic input"
                value={inputValue}
                onChange={handleInputChange}
            />
            <p>输入框的值: {inputValue}</p>

            <h4>2. 基本 TextBox 控件</h4>
            <TextBox
                placeholder="Basic text box"
                value={textBoxValue}
                onChange={handleTextBoxChange}
            />
            <p>文本框的值: {textBoxValue}</p>

            <div>
                <h4>主要差异总结：</h4>
                <ul style={{ lineHeight: '1.6' }}>
                    <p>TextBox 比 Input 有更多的功能，例如：</p>
                    <ul>
                        <li>不同的自动完成模式</li>
                        <li>当按下 Enter 键时提交表单的选项</li>
                        <li>其他高级功能</li>
                    </ul>

                    <p>对于 Input 的正常使用，Smart.Input 就足够了。</p>

                    <p>如果您需要更多专业和高级功能，可以使用 TextBox。</p>

                    <p>大多数用户更喜欢 Input 组件，因为他们通常不需要 TextBox 提供的额外功能。</p>
                </ul>
            </div>
        </div>
    );
};

export default TextBoxVsInput;