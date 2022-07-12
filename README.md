# snippets.tools


## MFailure (Monadic Failure)
Like **Option** in Rust we use a functionnal approach to handle a set of instructions _prone to errors_.
We can then chain functions, (composition in mathematics h : f o g ) (see category theory), and the MFailure object will handle any error in 
the pipeline.
