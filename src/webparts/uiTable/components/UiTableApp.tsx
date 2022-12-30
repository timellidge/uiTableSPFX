import * as React from 'react';
import styles from './UiTable.module.scss';
import { IUiTableProps } from './IUiTableProps';
import UiTable from './UiTable'
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http'

export default class UiTableApp extends React.Component<IUiTableProps, any> {

    state = {
        items:[],
        moreitems:[]
    };

    private _client: SPHttpClient = this.props.ctx.spHttpClient;

    private _getTableData() {
        let url = "https://justsharepoint.sharepoint.com/sites/JSPProjects/_api/web/lists/GetByTitle('DemoList')/items";
        this._getSPData(this._client, url).then(d => {
            let data = d.value;
            this.setState({ items: data });
        });
    }

    private _getTableData2() {
        let url = "https://justsharepoint.sharepoint.com/sites/JSPProjects/_api/web/lists/GetByTitle('Notifications')/items";
        this._getSPData(this._client, url).then(d => {
            let data = d.value;
            this.setState({ moreitems: data });
        });
    }

    private async _getSPData(client: SPHttpClient, url: string): Promise<any> {
        let response: SPHttpClientResponse = await client.get(url, SPHttpClient.configurations.v1)
        let responsejson = response.json();
        return responsejson;
    }

    componentDidMount() {
        this._getTableData();
        this._getTableData2();
    }

    public render(): React.ReactElement<IUiTableProps> {
        return (
            <section className={`${styles.uiTable} `}>
                <h2>Hi about to go deeper </h2>
                <div className={styles.welcome}>
                    <UiTable />
                </div>
                <h1>LIST 1 DATA</h1>
                <div>{JSON.stringify(this.state.items)}</div>
                <h1>LIST 2 DATA</h1>
                <div>{JSON.stringify(this.state.moreitems)}</div>
            </section>
        );
    }
}
