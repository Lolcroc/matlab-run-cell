import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Activating "matlab-run-cell" extension.');

	const disposable = vscode.commands.registerCommand('matlab-run-cell.runCell', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor === undefined || editor.document.languageId !== 'matlab') {
			return;
		}

		const document = editor.document;
		const cursorPosition = editor.selection.active;
		const text = document.getText();

		// Find the start of the current cell
		const startDelimiter = text.lastIndexOf('%%', document.offsetAt(cursorPosition));
		const start = startDelimiter === -1 ? 0 : document.positionAt(startDelimiter).line;

		// Find the end of the current cell
		const endDelimiter = text.indexOf('%%', document.offsetAt(cursorPosition));
		const end = endDelimiter === -1 ? document.lineCount : document.positionAt(endDelimiter).line;

		// Get the configurable timeout duration
		const config = vscode.workspace.getConfiguration('matlab-run-cell');
		const focusTimeOut = config.get<number>('focusTimeOut', 50);

		// Select the current cell
		const selection = new vscode.Selection(start, 0, end, 0);
		editor.selection = selection;

		// Run the current selection
		vscode.commands.executeCommand('matlab.runSelection');

		// Put the editor back in focus after a delay
		setTimeout(() => {
			vscode.window.showTextDocument(document);
		}, focusTimeOut);


		// Deselect the current cell
		editor.selection = new vscode.Selection(cursorPosition, cursorPosition);

	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
