import React, { useState, useRef, useEffect } from 'react';
import { Grid } from 'smart-webcomponents-react/grid';

const GridHeaderCheckbox: React.FC = () => {
    const gridRef = useRef<any>(null);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [headerCheckboxState, setHeaderCheckboxState] = useState<boolean>(false);

    const data = [
        { id: 1, name: '张三', age: 30, department: '销售部', selected: false },
        { id: 2, name: '李四', age: 28, department: '市场部', selected: false },
        { id: 3, name: '王五', age: 35, department: '技术部', selected: false },
        { id: 4, name: '赵六', age: 32, department: '人事部', selected: false },
        { id: 5, name: '钱七', age: 27, department: '财务部', selected: false },
    ];

    const columns = [
        {
            label: 'ID',
            dataField: 'id',
            width: 50,
            template: 'checkBox',
            labelTemplate: (settings: any) => {
                return `<div style="display: flex; align-items: center;">
                            <smart-check-box id="headerCheckbox" change={(event) => this.getRootNode().host.handleHeaderCheckboxChange(event)}></smart-check-box>
                            <span style="margin-left: 5px;">ID</span>
                        </div>`;
            }
        },
        { label: '姓名', dataField: 'name', width: 100 },
        { label: '年龄', dataField: 'age', width: 80 },
        { label: '部门', dataField: 'department', width: 120 },
    ];

    const handleCheckBoxChange = (event: any) => {
        const { index, value, column } = event.detail;
        if (index === -1) {
            // 列头复选框
            const newData = data.map(item => ({ ...item, selected: value }));
            gridRef.current.dataSource = newData;
            setSelectedRows(value ? data.map(item => item.id) : []);
            setHeaderCheckboxState(value);
        } else {
            // 行复选框
            const newData = [...data];
            newData[index].selected = value;
            gridRef.current.dataSource = newData;
            const selectedIds = newData.filter(item => item.selected).map(item => item.id);
            setSelectedRows(selectedIds);
            setHeaderCheckboxState(selectedIds.length === data.length);
        }
    };

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.handleHeaderCheckboxChange = (event: any) => {
                console.log('%c [ event ]-58', 'font-size:13px; background:#5DA979; color:#007AFF;', event);
                // const isChecked = event.target.checked;
                // console.log('%c [ handleCheckBoxChange ]-60', 'font-size:13px; background:#5DA979; color:#007AFF;');
                // handleCheckBoxChange({ detail: { index: -1, value: isChecked } });
            };
        }
    }, []);

    return (
        <div>
            <h3 className="sticky-header component-header">
                5. 网格列头显示复选框，以及事件响应
                <a href="https://www.htmlelements.com/demos/grid/overview/#toc-labeltemplate_string__htmltemplateelement__htmlelement__(label:_string):_string" target="_blank" rel="noopener noreferrer">
                    {" "}查看 Grid Header LabelTemplate 文档
                </a>
            </h3>
            <p>The labelTemplate is for custom html in the column header not for components
                Use the column click events
                To handle clicks in the columns.</p>
            <p>labelTemplate 用于列标题中的自定义 HTML，而不是用于组件
                使用列点击事件
                来处理列中的点击</p>
            <Grid
                checkBoxes={{
                    visible: true
                }}
                ref={gridRef}
                dataSource={data}
                columns={columns}
                appearance={{ alternationCount: 2 }}
                selection={{ enabled: true, mode: 'extended' }}
                onCheckBoxChange={handleCheckBoxChange}
            />
            <div style={{ marginTop: '10px' }}>
                已选择的行: {selectedRows.join(', ')}
            </div>
            <div style={{ marginTop: '10px' }}>
                列头复选框状态: {headerCheckboxState ? '选中' : '未选中'}
            </div>
        </div>
    );
};

export default GridHeaderCheckbox;