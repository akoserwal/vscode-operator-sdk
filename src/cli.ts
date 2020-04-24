'use strict';

import * as childProcess from 'child_process';
import * as vscode from 'vscode';
import { ExecException, ExecOptions } from 'child_process';
import { Terminal } from './terminal';


export interface CMDResponse {
    readonly error: ExecException | null;
    readonly stdout: string;
    readonly stderr: string;
}

export interface Commands {
    execute(cmd: string, opts?: ExecOptions): Promise<CMDResponse>;
}


export class Cli implements Commands {
    private static cli: Cli;

    private constructor() {}

    static getInstance(): Cli {
        if (!Cli.cli) {
            Cli.cli = new Cli();
        }
        return Cli.cli;
    }

   async execute(cmd: string, opts?: childProcess.ExecOptions): Promise<CMDResponse> {
        return new Promise<CMDResponse>(async (resolve, reject) => {
            Terminal.showOutput(cmd);
            childProcess.exec(cmd, (error: ExecException | null, stdout: string, stderr: string) => { 
                resolve({error, stdout, stderr});
            });

        });
       
    }

}