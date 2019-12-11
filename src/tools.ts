import { which } from "shelljs";
import * as childProcess from 'child_process';
import { ExecException, ExecOptions } from 'child_process';
import { ColorPresentation } from "vscode";
import { Cli } from './cli';



export class ToolsConfig {

    private static readonly cmd = 'operator-sdk';

    public static async getVersion(){
        const whichLocation  = which(ToolsConfig.cmd);
        const result = await Cli.getInstance().execute(`${this.cmd} version`);
        let versionArr = result.stdout.split(" ");
        return versionArr[2].trim().replace( /,/g, "" );
    }


    public static async checkGoPath(){
        const currentLocation = await Cli.getInstance().execute('pwd');
        console.log(currentLocation);
       const gopath = process.env.GOPATH;
       console.log(gopath);

    }


    public static async getGoPath(){
        return process.env.GOPATH;
    }

       


}