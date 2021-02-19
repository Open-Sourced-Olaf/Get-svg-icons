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
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const SidebarProvider_1 = require("./SidebarProvider");
function activate(context) {
    const sidebarProvider = new SidebarProvider_1.SidebarProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("get-svg-icons-sidebar", sidebarProvider));
    const metaPath = path.resolve(__dirname, "../snippets/bootstrap-icons.json");
    const getMetaData = () => new Promise((resolve, reject) => {
        fs.readFile(metaPath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            return resolve(JSON.parse(data.toString("utf8")));
        });
    });
    const getConfiguration = () => vscode.workspace.getConfiguration("getSvgIcons");
    const encodeSpaces = (content) => {
        return content.replace(/ /g, "%20");
    };
    const selector = getConfiguration().get("selector") || [];
    const completionProvider = vscode.languages.registerCompletionItemProvider(selector, {
        provideCompletionItems(document, position) {
            return __awaiter(this, void 0, void 0, function* () {
                let linePrefix = document
                    .lineAt(position)
                    .text.substr(0, position.character);
                if (!linePrefix.endsWith("icon-")) {
                    return [];
                }
                const meta = yield getMetaData();
                return [...meta].map((m) => {
                    return {
                        label: `icon-${m.name}`,
                        insertText: m.svg,
                        kind: vscode.CompletionItemKind.Snippet,
                        sortText: m.name,
                        meta: m,
                    };
                });
            });
        },
        resolveCompletionItem(item, token) {
            const iconSize = getConfiguration().get("iconSize") || 100;
            const iconColor = getConfiguration().get("iconColor") || "#bababa";
            const utf8String = item.meta.svg
                .toString("utf8")
                .replace(/<path/gi, `<path fill="${iconColor}" `);
            const previewSvg = "data:image/svg+xml;utf8;base64," +
                Buffer.from(utf8String).toString("base64") +
                encodeSpaces(` | width=${iconSize} height=${iconSize}`);
            return Object.assign(Object.assign({}, item), { documentation: new vscode.MarkdownString(`![preview](${previewSvg})`), detail: item.meta.name });
        },
    }, "-");
    context.subscriptions.push(completionProvider);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map