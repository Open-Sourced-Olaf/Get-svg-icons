"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconlistPanel = void 0;
const vscode = require("vscode");
class iconlistPanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        // Set the webview's initial html content
        this._update();
        // // Handle messages from the webview
        // this._panel.webview.onDidReceiveMessage(
        //   (message) => {
        //     switch (message.command) {
        //       case "alert":
        //         vscode.window.showErrorMessage(message.text);
        //         return;
        //     }
        //   },
        //   null,
        //   this._disposables
        // );
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        const panel = vscode.window.createWebviewPanel(iconlistPanel.viewType, "SVG Icon List Panel", column || vscode.ViewColumn.Two, {
            // Enable javascript in the webview
            enableScripts: true,
            retainContextWhenHidden: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "media")
            ],
        });
        iconlistPanel.currentPanel = new iconlistPanel(panel, extensionUri);
    }
    _update() {
        return __awaiter(this, void 0, void 0, function* () {
            const webview = this._panel.webview;
            this._panel.webview.html = this._getHtmlForWebview(webview);
            webview.onDidReceiveMessage((data) => __awaiter(this, void 0, void 0, function* () {
                switch (data.type) {
                    case "onInfo": {
                        if (!data.value) {
                            return;
                        }
                        vscode.window.showInformationMessage(data.value);
                        break;
                    }
                    case "onError": {
                        if (!data.value) {
                            return;
                        }
                        vscode.window.showErrorMessage(data.value);
                        break;
                    }
                }
            }));
        });
    }
    _getHtmlForWebview(webview) {
        // // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "main.js"));
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
                }
                .icon i.material-icons {
                    padding: 2px 6px;
                    font-size: 1.8rem;
                }
                .hidden {
                    display: none;
                }
                input {
                    width: 90%;
                    font-size: 1.5rem;
                    margin: 4px 0;
                    padding: 4px 8px;
                    font-family: "Arial";
                    outline: 0;
                    border-radius: 4px;
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
                    font-size: 1.3rem;
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
                </style>
            </head>
            <body>
                <h1>SVG Icons</h1>
                <input oninput="handleInputChange(this.value)" placeholder="Search" type="text"/>
                <div class="results">
                <table>
                <thead>
                    <tr>
                    <td>icon</td>
                    <td>icon_name</td>
                    </tr>
                </thead>
                    <tbody>
                    <tr data-icon-name="add_task" >
                                    <td class="icon">
                                        <i class="material-icons">add_task</i>
                                    </td>
                                    <td class="icon-name">
                                        <button onclick="addSnippet()">add_task</button>
                                    </td>
                    </tr>
                </tbody>
		</table>
		</div>
		<script>
		function handleInputChange(searchTerm){
			console.log(searchTerm);
			document.querySelectorAll("tr").forEach(element => {
				var iconName = element.getAttribute("data-icon-name");
				if (iconName){
					if (searchTerm == ""){
						element.classList.remove("hidden");
					} else if (iconName.includes(searchTerm) ){
						element.classList.remove("hidden");
					} else {
						element.classList.add("hidden");
					}
				}
			});
		}
		function addSnippet(){
			console.log("Woah");
		}
		(function(){
			document.querySelector('input').focus();
		})()
		</script>
        <script src="${scriptUri}">
	</body>
	</html>`;
    }
}
exports.iconlistPanel = iconlistPanel;
iconlistPanel.viewType = "SVG Icon List";
//# sourceMappingURL=iconlistPanel.js.map