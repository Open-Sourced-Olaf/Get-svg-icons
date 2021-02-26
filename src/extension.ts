import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "get-svg-icons-sidebar",
      sidebarProvider
    )
  );

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

  const hoverProvider = vscode.languages.registerHoverProvider(selector, {
    async provideHover(
      document: vscode.TextDocument,
      position: vscode.Position
    ) {
      const regex = /bi-((\w|\-)+)/i;
      const range = document.getWordRangeAtPosition(position, regex);
      if (!range) {
        return null;
      }
      const word = document.getText(range);
      const match = regex.exec(word);
      if (!match) {
        return null;
      }
      const iconName = match[1];
      const meta = await getMetaData();

      for (const item of meta) {
        if (iconName == item.name) {
          const iconSize = getConfiguration().get<number>("iconSize") || 100;
          const iconColor =
            getConfiguration().get<string>("iconColor") || "#bababa";
          const utf8String = item.svg.replace(
            /<path/gi,
            `<path fill="${iconColor}" `
          );
          const previewSvg =
            "data:image/svg+xml;utf8;base64," +
            Buffer.from(utf8String).toString("base64") +
            encodeSpaces(` | width=${iconSize} height=${iconSize}`);
          const icon = new vscode.MarkdownString(`![preview](${previewSvg})`);

          const hover: vscode.Hover = {
            range,
            contents: [icon, item.name],
          };
          return hover;
        }
      }
    },
  });

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

        const match = linePrefix.match(/icon(-)?/);
        if (!match) {
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
            additionalTextEdits: [
              vscode.TextEdit.delete(
                new vscode.Range(
                  position.line,
                  position.character - match[0].length,
                  position.line,
                  position.character
                )
              ),
            ],
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
  context.subscriptions.push(completionProvider, hoverProvider);
}

export function deactivate() {}
