import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Grid } from 'smart-webcomponents-react/grid';
import type { GridAppearance, GridCell, GridFiltering, GridHeader } from 'smart-webcomponents-react/grid';
import { createPopper } from '@popperjs/core';
import styles from './3BCellDropdownGrid.module.scss'

interface DropdownGridTreeProps {
    /** 数据源 */
    dataSource: any[];
    /** 数据源配置 */
    dropdownDataSourceSettings?: any;
    /** 多选模式 */
    multiple?: boolean;
    /** 树形模式 */
    isTree?: boolean;
    cellEditable?: boolean;
    /** 数据改变回调 */
    onChange?: (data: any) => void;
    /** 显示字段 */
    displayExpr?: string;
    /** 值字段 */
    valueExpr?: string;
    /** 焦点行改变回调 */
    onFocusedRowChange?: (e: any) => void;
}

//#region  ################################## SmartUI Grid 配置 ##################################

const cellDropdownGridFooterOptions = {
    visible: true,
    template: (element: HTMLElement) => {
        element.innerHTML = `
          <div style="text-align: right;" >
            <button 
              id="footerTemplateConfirmBtn"
              style="margin: 5px; padding: 5px 10px; cursor: pointer"
            >
              确认
            </button>
            <button
              id="footerTemplateCancelBtn"
              style="margin: 5px; padding: 5px 10px; cursor: pointer"
            >
              取消
            </button>
          </div>
        `;
    }
}

const filteringOptions: GridFiltering = {
    enabled: true,
}

const appearanceOptions: GridAppearance = {
    allowHover: true,
}

const headerOptions: GridHeader = {
    visible: true,
    buttons: ['search']
};

//#endregion

