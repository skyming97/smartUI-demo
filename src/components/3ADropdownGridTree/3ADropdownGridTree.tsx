import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Grid } from 'smart-webcomponents-react/grid';

interface DropdownGridTreeProps {
    onChange?: (data: any[]) => void;
    displayExpr?: string;
    valueExpr?: string;
}

const DropdownGridTreeMultiple: React.FC<DropdownGridTreeProps> = ({
    onChange,
    displayExpr = 'Name',
    valueExpr = 'EmployeeID'
}) => {
    const gridRef = useRef<any>(null);
    const treeGridRef = useRef<any>(null);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [selectedTreeValues, setSelectedTreeValues] = useState<string[]>([]);

    // 数据源
    const data = [
        { EmployeeID: 1, Name: '张三', age: 30, department: '销售部' },
        { EmployeeID: 2, Name: '李四', age: 28, department: '市场部' },
        { EmployeeID: 3, Name: '王五', age: 35, department: '技术部' },
        { EmployeeID: 4, Name: '赵六', age: 32, department: '人事部' },
        { EmployeeID: 5, Name: '钱七', age: 27, department: '财务部' },
    ];

    const treeData = [
        {
            "EmployeeID": 1, "Name": "张三", "ReportsTo": 2, "Country": "中国",
            "Title": "销售代表", "HireDate": "1992-05-01", "BirthDate": "1948-12-08",
            "City": "北京", "Address": "朝阳区 xx街 xx号"
        },
        {
            "EmployeeID": 2, "Name": "李四", "ReportsTo": null, "Country": "中国",
            "Title": "销售副总裁", "HireDate": "1992-08-14", "BirthDate": "1952-02-19",
            "City": "上海", "Address": "浦东新区 xx路 xx号"
        },
        // ... 其他树形数据
    ];

    const columns = [
        { label: 'ID', dataField: 'EmployeeID', width: 50 },
        { label: '姓名', dataField: 'Name', width: 100 },
        { label: '年龄', dataField: 'age', width: 80 },
        { label: '部门', dataField: 'department', width: 120 },
    ];

    const treeColumns = [
        { label: '姓名', dataField: 'Name', width: 100 },
        { label: '职位', dataField: 'Title', width: 160 },
        { label: '出生日期', dataField: 'BirthDate', cellsFormat: 'd', width: 120 },
        { label: '入职日期', dataField: 'HireDate', cellsFormat: 'd', width: 120 },
        { label: '地址', dataField: 'Address', width: 250 },
        { label: '城市', dataField: 'City', width: 120 },
        { label: '国家', dataField: 'Country' }
    ];

    const treeDataSourceSettings = {
        keyDataField: 'EmployeeID',
        parentDataField: 'ReportsTo',
        id: 'EmployeeID',
        dataFields: [
            { name: 'EmployeeID', type: 'number' },
            { name: 'ReportsTo', type: 'number' },
            { name: 'Name', type: 'string' },
            { name: 'Country', type: 'string' },
            { name: 'City', type: 'string' },
            { name: 'Address', type: 'string' },
            { name: 'Title', type: 'string' },
            { name: 'HireDate', type: 'date' },
            { name: 'BirthDate', type: 'date' }
        ]
    };

    // 下拉网格的数据源
    const dropdownDataMemo = useMemo(() => [
        { id: 1, displayName: '选项A', value: 'A' },
        { id: 2, displayName: '选项B', value: 'B' },
        { id: 3, displayName: '选项C', value: 'C' },
    ], []);

    const handleConfirm = useCallback((gridType: 'normal' | 'tree') => {
        if (gridType === 'normal') {
            const selectedRows = gridRef.current?.getSelection()?.rows.map((rowObj: any) => rowObj?.row?.data) || [];
            // 存储值用于数据源
            const values = selectedRows?.map((row: any) => row[valueExpr] || '');
            setSelectedValues(values);
            // 显示值用于界面展示
            const displayValues = selectedRows?.map((row: any) => row[displayExpr] || '');

            if (gridRef.current) {
                const displayText = displayValues.join(', ');
                gridRef.current.value = values.join(','); // 存储实际值
                gridRef.current.closeDropDown();

                const container = document.getElementById('gridContainerMultiple');
                const dropDownButton = container?.querySelector('.smart-grid-drop-down-button .smart-action-button');
                if (dropDownButton) {
                    dropDownButton.innerHTML = displayText || '请选择'; // 显示显示值
                }
            }
            onChange?.(selectedRows);
        } else {

            // 使用 getSelection 获取已选中的行 
            const selectedRows = treeGridRef.current?.getSelection()?.rows.map((rowObj: any) => rowObj?.row?.data) || [];
            const displayValues = selectedRows?.map((row: any) => row?.[displayExpr] || '');
            setSelectedTreeValues(displayValues);

            if (treeGridRef.current) {
                const displayText = displayValues.join(', ');
                treeGridRef.current.value = displayText;
                treeGridRef.current.closeDropDown();

                const container = document.getElementById('treeGridContainerMultiple');
                const dropDownButton = container?.querySelector('.smart-grid-drop-down-button .smart-action-button');
                if (dropDownButton) {
                    dropDownButton.innerHTML = displayText || '请选择';
                }
            }
            onChange?.(selectedRows);
        }
    }, [displayExpr, valueExpr, onChange]);

    const handleCancel = (gridType: 'normal' | 'tree') => {
        if (gridType === 'normal') {
            if (gridRef.current) {
                gridRef.current.clearSelection();
                gridRef.current.closeDropDown();
                const container = document.getElementById('gridContainerMultiple');
                const dropDownButton = container?.querySelector('.smart-grid-drop-down-button .smart-action-button');
                if (dropDownButton) {
                    dropDownButton.innerHTML = '请选择';
                }
            }
        } else {
            if (treeGridRef.current) {
                treeGridRef.current.clearSelection();
                treeGridRef.current.closeDropDown();
                const container = document.getElementById('treeGridContainerMultiple');
                const dropDownButton = container?.querySelector('.smart-grid-drop-down-button .smart-action-button');
                if (dropDownButton) {
                    dropDownButton.innerHTML = '请选择';
                }
            }
        }
    };

    const handleRender = (event: any) => {
        const comfirmBtn = document.getElementById('footerTemplateConfirm');
        if (comfirmBtn) {
            comfirmBtn.addEventListener('click', () => handleConfirm('normal'));
        }

        const cancelBtn = document.getElementById('footerTemplateCancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => handleCancel('normal'));
        }
    };

    const handleTreeGridRender = (event: any) => {
        const comfirmBtn = document.getElementById('footerTemplateConfirmTree');
        if (comfirmBtn) {
            comfirmBtn.addEventListener('click', () => handleConfirm('tree'));
        }

        const cancelBtn = document.getElementById('footerTemplateCancelTree');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => handleCancel('tree'));
        }
    }


    const gridContainerMultipleFooterOptions = {
        visible: true,
        template: (element: HTMLElement) => {
            element.innerHTML = `
              <div style="text-align: right;" >
                <button 
                  id="footerTemplateConfirm"
                  style="margin: 5px; padding: 5px 10px; cursor: pointer"
                >
                  确认
                </button>
                <button 
                  id="footerTemplateCancel"
                  style="margin: 5px; padding: 5px 10px; cursor: pointer"
                >
                  取消
                </button>
              </div>
            `;
        }
    }

    const treeGridContainerMultipleFooterOptions = {
        visible: true,
        template: (element: HTMLElement) => {
            element.innerHTML = `
              <div style="text-align: right;" >
                <button 
                  id="footerTemplateConfirmTree"
                  style="margin: 5px; padding: 5px 10px; cursor: pointer"
                >
                  确认
                </button>
                <button
                  id="footerTemplateCancelTree"
                  style="margin: 5px; padding: 5px 10px; cursor: pointer"
                >
                  取消
                </button>
              </div>
            `;
        }
    }

    return (
        <div>
            <h3 className="sticky-header component-header">
                3A. 下拉网格/下拉树形网格多选示例
                <a href="https://www.htmlelements.com/demos/grid/dropdowngrid/" target="_blank" rel="noopener noreferrer">
                    {" "}查看 Smart.Grid（DropdownGrid） 文档
                </a>
            </h3>

            <h4>下拉网格（多选）</h4>
            <div id="gridContainerMultiple">
                <div>存储值： {selectedValues.join(', ')}</div>
                <Grid
                    ref={gridRef}
                    dropDownMode
                    dataSource={data}
                    columns={columns}
                    sorting={{ enabled: true }}
                    filtering={{ enabled: true }}
                    header={{visible: true, buttons: ['search']}}
                    selection={{
                        enabled: true,
                        checkBoxes: {
                            autoShow: true,
                            enabled: true,
                            selectAllMode: 'all'
                        }
                    }}
                    // onRowClick={handleSelect}
                    appearance={{ alternationCount: 2, allowHover: true }}
                    footer={gridContainerMultipleFooterOptions}
                    onRender={handleRender}
                />
            </div>

            <h4>下拉树形网格（多选）</h4>
            <div id="treeGridContainerMultiple">
                <Grid
                    ref={treeGridRef}
                    appearance={{ allowHover: true, }}
                    dropDownMode={true}
                    selection={{
                        enabled: true,
                        checkBoxes: {
                            autoShow: true,
                            enabled: true,
                            selectAllMode: 'all',
                        }
                    }}
                    dataSource={treeData}
                    columns={treeColumns}
                    sorting={{ enabled: true }}
                    filtering={{ enabled: true }}
                    dataSourceSettings={treeDataSourceSettings}
                    footer={treeGridContainerMultipleFooterOptions}
                    onRender={handleTreeGridRender}
                // appearance={}
                // footer={
                //     <div style={{ padding: '8px', textAlign: 'right' }}>
                //         <button style={buttonStyle} onClick={() => handleConfirm('tree')}>确认</button>
                //         <button style={buttonStyle} onClick={() => handleCancel('tree')}>取消</button>
                //     </div>
                // }
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <strong>下拉网格选中的值：</strong> {selectedValues.join(', ')}
            </div>
            <div style={{ marginTop: '10px' }}>
                <strong>下拉树形网格选中的值：</strong> {selectedTreeValues.join(', ')}
            </div>
        </div>
    );
};

export default DropdownGridTreeMultiple;