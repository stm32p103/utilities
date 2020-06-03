import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscodedev" is now active!');

	// dummy command
	let disposable = vscode.commands.registerCommand('vscodedev.activate', ()=>{});

	vscode.commands.registerCommand('vscodedev.showWebview', () => {
        const rootPath = path.join( context.extensionPath, 'public' );
		const panel = vscode.window.createWebviewPanel( 'vscodedev.webview', 'Webview', vscode.ViewColumn.One,{
			localResourceRoots: [ vscode.Uri.file( rootPath ) ],
			enableScripts: true,
			retainContextWhenHidden: true
		} );

		const htmlPath = path.join( rootPath, 'index.html' );
        const rootUri = vscode.Uri.file( rootPath );
        const tmp = fs.readFileSync( htmlPath, { encoding: 'utf8' } );
		
		// modify <base>
		panel.webview.html = tmp.replace('<base href="/">', `<base href="${rootUri.with({scheme:'vscode-resource'}).toString()}/">`);

		panel.webview.onDidReceiveMessage( msg => {
			console.log( msg );
		} );
	}, disposable );

	
	context.subscriptions.push(disposable);
}

export function deactivate() {}
