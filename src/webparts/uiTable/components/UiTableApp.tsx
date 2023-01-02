import * as React from 'react';
import styles from './UiTable.module.scss';
import { IUiTableProps } from './IUiTableProps';
import UiTable from './UiTable'
import * as Utils from "../../uiTable/utils";
import { SPHttpClient } from '@microsoft/sp-http'


export default class UiTableApp extends React.Component<IUiTableProps, any> {

    state = {
        items:[],
        moreitems:[]
    };

    private _client: SPHttpClient = this.props.ctx.spHttpClient;
    private _webUrl: string = this.props.ctx.pageContext.web.absoluteUrl;

    private _tableLayout = JSON.parse(this.props.JSONCode) || "";


      
    private _getTableData() {
        const url = this._webUrl+ "/_api/web/lists/GetByTitle('DemoList')/items";
        Utils.getSPData(this._client, url).then(d => {
            const data = d.value;
            this.setState({ items: data });
        });
    }

    private _getTableData2() {
        if (this.props.list != undefined){
            const url = this._webUrl+ "/_api/web/lists/GetById('"+this.props.list+"')/items";
            Utils.getSPData(this._client, url).then(d => {
                const data = d.value;
                console.log("list query",JSON.stringify(d.value));
                this.setState({ moreitems: data });
            });
        }
    }

    public componentDidMount(): void {
        this._getTableData();
        this._getTableData2();
        if(this.props.JSONCode.length === 0){console.log("no jsomn");} else {console.log("code is", this.props.JSONCode.length);}
        //console.log("layout." , this._hlayout);
        console.log("layoutproperty" , this._tableLayout);
    }

    //public componentDidUpdate(): void {
     //   this._getTableData2();
    //}

    public render(): React.ReactElement<IUiTableProps> {
        return (
            <section className={`${styles.uiTable} `}>
                <h2>Top Level Component</h2>
                <div className={styles.welcome}>
                   {this.state.items.map(item => <UiTable row = {item} />)}
                </div>
                <h1>LIST 2 DATA</h1>
                <div>{JSON.stringify(this.state.moreitems)}</div>
            </section>
        );
    }
}
  