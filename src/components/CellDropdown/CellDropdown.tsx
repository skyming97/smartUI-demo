import React, { useState, useRef } from 'react';
import { Grid, GridColumn, GridDataSourceSettings } from 'smart-webcomponents-react/grid';
import styles from './CellDropdown.module.scss';

interface CellDropdownProps {
    /** 主表格数据源 */
    dataSource: any[];
    /** 下拉选项数据源 */
    dropdownDataSource?: any[];
    /** 显示字段 */
    displayExpr?: string;
    /** 存储字段 */
    valueExpr?: string;
    /** 数据改变回调 */
    onChange?: (data: any) => void;
}

// 示例数据
const defaultDropdownData = [
    { id: 1, name: '选项1', value: 'A' },
    { id: 2, name: '选项2', value: 'B' },
    { id: 3, name: '选项3', value: 'C' },
    { id: 4, name: '选项4', value: 'D' },
];

const CellDropdown: React.FC<CellDropdownProps> = ({
    dataSource = [],
    dropdownDataSource = defaultDropdownData,
    displayExpr = 'name',
    valueExpr = 'value',
    onChange
}) => {
    const gridRef = useRef<any>(null);
    const [gridData, setGridData] = useState(dataSource);
    const [selectionMode, setSelectionMode] = useState<'one' | 'many'>('one');

    // 数据源设置
    const dataSourceSettings: GridDataSourceSettings = {
        dataFields: [
            { name: 'id', dataType: 'number' },
            { name: 'name', dataType: 'string' },
            { name: 'value', dataType: 'string' }
        ],
        // 定义关联数据
        relations: [
            {
                id: 'lookupData',
                dataSource: dropdownDataSource,
                // test: 'test',
                columns: [
                    { label: 'ID', dataField: 'id', width: 100 },
                    { label: '名称', dataField: displayExpr, width: 150 },
                    { label: '值', dataField: valueExpr, width: 100 }
                ]
            }
        ]
    };

    // 主表格列配置
    const columns: GridColumn[] = [
        { label: 'ID', dataField: 'id', width: 100 },
        { label: '名称', dataField: 'name', width: 150 },
        {
            label: '下拉网格',
            width: 200,
            relationId: 'lookupData',
            relationField: 'value',
            dataField: 'value',
            template: 'list',
            showIcon: true,
            icon: 'lastName',
            editor: {
                template: 'multiComboInput',
                readonly: true,
				colorItems: true,
				dropDownButtonPosition: 'right',
				autoOpen: true,
				relationId: 'lookupData',
                // relationField: 'value',
                singleSelect: selectionMode === 'one'
            }
        }
    ];

    // 处理选择模式切换
    const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectionMode(e.target.value as 'one' | 'many');
        if (gridRef.current) {
            gridRef.current.refresh();
        }
    };

    // 处理数据变化
    const handleChange = (event: any) => {
        // const { value, row, column } = event.detail;
        // if (column.dataField === 'value') {
        //     const newData = [...gridData];
        //     newData[row.index][column.dataField] = value;
        //     setGridData(newData);
        //     onChange?.(newData);
        // }
    };

    return (
        <div className={styles.container}>
            <div className={styles.modeSelector}>
                <label>
                    <input
                        type="radio"
                        name="mode"
                        value="one"
                        checked={selectionMode === 'one'}
                        onChange={handleModeChange}
                    />
                    单选模式
                </label>
                <label>
                    <input
                        type="radio"
                        name="mode"
                        value="many"
                        checked={selectionMode === 'many'}
                        onChange={handleModeChange}
                    />
                    多选模式
                </label>
            </div>

            <Grid
                ref={gridRef}
                dataSource={gridData}
                columns={columns}
                dataSourceSettings={dataSourceSettings}
                appearance={{ allowHover: true }}
                selection={{ enabled: true, mode: 'extended' }}
                editing={{
                    enabled: true,
                    mode: 'cell'
                }}
            // onCellUpdate={handleChange}
            />
        </div>
    );
};

export default CellDropdown; 