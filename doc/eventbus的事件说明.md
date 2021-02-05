# Vue EventBus 事件栈

```
事件名字全大写写法，下划线分隔
```
## 项目中的事件有如下：

| 事件名                   | 功能(用途)                            | 备注                                                 |
| ------------------------ | ------------------------------------- | ---------------------------------------------------- |
| ALERT_MSG                | 提示框触发                            |                                                      |
| CHART_TEXT_MENU          | 图表的右键功能                        |                                                      |
| CHANGE_DATA_TYPE         | 新建数据的更改数据类型                |                                                      |
| CLOSE_DATAPOPUP      | 关闭新建数据模态框                    | 在[数据管理新建]和[大屏数据新建]同时注册但是不想冲突 |
| CONFIG_UNITY_MODEL       | 配置unity的模型                       |                                                      |
| CREATED_DBSOURCE      | 新建数据时确认数据的选择              | 在不同的类型数据组件里面同时注册，唯一不冲突         |
| CREATED_DBLINK | 新建数据连接，确认了SQL和CUSTOM的选择 | 在不同的类型数据组件里面同时注册，唯一不冲突         |
| GET_CHART_COLLECT        | 获取大屏编辑页面的收藏图表的列表数据  |                                                      |
| SELECT_UNITY_MODEL       | 确认unity的模型选择                   |                                                      |
| SAVE_UNITY_MODEL         | 保存unity模型数据                     |                                                      |
| SAVE_UNITY_SCENCE        | 保存unity的3d场景                     |                                                      |
| CONFIG_UNITY_SCENE       | 配置unity的场景数据                   |                                                      |
|                          |                                       |                                                      |
|                          |                                       |                                                      |