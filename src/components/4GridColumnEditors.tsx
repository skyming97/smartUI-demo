import React, { useRef, useState, useEffect } from 'react';
import { Grid, GridCell } from 'smart-webcomponents-react/grid';

const GridColumnEditors: React.FC = () => {
    const gridRef = useRef<any>(null);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);

    useEffect(() => {
        const ratingTemplate = document.createElement('template');
        const ratingEditorTemplate = document.createElement('template');
        const progressBarTemplate = document.createElement('template');

        ratingTemplate.id = 'ratingTemplate';
        ratingTemplate.innerHTML = '<div>Rating: {{value}}</div>';

        ratingEditorTemplate.id = 'ratingEditorTemplate';
        ratingEditorTemplate.innerHTML = `
            <div tabindex="0" style="padding: 0px; display:flex; justify-content: center;">
                <span class="star" tabindex="1" data-value="1" style="cursor: pointer; font-size: 20px; color: gold;">☆</span>
                <span class="star" tabindex="2" data-value="2" style="cursor: pointer; font-size: 20px; color: gold;">☆</span>
                <span class="star" tabindex="3" data-value="3" style="cursor: pointer; font-size: 20px; color: gold;">☆</span>
                <span class="star" tabindex="4" data-value="4" style="cursor: pointer; font-size: 20px; color: gold;">☆</span>
                <span class="star" tabindex="5" data-value="5" style="cursor: pointer; font-size: 20px; color: gold;">☆</span>
            </div>
        `;

        progressBarTemplate.id = 'progressBarTemplate';
        progressBarTemplate.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; padding: 0 5px;">
                <div style="width: 100%; background-color: #e0e0e0; height: 16px; border-radius: 10px; overflow: hidden;">
                    <div style="width: {{value}}%; background-color: #4CAF50; height: 100%;"></div>
                </div>
            </div>
        `;

        document.body.appendChild(ratingTemplate);
        document.body.appendChild(ratingEditorTemplate);
        document.body.appendChild(progressBarTemplate);

        return () => {
            document.body.removeChild(ratingTemplate);
            document.body.removeChild(ratingEditorTemplate);
            document.body.removeChild(progressBarTemplate);
        };
    }, []);

    const data = [
        { id: 1, name: 'John Doe', age: 16, email: 'john@example.com', rating: 3, progress: 75 },
        { id: 2, name: 'Jane Smith', age: 20, email: 'john@example.com', rating: 4, progress: 90 },
        { id: 3, name: 'Bob Johnson', age: 19, email: 'john@example.com', rating: 5, progress: 60 },
    ];

    const columns = [
        { dataField: 'id', label: 'ID', allowEdit: false },
        { dataField: 'name', label: '姓名' },
        {
            dataField: 'age',
            label: '年龄',
            editor: {
                template: 'numberInput',
            },
        },
        {
            dataField: 'email',
            label: '邮箱',
            editor: {
                template: 'input'
            },
            validationRules: [
                {
                    type: 'email',
                    message: '无效的邮箱格式',
                }
            ]
        },
        {
            dataField: 'rating',
            label: '评分',
            editor: {
                template: '#ratingEditorTemplate',
                onInit(index: number, dataField: string, editor: HTMLElement) {
                    editor.onclick = (e: MouseEvent) => {
                        const target = e.target as HTMLElement;
                        if (target.classList.contains('star')) {
                            const value = parseInt(target.getAttribute('data-value') || '1', 10);
                            editor.querySelectorAll('.star').forEach((star: Element, i: number) => {
                                (star as HTMLElement).textContent = i < value ? '★' : '☆';
                            });
                            editor.setAttribute('data-value', value.toString());
                            // 更新渲染状态

                            // 更新表格中单元格的值
                            
                            console.log('%c [  ]-82', 'font-size:13px; background:#5DA979; color:#007AFF;', e);
                            gridRef.current.refreshView();
                        }
                    };
                }
            },
            template: '#ratingTemplate',
            formatFunction: (settings: any) => {
                const value = settings.value;
                settings.template = `<div style="display: flex; justify-content: center;">
                    ${Array(5).fill(0).map((_, index) => 
                        `<span style="color: ${index < value ? 'gold' : 'gray'}; font-size: 20px;">★</span>`
                    ).join('')}
                </div>`;
            }
        },
        {
            dataField: 'progress',
            label: '进度',
            template: '#progressBarTemplate',
            formatFunction: (settings: any) => {
                const value = settings.value;
                settings.template = settings.template?.replace('{{value}}', value);
            }
        }
    ];

    const asyncAgeValidator = (age: number): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const isValid = age >= 1 && age <= 20;
                resolve(isValid);
            }, 1000);
        });
    };

    const handleCellUpdate = async (cells: GridCell[], oldValues: any[], values: any[], confirm: { (commit: boolean): void }) => {

        if (cells[0].column.dataField === 'age') {
            const newAge = values[0];
            try {
                const isValid = await asyncAgeValidator(newAge);
                if (isValid) {
                    setValidationMessage(null);
                    confirm(true);
                } else {
                    setValidationMessage('年龄必须在1到20之间');
                    confirm(false);
                }
            } catch (error) {
                console.error('验证过程中出错:', error);
                setValidationMessage('验证过程中出错');
                confirm(false);
            }
        } else if (cells[0].column.dataField === 'email') {
            const email = values[0];
            setTimeout(() => {
                if (!email.startsWith('john')) {
                    setValidationMessage('邮箱必须以john开头');
                    confirm(false);
                } else {
                    setValidationMessage(null);
                    confirm(true);
                }
            }, 1000);
        }
        else if (cells[0].column.dataField === 'rating') {
            const newRating = parseInt(values[0], 10);
            if (newRating >= 1 && newRating <= 5) {
                setValidationMessage(null);
                confirm(true);
            } else {
                setValidationMessage('评分必须在1到5之间');
                confirm(false);
            }
        }
        else {
            confirm(true);
        }
    };

    return (
        <div>
            <h3 className="sticky-header component-header">
                4. 网格控件中现在使用到的列编辑器的实现方式. 输入后的异步验证，提示.
                <a href="https://www.htmlelements.com/demos/grid/overview/#toc-template_any" target="_blank" rel="noopener noreferrer">
                    {" "}查看 Grid Column Template 文档
                </a>
            </h3>
            <p>单元格编辑器：</p>
            <p>it cannot render React components as Items in a DropdownList or DropDownGrid</p>
            <p>不能在 DropdownList 或 DropDownGrid 中渲染 React 组件</p>
            <p>年龄必须大于1岁，小于20岁，邮箱必须以john开头: </p>
            <Grid
                ref={gridRef}
                dataSource={data}
                columns={columns}
                editing={{ enabled: true, mode: 'cell' }}
                onCellUpdate={handleCellUpdate}
            />
            {validationMessage && (
                <div style={{ color: 'red', marginTop: '10px' }}>{validationMessage}</div>
            )}

        </div>
    );
};

export default GridColumnEditors;