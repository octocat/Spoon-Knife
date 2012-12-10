#!/usr/bin/env perl -w

use strict;

my $filename = $ARGV[0];

if (!$filename) {
    print "Usage: modified_otb.pl <filename>\n";
    exit(1);
}

my @results = ();
my $line_num = 0;
my ($NONE, $BRACE, $PAREN) = (0, 1, 2);
my $looking_for = $NONE;
my $last_func_name = "";

open(HANDLE, "<", $filename) or die "Cannot open $filename\n";

# Read the file and track the lines with length > $max_length.
while (<HANDLE>) {
    $line_num++;
    # Subtract one because the newline doesn't count toward the
    # length.
    chomp;

    if (!$looking_for &&
        ($_ =~ /^\s*function/) &&
        ($_ =~ /\{/)) {
        # Done (bad): we found a function whose opening line ends with
        # a brace, which goes against the PEAR coding guidelines.

        ($last_func_name) = $_ =~ /function\s*(.*)\(/;

        push @results, "'$last_func_name' prototype ends with opening ".
            "brace, line $line_num";
    } elsif (!$looking_for &&
               ($_ =~ /^\s*function/) &&
               ($_ !~ /\)/)) {
        ($last_func_name) = $_ =~ /function\s*(.*)\(/;
        $looking_for = $PAREN;
    } elsif (($looking_for == $PAREN) &&
               ($_ =~ /\)/) &&
               ($_ =~ /\{/)) {
        # Done (bad): function prototype and brace are on the same
        # line.
        push @results, "'$last_func_name' prototype ends with with ".
            "opening brace, line $line_num";
        $looking_for = $NONE;
    } elsif (($looking_for == $PAREN) &&
               ($_ =~ /\)/) &&
               ($_ !~ /\{/)) {
        $looking_for = $BRACE;
    } elsif (!$looking_for &&
               ($_ =~ /^\s*function/) &&
               ($_ =~ /\)/) &&
               ($_ !~ /\{/)) {
        ($last_func_name) = $_ =~ /function\s*(.*)\(/;
        $looking_for = $BRACE;
    } elsif (($looking_for == $BRACE) &&
               ($_ eq "{")) {
        $looking_for = $NONE;
        # Done (good): the brace was found on the line after the
        # function prototype.
    } else {
        # We got here because we got a line that we're not interested
        # in.
        $looking_for = $NONE;
    }
}

# If any long lines were found, notify and exit(1); otherwise,
# exit(0).
if (@results) {
    foreach my $result (@results) {
        print "$filename: $result\n";
    }
    exit(1);
} else {
    exit(0);
}
