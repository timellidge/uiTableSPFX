import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http'


/* eslint-disable import/no-duplicates */
import * as React from 'react';

// PnPJS Imports
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { IRenderListDataAsStreamResult } from '@pnp/sp/lists';
import { Web } from '@pnp/sp/webs';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import { IDropdownOption } from 'office-ui-fabric-react';

import { IItemUpdateResult } from '@pnp/sp/items';
import { ITypedHash } from '@pnp/common';


export async function  getSPData(client: SPHttpClient, url: string): Promise<any> {
    const response: SPHttpClientResponse = await client.get(url, SPHttpClient.configurations.v1)
    const responsejson = response.json();
    return responsejson;
}


export const validateSiteExists = async (value: string): Promise<string> => {
  try {
    await Web(value).getParentWeb();
    return '';
  } catch (e) {
    return 'Site could not be found';
  }
};

export const getItemsUsingRenderListDataAsStream = (
  siteUrl: string, listId: string, viewXmlCode: string, nextHref?: string,
): Promise<IRenderListDataAsStreamResult> => Web(siteUrl)
  .lists.getById(listId).renderListDataAsStream({
    ViewXml: viewXmlCode,
    Paging: nextHref || null,
  });

export const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [delay, value]);

  return debouncedValue;
};



export const searchFieldTypes: FieldTypes[] = [
  FieldTypes.Text,
  FieldTypes.Choice,
  FieldTypes.Note,
];

// export const getListFields = async (
//   siteUrl: string, listId: string,
// ): Promise<IFieldInfo[]> => Web(siteUrl).lists
//   .getById(listId).fields
//   .get();

// export const getListViewXml = async (
//   siteUrl: string, listId: string, viewId: string,
// ): Promise<IViewInfo> => Web(siteUrl).lists
//   .getById(listId).views
//   .getById(viewId)
//   .get();

export const getSearchFieldsFromOptions = (options: IDropdownOption[]): IFieldInfo[] => {
  if (!options) { return []; }
  const fields: IFieldInfo[] = options.map((option: IDropdownOption) => option.data as IFieldInfo);
  return fields.filter((field: IFieldInfo) => field
    || searchFieldTypes.indexOf(field.FieldTypeKind) !== -1);
};

export const updateListItem = async (
  siteUrl: string, listId: string, itemId: number, properties: ITypedHash<unknown>,
): Promise<IItemUpdateResult> => Web(siteUrl).lists.getById(listId).items
  .getById(itemId)
  .update(properties);

export const addListItem = async (
  siteUrl: string, listId: string, properties: ITypedHash<unknown>,
): Promise<IItemUpdateResult> => Web(siteUrl).lists.getById(listId).items
  .add(properties);

export const getNamedAttributeValue = (
  element: HTMLElement, attributeName: string,
): string | null => {
  const el = element.closest(`[${attributeName}]`);
  return el ? el.attributes.getNamedItem(attributeName).value : null;
};