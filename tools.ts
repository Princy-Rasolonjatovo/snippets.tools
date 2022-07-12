/**
 * Author : Princy Rasolonjatovo
 * github : https://github.com/Princy-Rasolonjatovo
 * email  : princy.m.rasolonjatovo@gmail.com
 * 
 * Description : somes snippets tools
 * 
 */
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from "rxjs";
import { FormControl } from "@angular/forms";




/**
 * Generic Autocomplete for angular forms
 */

export interface ISearchFilterQuery
{
	search : string;
}
export interface ISort<T>
{
    property: keyof T;
    order: 'asc' | 'desc';
};


export interface IPageRequest<T>
{
    page: number;
    size: number;
    sort?: ISort<T>;
};


export interface IPage<T>
{
    content: T[];
    total_elements: number;
    size: number;
    number: number;
};


export type TPaginatedEndpoint<T, Q> = 
    (pageable: IPageRequest<T>, query: Q) => Observable<IPage<T>>;



export type TFilterRetriever<T>       = (search  : string) => Observable<T[]>;
export type TPageFilterRetriever<T>   = (request : IPageRequest<T>, query: ISearchFilterQuery) => Observable<IPage<T>>;
export type TAutocompleteDisplayer<T> = (object  : T) => string; 

export class GenericAutocomplete<T>
{
	public filtered_options$          : Observable<T[]>;
	public control                    : FormControl;
	private _subject_selected_option$ : BehaviorSubject<T|undefined|null>;

	constructor(
		private retreiver : TFilterRetriever<T> | TPageFilterRetriever<T>,
		public displayer  : TAutocompleteDisplayer<T>,
	)
	{
		this.control = new FormControl();
		this.filtered_options$ = this.control.valueChanges.pipe(
			startWith(),
			debounceTime(300),
			distinctUntilChanged(),
			switchMap(value => {
				function isTFilterRetriever(fn : TFilterRetriever<T> | TPageFilterRetriever<T>): fn is TFilterRetriever<T>
				{
					return fn.length === 1;
				}
				if (isTFilterRetriever(this.retreiver))
				{
					return (this.retreiver as TFilterRetriever<T>)(value);
				}
				return (this.retreiver as TPageFilterRetriever<T>)(
					{page: 0, size: 10}, {search: value})
					.pipe(map(page=>page.content));
			})
		);
		this._subject_selected_option$ = new BehaviorSubject<T|undefined|null>(null);
	}

	get selected_option$()
	{
		return this._subject_selected_option$.asObservable();
	}

	set_selected_option(option: T)
	{
		this._subject_selected_option$.next(option);
	}
	
	
}

/**
 * Python like range generator xrange(start, stop, step)
 * @param start   start value
 * @param end 	  end value
 * @param step    
 * @returns       yield value until start > end
 */
export const range = function (start: number, end: number, step:number=1) {
	return {
		[Symbol.iterator]()
		{
			return this;
		},
		next ()
		{
			if (start < end)
			{
				start += step;
				return { value: start, done: false };
			}
			return {done: true, value: end};
		}
	}
};



/**
 * 
 * HOW TO PIPE
 * const pipe = (...args) => args.reduce((acc, el) => el(acc));
 * const title = '10 Weird Facts About Dogs';
 * const toLowerCase = (str) => str.toLowerCase();
 * const addHyphens = (str) => str.replace(/\s/g, '-');
 * const slug = pipe(title, toLowerCase, addHyphens);
 */
 export const func_pipe = (...args: any[]) => args.reduce((acc, el) => el(acc));


/**
 * Make something optionnal
 */
type _Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = _Omit<T, K> & Partial<Pick<T, K>>;