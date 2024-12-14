import React, { useRef, useState, useEffect } from 'react';
import { Grid } from 'smart-webcomponents-react/grid';
import './6GridCellConditionalReadonly.css';  // 添加这行来导入 CSS

const GridCellConditionalReadonly: React.FC = () => {
    const gridRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const progressTemplate = document.createElement('template');
        progressTemplate.id = 'progressTemplate';
        progressTemplate.innerHTML = '<div>Progress: {{value}}%</div>';
        document.body.appendChild(progressTemplate);

        return () => {
            document.body.removeChild(progressTemplate);
        };
    }, []);

    const data = [
        { id: 1, name: '张三', age: 30, department: '销售部', status: '正常' },
        { id: 2, name: '李四', age: 28, department: '市场部', status: '请假' },
        { id: 3, name: '王五', age: 35, department: '技术部', status: '正常' },
        { id: 4, name: '赵六', age: 32, department: '人事部', status: '出差' },
        { id: 5, name: '钱七', age: 27, department: '财务部', status: '正常' },
    ];

    const columns = [
        { label: 'ID', dataField: 'id', width: 50, allowEdit: false },
        { label: '姓名', dataField: 'name', width: 100 },
        { label: '年龄', dataField: 'age', width: 80 },
        { label: '部门', dataField: 'department', width: 120 },
        { 
            label: '状态', 
            dataField: 'status', 
            width: 100,
            formatFunction: (settings: any) => {
                switch (settings.value) {
                    case '正常':
                        settings.cell.background = '#00A45A';
                        settings.cell.color = '#fff';
                        break;
                    case '出差':
                        settings.cell.background = '#007AFF';
                        settings.cell.color = '#fff';
                        break;
                    case '请假':
                        settings.cell.background = '#FFD700';
                        settings.cell.color = '#333';
                        break;
                    default:
                        settings.cell.background = '';
                        settings.cell.color = '';
                }
            }
        },
    ];

    const isReadOnly = async (cell: any) => {
        // setLoading(true);
        // 模拟异步操作
        await new Promise(resolve => setTimeout(resolve, 500));
        // setLoading(false);

        const { value } = cell;
        return value === '请假' || value === '出差';
    };

    return (
        <div>
            <h3 className="sticky-header component-header">
                6. 网格单元格根据不同条件(要支持异步)的控制只读,以及只读的背景色
                <a href="https://www.htmlelements.com/demos/grid/overview/#toc-formatfunction" target="_blank" rel="noopener noreferrer">
                    {" "}查看 Smart.Grid（FormatFunction） 文档
                </a>
            </h3>
            <Grid
                ref={gridRef}
                dataSource={data}
                columns={columns}
                editing={{ enabled: true, mode: 'cell' }}
                onCellRender={(cell: any) => {
                    if (cell.column.dataField === 'status') {
                        isReadOnly(cell).then(readonly => {
                            cell.readonly = readonly;
                        });
                    }
                    return cell;
                }}
            />
            {loading && <div className="loading">加载中...</div>}
        </div>
    );
};

export default GridCellConditionalReadonly;