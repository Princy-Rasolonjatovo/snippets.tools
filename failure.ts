export type TFun<T>   = (arg: T|any, ...args: any[]) => any; 
export type TMaybe<T> = T | null | undefined;


export interface IMFailure<T>
{
    value    : TMaybe<T> | any;
    hasError : boolean;
    errors   : Object;
}


export class MFailure<T> implements IMFailure<T>
{
    value    : TMaybe<T> | any;
    hasError : boolean;
    errors   : Object;
    

    constructor(value: TMaybe<T> | any, hasError=false, errors={})
    {
        this.value    = value;
        this.hasError = hasError;
        this.errors   = errors;
    }

    public bind(f: TFun<T>, ...args: any[]): MFailure<T>
    {
        try
        {
            let r = f(this.value, ...args);
            return new MFailure<T>(r, false);
        }catch(e)
        {
            return new MFailure<T>(undefined, true, e as Object);
        }
    }
}