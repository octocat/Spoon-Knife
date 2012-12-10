#!/usr/bin/env perl -w

use strict;

my $filename = $ARGV[0];

if (!$filename) {
    print "Usage: docblocks.pl <filename>\n";
    exit(1);
}

my %allowed = ("" => 1,
               "<?php" => 1);

open(HANDLE, "<", $filename) or die "Cannot open $filename\n";

while (<HANDLE>) {
    chomp;

    if ($_ =~ /\/\*\*/) {
        exit(0);
    } elsif (!$allowed{$_}) {
        print $filename."\n";
        exit(1);
    }
}
