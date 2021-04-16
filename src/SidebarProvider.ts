import * as vscode from 'vscode';
import snippets = require('./icons.json');

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
  context?: vscode.ExtensionContext;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    _context: vscode.ExtensionContext
  ) {
    this.context = _context;
    let favorites: Array<string> =
      this.context?.globalState.get('favorites') ?? [];
    Object.keys(snippets).forEach((snippet) => {
      snippets[snippet]['favorite'] = favorites.includes(snippet);
    });
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'onInfo': {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case 'onError': {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        case 'addText': {
          if (!data.value) {
            return;
          }
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            const document = editor.document;
            let svgString = snippets[data.value.name].body;
            svgString = svgString.replace(
              /width\s*=\s*"(\d+)\"/,
              `width="${data.value.width}"`
            );
            svgString = svgString.replace(
              /height\s*=\s*"(\d+)\"/,
              `height="${data.value.height}"`
            );
            svgString = svgString.replace(
              /fill\s*=\s*"(\w+)\"/,
              `fill="${data.value.color}"`
            );
            editor.edit((editBuilder) => {
              editor.selections.forEach((sel) => {
                const position = editor.selection.active;
                editBuilder.insert(position, svgString);
              });
            });
          }
          break;
        }
        case 'toggleFavorite': {
          let favorites: Array<string> =
            this.context?.globalState.get('favorites') ?? [];
          let index: number = favorites.indexOf(data.value.name);
          if (index >= 0) {
            favorites.splice(index, 1);
          } else {
            favorites.push(data.value.name);
          }
          this.context?.globalState.update('favorites', favorites);
        }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
              <title>SVG Icons</title>
              <style>
              .icon-name {
                  font-size: 1.1rem;
                  margin-bottom: 0px;
              }
              .icon {
                  padding: 2px 6px;
                  font-size: 1.6rem;
              }
              .favorite {
              }
              .hidden {
                  display: none;
              }
              input {
                  width: 90%;
                  font-size: 1.2rem;
                  margin: 3px 0;
                  padding: 3px 6px;
                  font-family: "Arial";
                  outline: 0;
                  border-radius: 3px;
                  border: 2px solid rgba(40,40,40,0.7);
              }
              body.vscode-dark input {
                  background: rgba(0,0,0,0.1);
                  color: rgba(255,255,255,0.8);
              }
              body.vscode-light input {
                  background: rgba(0,0,0,0.1);
                  color: rgba(0,0,0,0.8);
              }
              th {
                  font-size: 0.8rem;
                  text-align:center;
              }
              input:focus {
                  outline: 0;
              }
              tr {
                  margin: 20px 4px;
              }
              .results {
                  overflow:scroll;
                  max-height: 90vh;
              }
              button {
                width: 100%;
              }
              .dimensions {
                display: flex;
                flex-direction: row;
                align-items: center;
              }
              .dimensions input{
                width: 60%;
                font-size: 0.8rem;
              }
              </style>
              <script>
              const tsvscode = acquireVsCodeApi();
              </script>
          </head>
          <body>
              <h1>SVG Icons</h1>
              <input oninput="handleInputChange(this.value)" placeholder="Search" type="text"/>
              <div class="dimensions">
                <label for="height">Height</label>
                <input type="number" id="height" name="height" value="16">
                <label for="width">Width</label>
                <input type="number" id="width" name="width" value="16">
              </div>
              <div class="dimensions">
                <label for="color">Icon-Color</label>
                <input type="color" id="color" name="color" value="#bababa">
              </div>
              <div class="results">
              <table>
              <thead>
                  <tr>
                  <th>Icon</th>
                  <th>Icon name</th>
                  <th>Favorite</th>
                  </tr>
              </thead>
                  <tbody>
                  ${Object.entries(snippets)
                    .map(([key, value]) => {
                      const name: string = key;
                      const description: string = value[
                        'description'
                      ].toString();
                      const favorite: boolean = value['favorite'];
                      console.log(favorite);
                      return ` <tr data-icon-name="${name}" data-icon-description="${description}">
                                  <td class="icon">
                                    <i class="bi bi-${name}"></i>
                                  </td>
                                  <td class="icon-name">
                                      <button onclick="addSnippet('${name}')">${name}</button>
                                  </td>
                                  <td class="favorite">
                                      <input type="checkbox" value="${name}" onclick="toggleFavorite('${name}')" ${
                        favorite ? 'checked' : ''
                      }/>
                                  </td>
                                </tr>`;
                    })
                    .join('')}
              </tbody>
  </table>
  </div>
  <script>
  function handleInputChange(searchTerm){
    document.querySelectorAll("tr").forEach(element => {
      var iconName = element.getAttribute("data-icon-name");
      var iconDescription = element.getAttribute("data-icon-description");
      if (iconName){
        if (searchTerm == ""){
          element.classList.remove("hidden");
        } else if (iconName.includes(searchTerm) || iconDescription.includes(searchTerm)){
          element.classList.remove("hidden");
        } else {
          element.classList.add("hidden");
        }
      }
    });
  }
  function addSnippet(name){
    const height = document.querySelector("#height").value;
    const width = document.querySelector('#width').value;
    const color = document.querySelector('#color').value;
    tsvscode.postMessage({type: 'addText', value: {name, height, width, color}});
  }
  function toggleFavorite(name){
    tsvscode.postMessage({type: 'toggleFavorite', value: {name}});
  }
  (function(){
    document.querySelector('input').focus();
  })()

  </script>
</body>
</html>`;
  }
}
