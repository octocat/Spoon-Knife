#!/usr/bin/env python

"""This script searches files for functions that are just aliases in
PHP source code. This is not 100% reliable, so it should not be
automated, but it's useful to run once in a while to make sure that
all of the matches it finds are not really legitimate aliases.

Usage:

  parse_aliases.py <name of alias file> [PHP source code filename]...
"""

import sys

# Fetch this URL to get the file that is parsed into the aliases list
alias_url = 'http://www.zend.com/phpfunc/all_aliases.php'

header_tok = '<!-- END OF HEADER -->';
footer_tok = '<!-- FOOTER -->';

# Example line of the table that we parse:
# '<tr bgcolor="#EFEFFF"><td><a href="function.bzclose.php">bzclose</a></td><td><a href="http://lxr.php.net/source/php-src/ext/bz2/bz2.c#48">php-src/ext/bz2/bz2.c</a></td><td><a href="function.fclose.php">fclose</a></td></tr>'

import re

line_re = re.compile(r'''
\A

<tr\ bgcolor="[^">]+">

<td><a\ href="[^>"]+\.php">([^<>]+)</a></td>

<td><a\ href="[^">]+">[^<>]+</a></td>

<td>
(?:
    <a\ href="[^">]+\.php">
    ( [^<>]+ )
    </a>
|   ( [^<>]+ )
)
</td>

</tr>

\Z
''', re.VERBOSE)

def parseString(s):
    _, rest = s.split(header_tok, 1)
    body, _ = rest.split(footer_tok, 1)

    lines = body.split('\n')
    assert [s.strip() for s in lines[-2:]] == ['</table>', '']
    assert lines[0].strip().startswith('<table')
    del lines[0], lines[-2:]
    aliases = {}
    for line in lines:
        mo = line_re.match(line)
        assert mo, line
        alias, master1, master2 = mo.groups()
        if master1:
            master = master1
        else:
            assert master2
            master = master2
        aliases[alias] = master

    return aliases

def parseFile(f):
    return parseString(f.read())

def parseFileName(fn):
    return parseFile(file(fn, 'r'))

def parseURL(url):
    return parseFile(urllib2.urlopen(url))

def getAliasRE(aliases):
    return re.compile(r'(->|\$|)\s*\b(%s)\b' % ('|'.join(aliases.keys())))

def checkAliasesFile(alias_re, f):
    found = []
    line_num = 1
    for line in f:
        for mo in alias_re.finditer(line):
            if mo.group(1):
                continue
            alias = mo.group(2)
            found.append((line_num, alias))
        line_num += 1
    return found

def checkAliases(alias_re, filename):
    return checkAliasesFile(alias_re, file(filename, 'r'))

def checkAliasesFiles(alias_re, filenames):
    found = []
    for filename in filenames:
        file_found = checkAliases(alias_re, filename)
        found.extend([(filename, n, a) for (n, a) in file_found])
    return found

def dumpResults(aliases, found, out=sys.stdout):
    for filename, n, a in found:
        print >>out, "%s:%d %s -> %s" % (filename, n, a, aliases[a])

def main(alias_file, *filenames):
    aliases = parseFileName(alias_file)
    alias_re = getAliasRE(aliases)
    found = checkAliasesFiles(alias_re, filenames)
    dumpResults(aliases, found)
    return found

if __name__ == '__main__':
    found = main(*sys.argv[1:])
    if found:
        sys.exit(1)
