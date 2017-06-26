use std::io::BufReader;
use std::fs::File;
use std::io::prelude::*;
use std::iter::Iterator;
use std::iter::FromIterator;
use std::env;

// recursive palindrome finder function
fn is_palindrome(palin: String) -> bool {
	let size = palin.len();
	if size == 0 || size == 1 {
        return true;
    }
    else {
        if palin.chars().nth(0).unwrap() != palin.chars().nth(size - 1).unwrap() {
            return false;
            }
        else {
        	let p = &palin[1..size-1];
            return is_palindrome(p.to_string());
    	}
    }
}

//main
fn main() {
	let args: Vec<_> = env::args().collect();
    if args.len() > 1 {
        let ref file_name = args[1];
        let file = BufReader::new(File::open(file_name).expect("Unable to open file! Check if file exists."));
	    for line in file.lines().filter_map(|result| result.ok()) {
	    	if line != "" {
		    	let ref palin1 = line.replace(" ", "");
		    	let palin2 = palin1.replace("	", "");
		    	let palin3 = palin2.replace("", "");
		    	if is_palindrome(palin2) == true {
		    		print!("AY")
		    	}
		    	else {
		    		print!("NAY")
		    	}
		    	// lexical reverse sorting
			    let s_slice: &str = &palin3[..];
			    let mut chars: Vec<char> = s_slice.chars().collect();
			    chars.sort_by(|a, b| b.cmp(a));
			    let s = String::from_iter(chars);
			    println!(" | {}", s);
	    	}
	    }
    }
    // ensures argument is passed
    else {
    	print!("File argument not given.");
    	 std::process::exit(0);
    }
}