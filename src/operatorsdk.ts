/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

'use strict';

import { ToolsConfig } from "./util/tools";
import * as vscode from 'vscode';
import { InputBoxOptions, Uri } from "vscode";
import { Cli } from "./cli";
import { Operator } from "./operator";
import { Progress } from "./util/progress";
import * as fs from 'fs';
import { Terminal } from "./util/terminal";


export class OperatorSdk {
    static deploy(deploy: any): any {
        throw new Error("Method not implemented.");
    }
    static debug(debug: any): any {
        throw new Error("Method not implemented.");
    }
    static cleanup(cleanup: any): any {
        throw new Error("Method not implemented.");
    }
    static migrate(migrate: any): any {
        throw new Error("Method not implemented.");
    }
    static scorecard(scorecard: any): any {
        throw new Error("Method not implemented.");
    }
    static olm(olm: any): any {
        throw new Error("Method not implemented.");
    }
    static test(test: any): any {
        throw new Error("Method not implemented.");
    }

    static async bundle(bundleType: any): Promise<any> {
        await OperatorSdk.isValidInstance();
        let flag: string | undefined;
        if (bundleType === "create") {
            const opflag: InputBoxOptions[] = [{
                prompt: "directory",
                placeHolder: "./deploy/olm-catalog/test-operator/0.1.0 "
            }, {
                prompt: "package",
                placeHolder: "test-operator"
            }, {
                prompt: "channels",
                placeHolder: "beta"
            },
            {
                prompt: "default-channel",
                placeHolder: "beta"
            }];
            const directory = await vscode.window.showInputBox(opflag[0]);
            const packOp = await vscode.window.showInputBox(opflag[1]);
            const channels = await vscode.window.showInputBox(opflag[2]);
            const defChannels = await vscode.window.showInputBox(opflag[3]);
            flag = "--directory" + directory + "--package" + packOp + "--channels" + channels + "--default-channel" + defChannels;
        } else {
            const opImage = {
                prompt: "validation image",
                placeHolder: "quay.io/example/test-operator:v0.1.0",
            };
            flag = await vscode.window.showInputBox(opImage);
        }
        const OPSDK_Bundle = OperatorSdk.getOperatorDir() + OperatorSdk.getBundleCMD(bundleType, flag);
        Progress.execCmd("Bundle:" + bundleType, OPSDK_Bundle)
            .then((result) => vscode.window.showInformationMessage("Generated bundle:" + bundleType + result))
            .catch((error) => vscode.window.showErrorMessage(error));
    }


    private static getBundleCMD(bundleType: string, flag: string | undefined) {
        return `operator-sdk bundle ` + bundleType + flag;
    }

    private static getOperatorDir() {
        return `cd ` + Operator.getInstance().path + ' && ';
    }

    static async build(): Promise<any> {
        await OperatorSdk.isValidInstance();
        const opImage: InputBoxOptions = {
            prompt: "Enter the image name",
            placeHolder: "quay.io/example/operator:v0.0.1",
        };
        const imageName = await vscode.window.showInputBox(opImage);
        console.log(imageName);
        const OPSDK_BUILD = OperatorSdk.getOperatorDir() + OperatorSdk.getBuildCMD(imageName);
        console.log(OPSDK_BUILD);
        Progress.execCmd("Building image:" + imageName, OPSDK_BUILD)
            .then((result) => vscode.window.showInformationMessage("image generated"))
            .catch((error) => vscode.window.showErrorMessage(error));
    }


    private static getBuildCMD(imageName: string | undefined) {
        return `operator-sdk build ` + imageName;
    }

    private static async isValidInstance() {
        if (Operator.getInstance().path === undefined) {
            await OperatorSdk.setOpPAth();
        }
    }

    static async printDeps(printDeps: any): Promise<any> {
        await OperatorSdk.isValidInstance();
        const OPSDK_PRINT_DEPS = OperatorSdk.getOperatorDir() + OperatorSdk.getPrintDepCMD();
        Terminal.execInTerminal(OPSDK_PRINT_DEPS);
    }

    private static getPrintDepCMD() {
        return `operator-sdk print-deps`;
    }

    static async setOperatorPath(setOperatorPath: any): Promise<any> {
        if (Operator.getInstance().path === undefined) {
            await OperatorSdk.setOpPAth();
        }
    }


    static async run(run: any): Promise<any> {
        await OperatorSdk.isValidInstance();

        const op: InputBoxOptions = {
            prompt: "Enter the NAMESPACE",
            placeHolder: "namespace",
        };
        const namespace = await vscode.window.showInputBox(op);
        Terminal.execInTerminal(OperatorSdk.getOperatorDir() + OperatorSdk.getRunCMD(namespace));
    }


