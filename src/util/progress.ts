/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

 'use strict';

import * as vscode from 'vscode';
import { Cli } from "../cli";
import { ProgressOptions } from 'vscode';
import { Terminal } from './terminal';

export interface Step {
    command: string;
    increment: number;
    total?: number;
}

export class Progress {
    

    static async execCmd(title: string, cmd: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            await vscode.window.withProgress({
                    cancellable: false,
                    location: vscode.ProgressLocation.Notification,
                    title
                },
                async (progress: vscode.Progress<{increment: number, message: string}>, token: vscode.CancellationToken) => { 
                    const result = await Cli.getInstance().execute(cmd);
                    if (result.error === null) {
                        resolve(result);
                    } else {
                        reject(result.stderr);
                    }
                }
            );
        });
    }

}