
declare module "http-proxy-middleware" {
	
	interface MyOptions {
		target: string;
		forward?: string;
		agent?: string;
		secure?: boolean;
		xfwd?: boolean;
		toProxy?: string;
		hostRewrite?: string;
	}
	
	function thing(context: string, options: MyOptions): any;
	export = thing;
}