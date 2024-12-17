import React, { useRef, useState } from "react";
import './App.css'; // 确保引入了 App.css
import TextBoxVsInput from './components/1TextBoxVsInput.tsx';
import AsyncValidation from './components/2AsyncValidation.tsx';
import DropdownGridTree from './components/3DropdownGridTree/3DropdownGridTree.tsx';
import GridColumnEditors from './components/4GridColumnEditors.tsx';
import GridHeaderCheckbox from './components/5GridHeaderCheckbox.tsx';
import GridCellConditionalReadonly from './components/6GridCellConditionalReadonly.tsx';
import InputMasking from './components/7InputMasking.tsx';
import DropdownGridTreeMultiple from "./components/3ADropdownGridTree/3ADropdownGridTree.tsx";
import CellDropdownGridTree from "./components/3BCellDropdownGrid/3BCellDropdownGrid.tsx";
import { CheckBox } from 'smart-webcomponents-react/checkbox';
import CellDropdown from "./components/CellDropdown/CellDropdown.tsx";


const App: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [focusedRowIndex, setFocusedRowIndex] = useState<number>(0);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log('Selected file:', file.name);
            // 这里可以添加处理文件的逻辑
        }
    };

    const triggerFileInput = () => {
        if (window.confirm('Are you sure you want to select a file?')) {
            fileInputRef.current?.click();
        }
    };

    // 模拟从后端获取文件流数据
    const fetchFileFromBackend = async (): Promise<ArrayBuffer> => {
        // 这里我们创建一个简单的文本文件作为示例
        const text = 'This is a sample file content.';
        const encoder = new TextEncoder();
        return encoder.encode(text).buffer;
    };

    const handleFetchAndPreview = async () => {
        try {
            const fileData = await fetchFileFromBackend();
            const blob = new Blob([fileData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    };

    const handleChange = (e: any) => {
    }

    const [isMultiple, setIsMultiple] = useState<boolean>(false);
    const [isTree, setIsTree] = useState<boolean>(false);
    const [cellEditable, setCellEditable] = useState<boolean>(false);

    const ds = [
        { EmployeeID: 1, Name: '张三', age: 30, department: '销售部', selectedValue: 'A', checkListValue: '1,2,3' },
        { EmployeeID: 2, Name: '李四', age: 28, department: '市场部', selectedValue: 'B', checkListValue: '1,2,3' },
        { EmployeeID: 3, Name: '王五', age: 35, department: '技术部', selectedValue: 'C', checkListValue: '1,2,3' },
        { EmployeeID: 4, Name: '赵六', age: 32, department: '人事部', selectedValue: '', checkListValue: '1,2,3' },
        { EmployeeID: 5, Name: '钱七', age: 27, department: '财务部', selectedValue: '', checkListValue: '1,2,3' },
    ]

    const newDropdownDataSource = [
        { id: 1, name: '第1行', value: 'A' },
        { id: 2, name: '第2行', value: 'B' },
        { id: 3, name: '第3行', value: 'C' },
    ]

    const dsSettings = React.useMemo(() => {
        if (isTree) {
            return {
                keyDataField: 'id',
                parentDataField: 'pid',
                id: 'id',
            };
        }
    }, [isTree]);

    const handleFocusedRowChange = (e: any) => {
        console.log('%c [ handleFocusedRowChange ]-78', 'font-size:13px; background:#5DA979; color:#007AFF;', e);
        setFocusedRowIndex(e?.index);
    }

    return (
        <div className="container">
            <h2 className="main-header">htmlelements/smartUI调研:</h2>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <ol>
                <li className="component-wrapper">
                    <CellDropdown dataSource={newDropdownDataSource} />
                </li>
                <li className="component-wrapper">
                    <TextBoxVsInput />
                </li>
                <li className="component-wrapper">
                    <AsyncValidation />
                </li>
                <li className="component-wrapper">
                    <DropdownGridTree />
                </li>
                <li className="component-wrapper">
                    <DropdownGridTreeMultiple onChange={handleChange} selectedValue={''} />
                </li>
                <li className="component-wrapper">
                    <CellDropdownGridTree onFocusedRowChange={handleFocusedRowChange} dataSource={ds} multiple={isMultiple} isTree={isTree} cellEditable={cellEditable} dropdownDataSourceSettings={dsSettings} />
                    <div>焦点行： 第{focusedRowIndex}行</div>
                    <CheckBox onChange={() => setIsMultiple(!isMultiple)}>多选</CheckBox>
                    <CheckBox onChange={() => setIsTree(!isTree)}>树形</CheckBox>
                    <CheckBox onChange={() => setCellEditable(!cellEditable)}>单元格编辑</CheckBox>
                </li>
                <li className="component-wrapper">
                    <GridColumnEditors />
                </li>
                <li className="component-wrapper">
                    <GridHeaderCheckbox />
                </li>
                <li className="component-wrapper">
                    <GridCellConditionalReadonly />
                </li>
                <li className="component-wrapper">
                    <InputMasking />
                </li>
            </ol>
        </div>
    );
}

export default App;