import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(
		"get-svg-icons-sidebar",
		sidebarProvider
	  )
	);

	let disposable2 = vscode.commands.registerCommand('get-svg-icons.insertText', function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            editor.edit(editBuilder => {
                editor.selections.forEach(sel => {
					const position = editor.selection.active;
					editBuilder.insert(position, 'text');
                })
            })
        }
    });

	interface svgMeta {
		name: string;
		tags: string[];
		svg: string;
	  }
	
	  const metaPath = path.resolve(__dirname, "../snippets/bootstrap-icons.json");
	  const getMetaData = (): Promise<svgMeta[]> =>
		new Promise((resolve, reject) => {
		  fs.readFile(metaPath, (err, data) => {
			if (err) {
			  reject(err);
			  return;
			}
			return resolve(JSON.parse(data.toString("utf8")));
		  });
		});
	
	  const getConfiguration = () =>
		vscode.workspace.getConfiguration("getSvgIcons");
	
	  const encodeSpaces = (content: string) => {
		return content.replace(/ /g, "%20");
	  };
	
	  const selector = getConfiguration().get<string[]>("selector") || [];
	
	  const completionProvider = vscode.languages.registerCompletionItemProvider(
		selector,
		{
		  async provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position
		  ) {
			let linePrefix = document
			  .lineAt(position)
			  .text.substr(0, position.character);
			if (!linePrefix.endsWith("icon-")) {
			  return [];
			}
			const meta = await getMetaData();
	
			return [...meta].map((m): vscode.CompletionItem & {
			  meta: any;
			} => {
			  return {
				label: `icon-${m.name}`,
				insertText: m.svg,
				kind: vscode.CompletionItemKind.Snippet,
				sortText: m.name,
				meta: m,
			  };
			});
		  },
		  resolveCompletionItem(
			item: vscode.CompletionItem & {
			  meta: any;
			},
			token: vscode.CancellationToken
		  ): vscode.ProviderResult<vscode.CompletionItem> {
			const iconSize = getConfiguration().get<number>("iconSize") || 100;
			const iconColor =
			  getConfiguration().get<string>("iconColor") || "#bababa";
			const utf8String = item.meta.svg
			  .toString("utf8")
			  .replace(/<path/gi, `<path fill="${iconColor}" `);
			const previewSvg =
			  "data:image/svg+xml;utf8;base64," +
			  Buffer.from(utf8String).toString("base64") +
			  encodeSpaces(` | width=${iconSize} height=${iconSize}`);
			return {
			  ...item,
			  documentation: new vscode.MarkdownString(`![preview](${previewSvg})`),
			  detail: item.meta.name,
			};
		  },
		},
		"-"
	  );
	context.subscriptions.push(disposable2,completionProvider);
}

export function deactivate() {}
