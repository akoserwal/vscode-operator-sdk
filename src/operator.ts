'use strict';

export class Operator {
    private _name!: string;
    
    private _apiVersion!: string;
   
    private _path!: string;
   
    private _kind!: string;

   
    private _repo!: string;


    public get repo(): string {
        return this._repo;
    }
    public set repo(value: string) {
        this._repo = value;
    }

    public get kind(): string {
        return this._kind;
    }
    public set kind(value: string) {
        this._kind = value;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get apiVersion(): string {
        return this._apiVersion;
    }
    public set apiVersion(value: string ) {
        this._apiVersion = value;
    }

    public get path(): string {
        return this._path;
    }
    public set path(value: string) {
        this._path = value;
    }

    private static operator: Operator; 
    private constructor() {}

    static getInstance(){
        if(!Operator.operator){
            Operator.operator = new Operator();
        } 
        return Operator.operator;
    }
    
}

