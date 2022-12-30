import * as React from 'react';
import styles from './UiTable.module.scss';
import { IUiTableProps } from './IUiTableProps';
import UiTable from './UiTable'
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http'

export default class UiTableApp extends React.Component<IUiTableProps, {}> {

    private _client: SPHttpClient = this.props.ctx.spHttpClient;

    private _getTableData() {
        let url = "https://justsharepoint.sharepoint.com/sites/JSPProjects/_api/web/lists/GetByTitle('DemoList')/items";
        this._getSPData(this._client, url).then(d => {
            let data = d;
            console.log(JSON.stringify(data));
        });
    }

    private async _getSPData(client: SPHttpClient, url: string): Promise<any> {
        let response: SPHttpClientResponse = await client.get(url, SPHttpClient.configurations.v1)
        let responsejson = response.json();
        return responsejson;
    }

    componentDidMount() {
        this._getTableData();
    }

    public render(): React.ReactElement<IUiTableProps> {
        return (
            <section className={`${styles.uiTable} `}>
                <div className={styles.welcome}>
                    <UiTable />
                </div>
            </section>
        );
    }
}
