// This code is editable and runnable!

use std::io::stdin;
use std::io::BufReader;
use std::fs::File;
use std::path::Path;
use std::io::prelude::*;
use std::env;


fn lines_from_file<P>(filename: P) -> Vec<String> where P: AsRef<Path>,
{
	let file = File::open(filename).expect("no such file");
	let buf = BufReader::new(file);
	buf.lines().map(|l| l.expect("Could not parse line")).collect()
}


fn main() {	
	let argument: Vec<_> = env::args().collect();
	println!("\nDirectory: {:?}\n", argument[1].to_string());

	let lines = lines_from_file(argument[1].to_string());
	let mut line = 0;
	
	for line in lines{
		let second: String = line.chars().rev().collect();
		let mut reverse_word: Vec<char> = line.chars().collect();		
		reverse_word.sort();
		let size = reverse_word.len();
		let mut z = size-1;

		if(line.to_lowercase() == second.to_lowercase())
		{
			print!("AY | ");
			loop {
				print!(" {}",&reverse_word[z]);
						
				if(z == 0){
					break;
				}
				z -= 1;
			}
		}
		else{
			print!("NAY | ");
			loop {
				print!(" {}",&reverse_word[z]);

				if(z == 0){
					break;
				}
				z -= 1;
			}
		}
		println!("");
	}
}