    private static getRunCMD(namespace: string | undefined) {
        return `operator-sdk run --local --watch-namespace=` + namespace;
    }

    static async generate(type: string): Promise<any> {
        await OperatorSdk.isValidInstance();
        const OPSDK_GEN = OperatorSdk.getOperatorDir() + OperatorSdk.getGenerateCMD(type);
        Progress.execCmd("generate:" + type, OPSDK_GEN)
            .then((result) => vscode.window.showInformationMessage("Generated:" + type))
            .catch((error) => vscode.window.showErrorMessage(error));
    }


    private static getGenerateCMD(type: string) {
        return `operator-sdk generate ` + type;
    }

    static async add(type: string): Promise<any> {
        await OperatorSdk.isValidInstance();
        const options: InputBoxOptions[] = [{
            prompt: "Enter the Kind",
            placeHolder: "Memcached"

        }, {
            prompt: "Enter the api version",
            placeHolder: "cache.example.com/v1alpha1"

        }];
        const kind = await vscode.window.showInputBox(options[0]);
        const version = await vscode.window.showInputBox(options[1]);
        const OPSDK_ADD = OperatorSdk.getOperatorDir() + OperatorSdk.getAddCMD(type, version, kind);
        Progress.execCmd("add:" + type, OPSDK_ADD)
            .then((result) => vscode.window.showInformationMessage("Generated:" + type + " for kind:" + kind))
            .catch((error) => vscode.window.showErrorMessage(error));
    }



    private static getAddCMD(type: string | undefined, version: string | undefined, kind: string | undefined) {
        return `operator-sdk add ` + type + ` --api-version=` + version + ` --kind=` + kind;
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
        const operatorGoPath = await OperatorSdk.getOperatorDefaultPath();
        let goPathFlag = false;

        let opt: InputBoxOptions[] = [{
            prompt: "Enter the location where you want to create the operator",
            value: operatorGoPath + "github.com/<operator-dir>/"
        }, {
            prompt: "Enter the repo name & operator name",
            placeHolder: "github.com/<user>/<operator-name>",
            value: "github.com/<user>/<operator-name>"
        }];


        let operatorPathInput = await vscode.window.showInputBox(opt[0]);
        const operatorInput = await vscode.window.showInputBox(opt[1]);
        var opa: string[] | undefined = operatorInput?.split("/");
        var operatorName = "";
        if (opa !== undefined) {
            operatorName = opa[2];
        }

        if (operatorPathInput !== undefined) {
            const oplen = operatorGoPath.length;
            const res = operatorGoPath.localeCompare(operatorPathInput.slice(0, oplen));
            if (res === 0) {
                goPathFlag = true;
            }

            let opPathLen = operatorPathInput.length;
            if ("/" !== operatorPathInput.slice(opPathLen - 1, opPathLen)) {
                operatorPathInput = operatorPathInput + "/";
            }

            ToolsConfig.checkDirectory(operatorPathInput);
        }

        if (operatorName) {
            Operator.getInstance().name = operatorName;
        }


        let cmd = OperatorSdk.getNewCMD(goPathFlag, operatorPathInput, operatorName, operatorInput);

        Progress.execCmd("creating new operator:" + operatorName, cmd)
            .then((result) => OperatorSdk.openGeneratedOperator(operatorName, operatorPathInput)
            ).catch((error) => vscode.window.showErrorMessage(error)
            );

    }

    private static getNewCMD(goPathFlag: boolean, operatorPathInput: string | undefined, operatorName: string, operatorInput: string | undefined) {
        let cmd = "";
        if (goPathFlag) {
            cmd = `cd ` + operatorPathInput + ' && ' + `operator-sdk new ` + operatorName;
        }
        else {
            cmd = `cd ` + operatorPathInput + ' && ' + `GO111MODULE=on operator-sdk new ` + operatorName + ` --repo ` + operatorInput;
        }
        return cmd;
    }

    private static openGeneratedOperator(operatorName: string, operatorPathInput: string | undefined): void | PromiseLike<void> {
        return vscode.window.showInformationMessage("Operator created:" + operatorName, ...['open'])
            .then(async (selection) => {
                if (selection === 'open') {
                    Operator.getInstance().path = operatorPathInput + operatorName;
                    console.log("path:" + Operator.getInstance().path);
                    let uri = Uri.file(Operator.getInstance().path);
                    let suc = await vscode.commands.executeCommand('vscode.openFolder', uri);
                }
            });
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