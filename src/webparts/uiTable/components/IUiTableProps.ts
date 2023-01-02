import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IUiTableProps {
  listName: string;
  ctx:WebPartContext;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  JSONCode: string;
  list:string;
}
