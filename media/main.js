(function() {
    const vscode = acquireVsCodeApi();

    vscode.window.showInformationMessage('Hii');
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
    console.log('Doobie doobie dooba');
})();