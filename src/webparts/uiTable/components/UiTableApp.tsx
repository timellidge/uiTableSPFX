import * as React from 'react';
import styles from './UiTable.module.scss';
import { IUiTableProps } from './IUiTableProps';
import UiTable from './UiTable'

export default class UiTableApp extends React.Component<IUiTableProps, {}> {
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
