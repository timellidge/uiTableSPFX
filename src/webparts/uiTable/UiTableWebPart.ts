import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'UiTableWebPartStrings';
import UiTableApp from './components/UiTableApp';
import { IUiTableProps } from './components/IUiTableProps';
import { PropertyFieldCodeEditor, PropertyFieldCodeEditorLanguages,  } from '@pnp/spfx-property-controls/lib/PropertyFieldCodeEditor';

import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

export interface IUiTableWebPartProps {
  webPartTag: any;
  siteUrl: any;
  list: any;
  view: any;
  viewXmlCode: any;
  JSONCode: string;
  listName: string;
  tableLayout: string
}

export default class UiTableWebPart extends BaseClientSideWebPart<IUiTableWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

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
  
  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

   private onPropertyFieldListPickerChanged(
    targetProperty: string,
    oldValue: unknown,
    newValue: unknown,
  ) {
    const oldViewValue = this.properties[targetProperty];
    this.onPropertyPaneFieldChanged(targetProperty, oldViewValue, newValue);
    if (newValue !== '') {
      //getListFields(this.properties.siteUrl, this.properties.list)
      //
      //  .then(this.updateFieldListPickerOptions.bind(this));
    } else {
      this.context.propertyPane.refresh();
      this.render();
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: "Table Configuration",
              groupFields: [
                PropertyPaneTextField('webPartTag', {
                  label: 'Web Part CSS Tag',
                  value: this.properties.webPartTag,
                }),
                PropertyFieldListPicker('lists', {
                  label: 'Select a list',
                  selectedList: this.properties.list,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyFieldListPickerChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),

                PropertyFieldCodeEditor('JSONCode', {
                  label: 'JSON Table Layout',
                  panelTitle: 'JSON Table Layout',
                  initialValue: this.properties.JSONCode,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                
                  disabled: false,
                  key: 'codeEditorFieldId',
                  language: PropertyFieldCodeEditorLanguages.JavaScript,
                  options: {
                    wrap: true,
                    fontSize: 18
                    // more options
                  },
                  panelWidth: "300"
                })
              ]
            }
          ]
        }
      ]
    };
  }

  public render(): void {
    //this.properties.JSONCode = JSON.stringify(this._hlayout);
    const element: React.ReactElement<IUiTableProps> = React.createElement(
      UiTableApp,
      {
        listName: this.properties.listName,
        ctx: this.context,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        JSONCode: JSON.stringify(this._hlayout)
      }
    );

    ReactDom.render(element, this.domElement);
  }
}
