let rec subset a b = match a with
	| h::t -> if List.mem h b 
			  then subset t b
			  else false
	| _ -> true;;

let equal_sets a b = (subset a b) && (subset b a);;

let set_union a b = a@b;;

let rec set_intersection a b = match a with
	| [] -> []
	| h::t -> if List.mem h b
			  then h::set_intersection t b
			  else set_intersection t b;;

let rec set_diff a b = match a with
	| [] -> []
	| h::t -> if List.mem h b
			  then set_diff t b
			  else h::set_diff t b;;

(*********************************************************************************)

let rec computed_fixed_point eq f x = 
	if eq x (f x)
	then x
    else computed_fixed_point eq f (f x);;

let rec helper f p x = match p with
	| 0 -> x
	| _ -> f (helper f (p-1) x);;

let rec computed_periodic_point eq f p x = 
	if eq x (helper f p x)
	then x
	else computed_periodic_point eq f p (f x);;

(*********************************************************************************)

type ('nonterminal, 'terminal) symbol =
  | N of 'nonterminal
  | T of 'terminal;;

let rec good_symbol rules = match rules with
	| [] -> []
	| h::t -> (fst h)::good_symbol t;;

let is_terminal e good_rules = match e with
	| T s -> true
	| N s -> List.mem s (good_symbol good_rules);;

let rec check_terminal symbol_list good_rules = match symbol_list with
	| [] -> true
	| h::t -> if is_terminal h good_rules 
			  then check_terminal t good_rules
			  else false;;

let check_good_rule rule good_rules = match rule with
	| (start_symbol, sub_list) -> check_terminal sub_list good_rules;;

let rec scan_rules_helper good_rules rules = match rules with
	| [] -> []
	| h::t -> if List.mem h good_rules || check_good_rule h good_rules
			  then h::scan_rules_helper good_rules t
			  else scan_rules_helper good_rules t;;

let scan_rules rules =
	(scan_rules_helper (fst rules) (snd rules) , (snd rules));;

let find_good_rules good_rules rules = 
	computed_fixed_point (=) scan_rules ([], rules);;

let filter_blind_alleys g = match g with
	| (start_symbol, rules) -> (start_symbol, fst (find_good_rules [] rules));;