const CellDropdownGridTree: React.FC<DropdownGridTreeProps> = ({
    dataSource,
    multiple,
    onChange,
    displayExpr = 'name',
    valueExpr = 'val',
    dropdownDataSourceSettings,
    isTree,
    cellEditable,
    onFocusedRowChange
}) => {
    const gridRef = useRef<any>(null);
    const dropdownGridRef = useRef<any>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const popperRef = useRef<HTMLDivElement | null>(null);
    const popperInstanceRef = useRef<any>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [currentCell, setCurrentCell] = useState<any>(null);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [gridData, setGridData] = useState(dataSource);
    const [searchValue, setSearchValue] = useState('');


    /** 下拉网格的数据源 */
    const dropdownDataMemo = React.useMemo(() => {
        if (isTree) {
            return [
                { pid: null, id: 1, name: '选项A', val: 'A' },
                { pid: 1, id: 11, name: '选项A-1', val: 'A-1' },
                { pid: 1, id: 12, name: '选项A-2', val: 'A-2' },
                { pid: 1, id: 13, name: '选项A-3', val: 'A-3' },
                { pid: null, id: 2, name: '选项B', val: 'B' },
                { pid: 2, id: 21, name: '选项B-1', val: 'B-1' },
                { pid: 2, id: 22, name: '选项B-2', val: 'B-2' },
                { pid: null, id: 3, name: '选项C', val: 'C' },
                { pid: 3, id: 31, name: '选项C-1', val: 'C-1' },
                { pid: 3, id: 32, name: '选项C-2', val: 'C-2' },
            ]
        }
        return [
            { id: 1, name: '选项A', val: 'A' },
            { id: 2, name: '选项B', val: 'B' },
            { id: 3, name: '选项C', val: 'C' },
            { id: 4, name: '选项D', val: 'D' },
            { id: 5, name: '选项E', val: 'E' },
        ];
    }, [isTree]);

    // 格式化显示值的函数
    const formatDisplayValue = useCallback((valueStr: string) => {
        console.log('%c [ formatDisplayValue valueStr ]-116', 'font-size:13px; background:#5DA979; color:#007AFF;', valueStr);
        if (!valueStr) {
            return '请选择';
        }
        // 如果不带,，则是单选
        if (!valueStr.includes(',')) {
            const item = dropdownDataMemo.find((item: any) => item[valueExpr] === valueStr?.toString());
            return item ? item[displayExpr as keyof typeof item] : '请选择';
        }

        const values = valueStr?.split(',');
        const items = dropdownDataMemo.filter((item: any) => {
            return values.includes(item[valueExpr]?.toString());
        });
        const formattedValues = items.map((item: any) => item[displayExpr]).join(',');
        return formattedValues;
    }, [dropdownDataMemo, displayExpr, valueExpr]);

    // 定义异步验证函数
    const validateCell = async <T extends { valid: boolean, message?: string }>(value: any, rowId: string, dataField: string): Promise<T> => {
        // 模拟异步验证
        return new Promise((resolve) => {
            setTimeout(() => {


                const regex = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
                if (!regex.test(value)) {
                    resolve({
                        valid: false,
                        message: '年龄格式错误'
                    } as T);
                }

                // 这里可以进行实际的验证逻辑
                if (!value) {
                    resolve({
                        valid: false,
                        message: '该字段不能为空'
                    } as T);
                } else {
                    resolve({
                        valid: true
                    } as T);
                }
            }, 500);
        });
    };

    // 在列定义中添加验证配置
    const columns = [
        { label: 'ID', dataField: 'EmployeeID', width: 50 },
        { label: '姓名', dataField: 'Name', width: 100 },
        {
            label: '年龄', dataField: 'age', width: 80,
        },
        { label: '部门', dataField: 'department', width: 120 },
        {
            label: '选择',
            dataField: 'selectedValue',
            width: 200,
            formatFunction(settings: any) {
                settings.template = `<div class="cell-dropdown-trigger">${formatDisplayValue(settings.value)}</div>`;
            },
            editor: {
                template: '#dropdownTemplate',
                onRender: (row: number, column: string, editor: any, rowData: any) => {
                    const value = rowData[column];
                    editor.innerHTML = `<div class="cell-dropdown-trigger">${formatDisplayValue(value)}</div>`;
                },
                getValue: (value: any) => {
                    // 直接返回原始值，保持存值不变
                    return value;
                },
                setValue: (value: any) => {
                    // // ... existing code ...
                    // const newData = [...gridData];
                    // if (currentCell) {
                    //     // 更新对应行的 selectedValue
                    //     newData[currentCell.rowIndex].selectedValue = value;
                    //     setGridData(newData);
                    // }
                    return value;
                }
            }
        },
    ];



    // 下拉网格的列配置
    const dropdownColumns = [
        { label: 'ID', dataField: 'id', width: 150 },
        { label: '名称', dataField: 'name', width: 150 },
        { label: '值', dataField: 'val', width: 150 },
    ];

    // 更新 Popper 位置
    const updatePopperPosition = useCallback(() => {
        if (popperInstanceRef.current) {
            popperInstanceRef.current.update();
        }
    }, []);

    // 处理滚动事件
    useEffect(() => {
        if (dropdownVisible) {
            // 监听页面滚动，更新弹框位置
            window.addEventListener('scroll', updatePopperPosition);
            window.addEventListener('resize', updatePopperPosition);

            return () => {
                window.removeEventListener('scroll', updatePopperPosition);
                window.removeEventListener('resize', updatePopperPosition);
            };
        }
    }, [dropdownVisible, updatePopperPosition]);

    // 点击外部关闭下拉框
    const handleClickOutside = (event: MouseEvent) => {
        const dropdownGrid = document.getElementById('cellDropdownGrid');
        const cell = event.target as HTMLElement;
        // 如果点击的是smartUI Grid的搜索框，则不关闭选框
        if (cell.closest('.smart-data-view-header-drop-down.search-panel')) {
            return;
        }
        if (dropdownGrid && !dropdownGrid.contains(cell) && !cell.closest('.smart-grid-cell')) {
            setDropdownVisible(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // 初始化 Popper
    useEffect(() => {

        if (triggerRef.current && popperRef.current) {

            popperInstanceRef.current = createPopper(triggerRef.current, popperRef.current, {
                placement: 'bottom-start',
                modifiers: [
                    {
                        name: 'flip',
                        options: {
                            fallbackPlacements: ['top-start'],
                        },
                    },
                    {
                        name: 'preventOverflow',
                        options: {
                            boundary: 'viewport',
                        },
                    },
                ],
            });

        } else {
        }

        return () => {
            if (popperInstanceRef.current) {
                popperInstanceRef.current.destroy();
                popperInstanceRef.current = null;
            }
        };
    }, [dropdownVisible]);

    const handleConfirm = useCallback(() => {
        if (currentCell && dropdownGridRef.current) {
            const selectedRows = dropdownGridRef.current.getSelection()?.rows || [];
            if (selectedRows.length > 0) {
                // 获取选中的行数据
                const selectedRowsData = selectedRows.map((row: any) => row.row.data);
                // 存储 value 值
                const selectedValues = selectedRowsData.map((row: any) => row[valueExpr]);
                // 更新网格数据
                const newData = [...gridData];
                newData[currentCell.rowIndex].selectedValue = selectedValues.join(',')

                setGridData(newData);

                // 更新选中值
                setSelectedValue(multiple ? selectedValues.join(',') : selectedValues[0]);

                // 更新单元格显示
                if (gridRef.current) {
                    gridRef.current.refresh();
                }
                // 触发onChange回调
                onChange?.(newData);
            }
            // 关闭下拉框
            setDropdownVisible(false);
        }
    }, [currentCell, gridData, onChange, multiple, valueExpr]);

    const handleCancel = useCallback(() => {
        if (dropdownGridRef.current) {
            // 清除选择
            dropdownGridRef.current.clearSelection();
            // 关闭下拉框
            setDropdownVisible(false);
        }
    }, []);

    const handleRender = useCallback((event: any) => {
        // 移除旧的事件监听器
        const topElement = document.getElementById('cellDropdownGrid');
        const confirmBtn = topElement?.querySelector('#footerTemplateConfirmBtn');
        const cancelBtn = topElement?.querySelector('#footerTemplateCancelBtn');

        if (confirmBtn) {
            // 移除旧的事件监听器
            const oldConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode?.replaceChild(oldConfirmBtn, confirmBtn);
            // 添加新的事件监听器
            oldConfirmBtn.addEventListener('click', handleConfirm);
        }

        if (cancelBtn) {
            // 移除旧的事件监听器
            const oldCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode?.replaceChild(oldCancelBtn, cancelBtn);
            // 添加新的事件监听器
            oldCancelBtn.addEventListener('click', handleCancel);
        }
    }, [handleConfirm, handleCancel]);

    // 使用useEffect监听dropdownVisible的变化来触发handleRender
    useEffect(() => {
        if (dropdownVisible) {
            handleRender(null);
        }
    }, [dropdownVisible, handleRender]);

    /** 处理下拉网格的选中事件(单选使用) */
    const handleDropdownSelect = (event: any) => {
        if (!multiple) {
            if (currentCell) {
                const selectedRow = event.detail.data;
                const newData = [...gridData];
                // 存储 id 值而不是显示值
                newData[currentCell.rowIndex].selectedValue = selectedRow[valueExpr];
                setGridData(newData);
                // 刷新主网格
                gridRef.current?.refresh();
                setSelectedValue(selectedRow[valueExpr]);
                setDropdownVisible(false);
                onChange?.(newData);
            }
        }
    };

    // 处理主网格的单元格点击事件
    const handleCellClick = useCallback((event: any) => {
        const { dataField, cell } = event.detail;

        // 获取焦点行数据
        const focusedRow = getFocusedRow();
        onFocusedRowChange?.(focusedRow);

        if (dataField === 'selectedValue') {

            const cellEle = cell?.element;
            if (cellEle) {
                triggerRef.current = cellEle;
                setCurrentCell({
                    rowIndex: cell.row.index,
                    dataField: dataField,

                });
                setDropdownVisible(true);
                dropdownGridRef.current?.clearSelection();
            }
        }
    }, []);

    // 监听下拉框显示状态变化
    useEffect(() => {
        if (dropdownVisible && dropdownGridRef.current) {
            // 确保在下拉框显示时清除选中状态
            dropdownGridRef.current.clearSelection();
        }
    }, [dropdownVisible]);

    // 处理下拉框内的滚动
    const handleDropdownScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }, []);

    // 添加编辑器模板
    useEffect(() => {
        const template = document.createElement('template');
        template.id = 'dropdownTemplate';
        template.innerHTML = `<div class="cell-dropdown-trigger"></div>`;
        document.body.appendChild(template);

        return () => {
            const templateElement = document.getElementById('dropdownTemplate');
            if (templateElement) {
                document.body.removeChild(templateElement);
            }
        };
    }, []);

    // 过滤后的数据源
    const filteredDataSource = useMemo(() => {
        if (!searchValue) return dropdownDataMemo;

        return dropdownDataMemo.filter((item: any) => {
            return item[displayExpr].toLowerCase().includes(searchValue.toLowerCase());
        });
    }, [dropdownDataMemo, searchValue, displayExpr]);

    // 处理搜索输入
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    // 在组件中添加获取焦点行的方法
    const getFocusedRow = () => {
        if (gridRef.current) {
            const selection = gridRef.current.getSelection();
            if (selection && selection.focused) {
                const focused = selection.focused;
                const focusedRowId = focused.id;

                // 获取焦点行的完整数据
                const focusedRowData = gridRef.current.getRow(focusedRowId);


                return focusedRowData;
            }
        }
        return null;
    };

    // onCellUpdate?: {(cells: GridCell[], oldValues: any[], values: any[], confirm: {(commit: boolean): void}): void};
    const handleCellUpdate = async (cells: GridCell[], oldValues: any[], values: any[], confirm: { (commit: boolean): void }) => {
        try {
            const { row, column } = cells[0];
            const newValue = values[0]; // 使用 values 数组中的新值

            if (column.dataField !== 'age') { return confirm(true) }

            const { valid, message } = await validateCell<{ valid: boolean, message?: string }>(
                newValue,  // 使用新值进行验证
                row.id,
                column.dataField
            );

            if (!valid) {
                confirm(false);
                alert(message);
            } else {
                confirm(true);
            }
        } catch (error) {
            confirm(false);
        }
    };

    return (
        <div>
            <h3 className="sticky-header component-header">
                3B. 下拉网格单元格示例
            </h3>
            <h3>1、SmartUI 下拉网格列需要有 显示值，存储值，显示值是在单元格渲染时显示的，而存储值是绑定在数据源中的。并且单元格的下拉网格需要支持搜索功能。</h3>
            <h4>答：使用 formatFunction 和 editor 来分别实现渲染和编辑阶段的显示与存储值。由于SmartUI Grid 自带搜索框是弹出式的，会与下拉弹框冲突，所以使用自定义的搜索框实现搜索功能。</h4>
            <h3>2、SmartUI 网格的单元格需要支持显示 Listbox，就是复选框组。</h3>
            <h4>答：使用 editor 的 template（checklist） 属性来实现复选框组。（目前无法显示出来，正在询问 SmartUI）</h4>

            <h3>3、SmartUI 非单元格中的下拉网格,下拉树形网格也需要支持存储值和显示值的功能，并且下拉网格具有搜索功能。</h3>
            <h4>答：使用 onRender 和 onRowClick 来分别实现显示存储的默认值和选择的显示存储值。使用html 模板实现搜索过滤功能。（重置存在UI未更新问题）</h4>

            <h3>4、SmartUI 网格中，按Tab键需要从当前选中单元格焦点跳转到下一列单元格的焦点。</h3>
            <h4>答：开启 单元格编辑 后可以从左至右进行单元格跳转。</h4>

            <h3>5、SmartUI 网格的只读单元格，按ctrl +X 时会将只读单元格的内容剪切掉</h3>
            <h4>答：测试发现，进入编辑状态后，按ctrl + X ，并在单元格失焦时单元格内容还原。非编辑状态，按ctrl + X 会剪切掉单元格内容并不会复原。https://www.htmlelements.com/react/demos/grid/editing-readonly/
                暂时没找到解决方案。（问了 SmartUI 几个问题之后需要查看 授权许可证 才能继续提问。）
            </h4>

            <h3>6、SmartUI 多选时选中行，焦点行</h3>
            <h4>答：使用gridRef.current.getSelection().focused 获取当前焦点行。</h4>

            <h3>7、SmartUI 单元格验证（异步）</h3>
            <h4>答：使用 onCellUpdate 进行异步处理，实现验证需求。</h4>

            <h3>8、SmartUI 单元格编辑器显示控制（异步）</h3>
            <h4>答：暂未找到合适的异步控制显隐的方式。</h4>

            <h3>9、命令列（SmartUI Grid 中的右侧操作栏）需要扩展更多操作按钮</h3>
            <h4>答：SmartUI 提供的扩展方式，只能自定义UI（text、label、icon等），无法自定义事件方法，所以可能需要自己用 html 模板实现。
            https://www.htmlelements.com/react/demos/grid/editing-command-column-custom/
            </h4>
            <div id='gridContainer'>
                    <Grid
                        ref={gridRef}
                    appearance={{
                        allowHover: true,
                    }}
                    dataSource={gridData}
                    columns={columns}
                    sorting={{ enabled: true }}
                    filtering={{ enabled: true }}
                    selection={{
                        enabled: true,
                        allowCellSelection: cellEditable,
                        allowRowSelection: !cellEditable,
                        allowRowHeaderSelection: true,
                        allowColumnHeaderSelection: true,
                        mode: 'extended',
                        checkBoxes: {
                            autoShow: false,
                            enabled: true,
                            selectAllMode: 'all',
                        }
                    }}
                    editing={{
                        enabled: true,
                        mode: 'cell',
                        commandColumn: {
                            visible: true,
                            displayMode: 'icon',
                            dataSource: {
                                'commandColumnDelete': {
                                    visible: false
                                },

                                'commandColumnCustom': {
                                    icon: 'smart-icon-ellipsis-vert',
                                    command: 'commandColumnCustomCommand',
                                    visible: true,
                                    label: 'Text'
                                }
                            }
                        }
                    }}

                    onCellClick={handleCellClick}
                    onCellUpdate={handleCellUpdate}
                />
            </div>

            {/* 下拉网格部分 */}
            {dropdownVisible && (
                <div
                    ref={popperRef}
                    className={styles.cellDropdownGrid}
                    id='cellDropdownGrid'
                    onScroll={handleDropdownScroll}
                >
                    {/* 添加搜索框 */}
                    <div className={styles.searchBox}>
                        <input
                            type="text"

                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="搜索..."
                            className={styles.searchInput}
                        />
                    </div>

                    <Grid
                        ref={dropdownGridRef}
                        appearance={appearanceOptions}
                        filtering={filteringOptions}
                        selection={{
                            enabled: true,
                            mode: multiple ? 'many' : 'one',
                            checkBoxes: multiple ? {
                                autoShow: true,
                                enabled: true,
                                selectAllMode: 'all',
                            } : undefined
                        }}
                        // 使用过滤后的数据源
                        dataSource={filteredDataSource}
                        dataSourceSettings={dropdownDataSourceSettings}
                        columns={dropdownColumns}
                        onRowClick={handleDropdownSelect}
                        footer={multiple ? cellDropdownGridFooterOptions : undefined}
                        onRender={handleRender}
                    />
                </div>
            )}
        </div>
    );
};

export default CellDropdownGridTree; 