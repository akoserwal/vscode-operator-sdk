/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

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
			Terminal.terminal = vscode.window.createTerminal("operator-sdk");
		}
		return Terminal.terminal;
	}


	static async showOutput(output: string) {
		const terminal = this.getInstance();
		if (Terminal.ensureTerminalExists()) {
			if (terminal) {
				await terminal.sendText(output, true);
				terminal.show(true);
			}
		}
	}

}
