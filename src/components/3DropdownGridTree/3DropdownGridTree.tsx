import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Grid } from 'smart-webcomponents-react/grid';
import styles from './3DropdownGridTree.module.scss';

interface DropdownGridTreeProps {
    onChange?: (data: any) => void;
    displayExpr?: string;
    valueExpr?: string;
    // 数据源
    dataSource?: any[];
    // 多选模式
    multiple?: boolean;
}

const DropdownGridTree: React.FC<DropdownGridTreeProps> = ({
    dataSource,
    multiple,
    onChange,
    displayExpr = 'Name',  // 默认显示字段
    valueExpr = 'EmployeeID'      // 默认值字段
}) => {
    const gridRef = useRef<any>(null);
    const treeGridRef = useRef<any>(null);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [selectedTreeValue, setSelectedTreeValue] = useState<string>('');
    const [searchValue, setSearchValue] = useState('');
    const [treeSearchValue, setTreeSearchValue] = useState('');

    const data = [
        { EmployeeID: 1, Name: '张三', age: 30, department: '销售部' },
        { EmployeeID: 2, Name: '李四', age: 28, department: '市场部' },
        { EmployeeID: 3, Name: '王五', age: 35, department: '技术部' },
        { EmployeeID: 4, Name: '赵六', age: 32, department: '人事部' },
        { EmployeeID: 5, Name: '钱七', age: 27, department: '财务部' },
    ];

    const treeData = [{
        "EmployeeID": 1,
        "Name": "张三",
        "ReportsTo": 2,
        "Country": "中国",
        "Title": "销售代表",
        "HireDate": "1992-05-01 00:00:00",
        "BirthDate": "1948-12-08 00:00:00",
        "City": "北京",
        "Address": "朝阳区 xx街 xx号"
    },
    {
        "EmployeeID": 2,
        "Name": "李四",
        "ReportsTo": null,
        "Country": "中国",
        "Title": "销售副总裁",
        "HireDate": "1992-08-14 00:00:00",
        "BirthDate": "1952-02-19 00:00:00",
        "City": "上海",
        "Address": "浦东新区 xx路 xx号"
    },
    {
        "EmployeeID": 3,
        "Name": "王五",
        "ReportsTo": 2,
        "Country": "中国",
        "Title": "销售经理",
        "HireDate": "1994-01-02 00:00:00",
        "BirthDate": "1960-05-29 00:00:00",
        "City": "北京",
        "Address": "海淀区 xx路 xx号"
    },
    {
        "EmployeeID": 4,
        "Name": "赵六",
        "ReportsTo": 2,
        "Country": "中国",
        "Title": "销售代表",
        "HireDate": "1993-05-03 00:00:00",
        "BirthDate": "1937-09-19 00:00:00",
        "City": "上海",
        "Address": "浦东新区 xx路 xx号"
    },
    {
        "EmployeeID": 5,
        "Name": "钱七",
        "ReportsTo": 2,
        "Country": "中国",
        "Title": "销售经理",
        "HireDate": "1993-10-17 00:00:00",
        "BirthDate": "1955-03-04 00:00:00",
        "City": "北京",
        "Address": "朝阳区 xx街 xx号"
    },
    {
        "EmployeeID": 6,
        "Name": "周八",
        "ReportsTo": 5,
        "Country": "中国",
        "Title": "销售代表",
        "HireDate": "1993-10-17 00:00:00",
        "BirthDate": "1963-07-02 00:00:00",
        "City": "上海",
        "Address": "浦东新区 xx路 xx号"
    },
    {
        "EmployeeID": 7,
        "Name": "吴九",
        "ReportsTo": 5,
        "Country": "中国",
        "Title": "销售代表",
        "HireDate": "1994-01-02 00:00:00",
        "BirthDate": "1960-05-29 00:00:00",
        "City": "北京",
        "Address": "海淀区 xx路 xx号"
    },
    {
        "EmployeeID": 8,
        "Name": "郑���",
        "ReportsTo": 2,
        "Country": "中国",
        "Title": "销售经理",
        "HireDate": "1994-03-05 00:00:00",
        "BirthDate": "1958-01-09 00:00:00",
        "City": "北京",
        "Address": "朝阳区 xx街 xx号"
    },
    {
        "EmployeeID": 9,
        "Name": "孙十一",
        "ReportsTo": 5,
        "Country": "中国",
        "Title": "销售代表",
        "HireDate": "1994-11-15 00:00:00",
        "BirthDate": "1966-01-27 00:00:00",
        "City": "上海",
        "Address": "浦东新区 xx路 xx号"
    }
    ];

    const columns = [
        { label: 'ID', dataField: 'EmployeeID', width: 50 },
        { label: '姓名', dataField: 'Name', width: 100 },
        { label: '年龄', dataField: 'age', width: 80 },
        { label: '部门', dataField: 'department', width: 120 },
    ];

    const treeColumns = [{
        label: '姓名',
        dataField: 'Name',
        width: 100,
    },
    {
        label: '职位',
        dataField: 'Title',
        width: 160
    },
    {
        label: '出生日期',
        dataField: 'BirthDate',
        cellsFormat: 'd',
        width: 120
    },
    {
        label: '入职日期',
        dataField: 'HireDate',
        cellsFormat: 'd',
        width: 120
    },
    {
        label: '地址',
        dataField: 'Address',
        width: 250
    },
    {
        label: '城市',
        dataField: 'City',
        width: 120
    },
    {
        label: '国家',
        dataField: 'Country'
    }
    ];

    // 过滤数据
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) {
            return data;
        }
        const filtered = data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchValue.toLowerCase())
            )
        );
        
        // 确保网格刷新
        if (gridRef.current) {
            // 方案1: 使用 setTimeout 确保在下一个事件循环中刷新
            setTimeout(() => {
                gridRef.current.refresh();
            }, 0);
            
            // // 或者方案2: 直接更新数据源
            // gridRef.current.dataSource = filtered;
        }
        
        return filtered;
    }, [searchValue, data]);

    const filteredTreeData = useMemo(() => {
        if (!treeSearchValue?.trim()) {
            return treeData;
        }
        return treeData.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(treeSearchValue.toLowerCase())
            )
        );
    }, [treeData, treeSearchValue]);

    const handleSelect = (event: any) => {
        const selectedRow = event.detail.data;
        if (selectedRow) {
            const displayValue = selectedRow[displayExpr] || '';
            setSelectedValue(displayValue);

            if (gridRef.current) {
                gridRef.current.value = displayValue;
                gridRef.current.closeDropDown();

                const container = document.getElementById('gridContainer');
                const dropDownButton = container?.querySelector('.smart-grid-drop-down-button .smart-action-button');
                if (dropDownButton) {
                    dropDownButton.innerHTML = displayValue;
                }

            }

            onChange?.(selectedRow);
        } else {
            setSelectedValue('');
            onChange?.(null);
        }
    };

    const handleTreeSelect = (event: any) => {
        const selectedRow = event.detail.data;
        if (selectedRow) {
            const displayValue = selectedRow[displayExpr] || '';
            setSelectedTreeValue(displayValue);

            if (treeGridRef.current) {
                treeGridRef.current.value = displayValue;
                treeGridRef.current.closeDropDown();


                const container = document.getElementById('treeGridContainer');
                const dropDownButton = container?.querySelector('.smart-grid-drop-down-button .smart-action-button');
                if (dropDownButton) {
                    dropDownButton.innerHTML = displayValue;
                }

            }

            onChange?.(selectedRow);
        } else {
            setSelectedTreeValue('');
            onChange?.(null);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);

        // 当搜索框清空时，重置网格状态
        if (!value?.trim() && gridRef.current) {
            gridRef.current.refresh();
        }
    };

    const handleTreeSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setTreeSearchValue(value);

        // 当搜索框清空时，重置树形网格状态
        if (!value?.trim() && treeGridRef.current) {
            treeGridRef.current.refresh();
        }
    };

    const gridHeaderTemplate = (element: HTMLElement) => {
        element.innerHTML = `
            <div class="${styles.searchContainer}">
                <input
                    type="text" 
                    class="${styles.searchInput}"
                    placeholder="搜索..."
                    value="${searchValue}"
                />
                ${searchValue ? `
                    <button class="${styles.clearButton}">
                        <span>×</span>
                    </button>
                ` : ''}
            </div>
        `;

        const input = element.querySelector('input');
        const clearButton = element.querySelector(`.${styles.clearButton}`);

        if (input) {
            input.addEventListener('input', (e) => {
                const value = (e.target as HTMLInputElement).value;
                setSearchValue(value);
                if (!value && gridRef.current) {
                    gridRef.current.refresh();
                }
            });
        }

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                setSearchValue('');
                if (gridRef.current) {
                    gridRef.current.refresh();
                }
                // 重新渲染模板以移除清除按钮
                gridHeaderTemplate(element);
            });
        }
    };

    const treeHeaderTemplate = (element: HTMLElement) => {
        element.innerHTML = `
            <div class="${styles.searchContainer}">
                <input 
                    type="text" 
                    class="${styles.searchInput}"
                    placeholder="搜索..."
                    value="${treeSearchValue}"
                />
                ${treeSearchValue ? `
                    <button class="${styles.clearButton}">
                        <span>×</span>
                    </button>
                ` : ''}
            </div>
        `;

        const input = element.querySelector('input');
        const clearButton = element.querySelector(`.${styles.clearButton}`);

        if (input) {
            input.addEventListener('input', (e) => {
                const value = (e.target as HTMLInputElement).value;
                setTreeSearchValue(value);
                if (!value && treeGridRef.current) {
                    treeGridRef.current.refresh();
                }
            });
        }

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                setTreeSearchValue('');
                if (treeGridRef.current) {
                    treeGridRef.current.refresh();
                }
                // 重新渲染模板以移除清除按钮
                treeHeaderTemplate(element);
            });
        }
    };

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

    return (
        <div>
            <h3 className="sticky-header component-header">
                3. 下拉网格/下拉树形网格示例
                <a href="https://www.htmlelements.com/demos/grid/dropdowngrid/" target="_blank" rel="noopener noreferrer">
                    {" "}查看 Smart.Grid（DropdownGrid） 文档
                </a>
            </h3>

            <h4>下拉网格</h4>
            <div id='gridContainer'>
                <div>{JSON.stringify(filteredData)}</div>
                <Grid
                    ref={gridRef}
                    dropDownMode
                    dataSource={filteredData}
                    columns={columns}
                    filtering={{ enabled: false }}
                    selection={{ enabled: true, mode: 'one' }}
                    onRowClick={handleSelect}
                    appearance={{ alternationCount: 2, allowHover: true }}
                    header={{
                        visible: true,
                        template: gridHeaderTemplate
                    }}
                    onRender={() => {
                        // 初始化时设置下拉按钮的文本
                        if (gridRef.current) {
                            const dropDownButton = gridRef.current.element?.querySelector('.smart-grid-drop-down-button .smart-action-button');
                            if (dropDownButton) {
                                dropDownButton.innerHTML = '选择一个选项';
                            }
                        }

                    }}
                />
            </div>

            <h4>下拉树形网格</h4>
            <div id="treeGridContainer">
                <Grid
                    ref={treeGridRef}
                    appearance={{ allowHover: true }}
                    dropDownMode={true}
                    dataSource={filteredTreeData}
                    columns={treeColumns}
                    sorting={{ enabled: true }}
                    filtering={{ enabled: false }}
                    selection={{ enabled: true, mode: 'one' }}
                    dataSourceSettings={treeDataSourceSettings}
                    onRowClick={handleTreeSelect}
                    header={{
                        visible: true,
                        template: treeHeaderTemplate
                    }}
                    onRender={() => {
                        if (treeGridRef.current) {
                            const dropDownButton = treeGridRef.current.element?.querySelector('.smart-grid-drop-down-button .smart-action-button');
                            if (dropDownButton) {
                                dropDownButton.innerHTML = '选择一个选项';
                            }
                        }
                    }}
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <strong>下拉网格选中的值：</strong> {selectedValue}
            </div>
            <div style={{ marginTop: '10px' }}>
                <strong>下拉树形网格选中的值：</strong> {selectedTreeValue}
            </div>
        </div>
    );
};

export default DropdownGridTree;