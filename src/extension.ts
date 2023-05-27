import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        "extension.clearComments",
        () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                const text = document.getText();
                const clearedText = text.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
                editor.edit((editBuilder) => {
                    const start = new vscode.Position(0, 0);
                    const end = new vscode.Position(
                        document.lineCount - 1,
                        document.lineAt(document.lineCount - 1).text.length
                    );
                    const range = new vscode.Range(start, end);
                    editBuilder.replace(range, clearedText);
                });
            }
        }
    );

    context.subscriptions.push(disposable);

    // Register the keybinding
    const disposableKeybinding = vscode.commands.registerCommand(
        "extension.clearCommentsKeybinding",
        () => {
            vscode.commands.executeCommand("extension.clearComments");
        }
    );

    context.subscriptions.push(disposableKeybinding);

    // Add the keybinding to the keybindings.json file
    const keybindings = vscode.workspace.getConfiguration("keyboard");
    const existingKeybindings = keybindings.get("bindings", []);
    const modifiedKeybindings = [
        ...existingKeybindings,
        {
            key: "shift+alt+c down",
            command: "extension.clearCommentsKeybinding",
            when: "editorTextFocus && !editorReadonly",
        },
    ];
    keybindings.update(
        "bindings",
        modifiedKeybindings,
        vscode.ConfigurationTarget.Global
    );
}
