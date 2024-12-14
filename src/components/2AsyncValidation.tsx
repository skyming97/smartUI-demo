import React, { useState, useCallback } from 'react';
import { Input } from 'smart-webcomponents-react/input';
import { Button } from 'smart-webcomponents-react/button';

const AsyncValidation: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const validateInput = useCallback((value: string) => {
        // 模拟异步验证
        setIsValidating(true);
        setError(null);

        setTimeout(() => {
            if (value.length < 3) {
                setError('输入内容至少需要3个字符');
            } else if (!/^[a-zA-Z]+$/.test(value)) {
                setError('只允许输入英文字母');
            } else {
                setError(null);
            }
            setIsValidating(false);
        }, 1000); // 模拟1秒的网络延迟
    }, []);

    const handleInputChange = (event: any) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        validateInput(newValue);
    };

    const handleFormSubmit = (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formInputValue = formData.get('asyncInput') as string;

        // 模拟异步验证
        setFormError(null);
        setTimeout(() => {
            if (formInputValue.length < 3) {
                setFormError('输入内容至少需要3个字符');
            } else if (!/^[a-zA-Z]+$/.test(formInputValue)) {
                setFormError('只允许输入英文字母');
            } else {
                setFormError(null);
                alert('表单提交成功！');
            }
        }, 1000);
    };

    return (
        <div>
            <h3 className="sticky-header component-header">
                2. 异步验证，错误提示
                <a href="https://www.htmlelements.com/demos/validator/overview/" target="_blank" rel="noopener noreferrer">
                    {" "}查看 Smart.Validator 文档
                </a>
            </h3>

            <h4>使用Input组件模拟：</h4>
            <Input
                placeholder="请输入英文字母（至少3个）"
                value={inputValue}
                onChange={handleInputChange}
                style={{ width: '300px' }}
            />
            {isValidating && <p>正在验证...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!isValidating && !error && inputValue && <p style={{ color: 'green' }}>输入有效</p>}

            <h4>使用Form实现：</h4>
            <form onSubmit={handleFormSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <Input
                        name="asyncInput"
                        placeholder="请输入英文字母（至少3个）"
                        style={{ width: '300px' }}
                    />
                </div>
                <div>
                    <Button type="submit">提交</Button>
                </div>
            </form>
            {formError && <p style={{ color: 'red' }}>{formError}</p>}

            总结：没有异步验证，由自己实现；错误信息提示，暂时没找到通过jsx方式设置的办法
        </div>
    );
};

export default AsyncValidation;