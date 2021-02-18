"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const SidebarProvider_1 = require("./SidebarProvider");
function activate(context) {
    const sidebarProvider = new SidebarProvider_1.SidebarProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("get-svg-icons-sidebar", sidebarProvider));
    let disposable2 = vscode.commands.registerCommand('get-svg-icons.insertText', function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            editor.edit(editBuilder => {
                editor.selections.forEach(sel => {
                    const position = editor.selection.active;
                    editBuilder.insert(position, 'text');
                });
            });
        }
    });
    context.subscriptions.push(disposable2);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map