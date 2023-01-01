import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http'

export async function  getSPData(client: SPHttpClient, url: string): Promise<any> {
    const response: SPHttpClientResponse = await client.get(url, SPHttpClient.configurations.v1)
    const responsejson = response.json();
    return responsejson;
}