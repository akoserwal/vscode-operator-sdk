'use strict';

import * as vscode from 'vscode';

export class Terminal {
	static terminal: vscode.Terminal;

	static ensureTerminalExists(): boolean {
		if ((<any>vscode.window).terminals.length === 0) {
			vscode.window.showErrorMessage('No active terminals');
			return false;
		}
		return true;
	}

	static getInstance() {
		if (!Terminal.terminal) {
			Terminal.terminal = vscode.window.createTerminal();
		}
		return Terminal.terminal;
	}


	static async showOutput(output: string) {
		const terminal = this.getInstance()
		if (Terminal.ensureTerminalExists()) {
			if (terminal) {
				terminal.show(true);
				await terminal.sendText(output, false);

			}
		}
	}

}
