'use strict';

import { ToolsConfig } from "./tools";
import * as vscode from 'vscode';
import { InputBoxOptions, Uri } from "vscode";
import { Cli } from "./cli";
import { Operator } from "./operator";



export class OperatorSdk {


    static async printDeps(printDeps: any): Promise<any> {
        if (Operator.getInstance().path === undefined) {
            await OperatorSdk.setOpPAth();
        }
        
        const result = await Cli.getInstance().execute(`cd ` + Operator.getInstance().path + ' && ' + `operator-sdk print-deps`);
        if (result.error !== null) {
            vscode.window.showErrorMessage(result.stderr);
        } else {
            vscode.window.showInformationMessage(result.stdout);
        }
    
    }



    static async setOperatorPath(setOperatorPath: any): Promise<any> {
        if (Operator.getInstance().path === undefined) {
            await OperatorSdk.setOpPAth();
        }
    }


    static async run(run: any): Promise<any> {
        if (Operator.getInstance().path === undefined) {
            await OperatorSdk.setOpPAth();
        }

        const op: InputBoxOptions = {
            prompt: "Enter the NAMESPACE",
            placeHolder: "namespace",
        };
        const namespace = vscode.window.showInputBox();

        const result = await Cli.getInstance().execute(`cd ` + Operator.getInstance().path + ' && ' + `operator-sdk run --local --namespace=` + namespace);
        //operator-sdk up local --namespace=default
        if (result.error !== null) {
            vscode.window.showErrorMessage(result.stderr);
        } else {
            vscode.window.showInformationMessage("Runing");
        }

    }


    static async generate(type: string): Promise<any> {
        if (Operator.getInstance().path === undefined) {
            await OperatorSdk.setOpPAth();
        }

        const result = await Cli.getInstance().execute(`cd ` + Operator.getInstance().path + ' && ' + `operator-sdk generate ` + type);

        if (result.error !== null) {
            vscode.window.showErrorMessage(result.stderr);
        } else {
            vscode.window.showInformationMessage("Generated:" + type);
        }

    }


    static async add(type: string): Promise<any> {
        if (Operator.getInstance().path === undefined) {
            await OperatorSdk.setOpPAth();

        }

        const options: InputBoxOptions[] = [{
            prompt: "Enter the Kind",
            placeHolder: "Memcached"

        }, {
            prompt: "Enter the api version",
            placeHolder: "cache.example.com/v1alpha1"

        }];
        const kind = await vscode.window.showInputBox(options[0]);
        const version = await vscode.window.showInputBox(options[1]);
        const result = await Cli.getInstance().execute(`cd ` + Operator.getInstance().path + ' && ' + `operator-sdk add ` + type + ` --api-version=` + version + ` --kind=` + kind);

        if (result.error !== null) {
            vscode.window.showErrorMessage(result.stderr);
        } else {
            vscode.window.showInformationMessage("Generated:" + type + " for kind:" + kind);
        }


    }



    private static async setOpPAth() {
        const defPath = await this.getOperatorDefaultPath();
        const op: InputBoxOptions = {
            prompt: "Enter the operator path",
            placeHolder: defPath + "github.com/operator-name",
            value: defPath + "github.com/"
        };
        const operatorPath = await vscode.window.showInputBox(op);
        if (operatorPath) {
            Operator.getInstance().path = operatorPath;
        }
    }

    static async newOperator(newOperator: any): Promise<any> {
        const operatorPath = await OperatorSdk.getOperatorDefaultPath();

        let opt: InputBoxOptions = {
            prompt: "Enter the new operator name & operator will be created at location:" + operatorPath,
            placeHolder: "github.com/name-operator"

        };

        const operatorName = await vscode.window.showInputBox(opt);
        if (operatorName) {
            Operator.getInstance().name = operatorName;
        }
        const cmd = `cd ` + operatorPath + ' && ' + `operator-sdk new ` + operatorName;
        const result = await Cli.getInstance().execute(cmd);

        Operator.getInstance().path = operatorPath + operatorName;

        if (result.error !== null) {
            vscode.window.showErrorMessage(result.stderr);
        } else {
            vscode.window.showInformationMessage("Operator created:" + Operator.getInstance().path, ...['open'])
                .then(async selection => {
                    if (selection === 'open') {
                        console.log("path:" + Operator.getInstance().path);
                        let uri = Uri.file(Operator.getInstance().path);
                        let suc = await vscode.commands.executeCommand('vscode.openFolder', uri);
                    }

                });
        }



    }

    private static async getOperatorDefaultPath() {
        const gopath = await ToolsConfig.getGoPath();
        const operatorPath = gopath + "/src/";
        return operatorPath;
    }

    static getSDkVersion() {
        return ToolsConfig.getVersion();
    }

}