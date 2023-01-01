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

   private _hlayout = 
        {
          "_wfAction": {
            "name": "Action",
            "width": "20",
            "class": "featuredcell"
          },
          "_wfUser": {
            "name": "User",
            "width": "0"
          },
          "_wfTime": {
            "name": "Date (Time)",
            "width": "15",
            "type": "date",
            "format": "DD MMM YY (HH:mm)"
          },
          "progress": {
            "name": "% time at stage",
            "width": "9"
          },
          "_wfStreamTime0": {
            "name": "Days",
            "width": "5",
            "type": "number",
            "format": " 2"
          },
          "_wfStageChange": {
            "name": "New stage",
            "width": "0"
          },
          "_wfStreamStatus": {
            "name": "Stage",
            "width": "0"
          },
          "_wfPrevStage": {
            "name": "From",
            "width": "0"
          },
          "_wfLogComment": {
            "name": "Comment",
            "width": "35"
          }
        }
      
    private _getTableData() {
        const url = this._webUrl+ "/_api/web/lists/GetByTitle('DemoList')/items";
        Utils.getSPData(this._client, url).then(d => {
            const data = d.value;
            this.setState({ items: data });
        });
    }

    private _getTableData2() {
        const url = this._webUrl+ "/_api/web/lists/GetByTitle('Notifications')/items";
        Utils.getSPData(this._client, url).then(d => {
            const data = d.value;
            this.setState({ moreitems: data });
        });
    }

    componentDidMount() {
        this._getTableData();
        this._getTableData2();
        console.log("layout" , this._hlayout);
        console.log("layoutproperty" , this._tableLayout);
    }

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
  