import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http'

import '@pnp/sp/lists';
import '@pnp/sp/items';

//import { Web } from '@pnp/sp/webs';
//import { IFieldInfo } from '@pnp/sp/fields';



export async function  getSPData(client: SPHttpClient, url: string): Promise<any> {
    const response: SPHttpClientResponse = await client.get(url, SPHttpClient.configurations.v1)
    const responsejson = response.json();
    return responsejson;
}

//export const getListFields = async (
//  siteUrl: string, listId: string,
//): Promise<IFieldInfo[]> => Web(siteUrl).lists
//  .getById(listId).fields
//  .get();
  
