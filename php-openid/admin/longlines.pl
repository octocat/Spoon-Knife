#!/usr/bin/env perl -w

use strict;

my $filename = $ARGV[0];

if (!$filename) {
    print "Usage: longlines.pl <filename> [length]\n";
    exit(1);
}

# Set a default maximum line length.
my $max_length = $ARGV[1] || 80;

my @lines = ();
my $line_num = 0;

open(HANDLE, "<", $filename) or die "Cannot open $filename\n";

# Read the file and track the lines with length > $max_length.
while (<HANDLE>) {
    $line_num++;
    # Subtract one because the newline doesn't count toward the
    # length.
    if (length($_) - 1 > $max_length) {
        push @lines, $line_num;
    }
}

# If more than five long lines were found, truncate to five and
# indicate that others were present, too.
if (@lines > 5) {
    @lines = @lines[0..4];
    push @lines, "and others";
}

# If any long lines were found, notify and exit(1); otherwise,
# exit(0).
if (@lines) {
    print $filename." (line".((@lines > 1) ? "s" : "")." ".
        join(", ", @lines)." exceed".((@lines == 1) ? "s" : "").
        " length $max_length)\n";
    exit(1);
} else {
    exit(0);
}
