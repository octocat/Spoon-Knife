"""
Fetch the current TLD list from the IANA Web site, parse it, and print
an expression suitable for direct insertion into each library's trust
root validation module

Usage:
  python gettlds.py (php|python|ruby)

Then cut-n-paste.
"""

import urllib2

import sys

langs = {
    'php': (r"'/\.(",
            "'", "|", "|' .",
            r")\.?$/'"),
    'python': ("['",
               "'", "', '", "',",
               "']"),
    'ruby': ("%w'",
             "", " ", "",
             "'"),
    }

lang = sys.argv[1]
prefix, line_prefix, separator, line_suffix, suffix = langs[lang]

f = urllib2.urlopen('http://data.iana.org/TLD/tlds-alpha-by-domain.txt')
tlds = []
output_line = ""
for input_line in f:
    if input_line.startswith('#'):
        continue

    tld = input_line.strip().lower()
    new_output_line = output_line + prefix + tld
    if len(new_output_line) > 60:
        print output_line + line_suffix
        output_line = line_prefix + tld
    else:
        output_line = new_output_line
    prefix = separator

print output_line + suffix
