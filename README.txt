Git OSX Installer
=================
=================

https://github.com/timcharper/git_osx_installer/


INSTALLATION
============

Step 1 - Install Package
------------------------
Double-click the package in this disk image to install. This installs
git to /usr/local/git, and places symlinks into /usr/local/bin and
/usr/share/man/.


Step 2 - Remove stubs (Yosemite and earlier)
--------------------------------------------
When you run `git`, you might see this message:

    'The "git" command requires the command line developer
    tools. Would you like to install the tools now?"

This is because OS X ships with stubs, and these stubs are taking
precedence over /usr/local/bin.

To resolve, run the following:

    sudo mv /usr/bin/git /usr/bin/git-system

This should not be a problem in OS X 10.11 (El Capitan), as
/usr/local/bin takes precedence over /usr/bin


UNINSTALLING
============

Run the uninstall script in /usr/local/git/uninstall.sh

NOTES ABOUT THIS BUILD
============

* Since Mac OS X does not ship with gettext, this build does not
  include gettext support. If popular demand requests (via the git
  issue tracker
  http://code.google.com/p/git-osx-installer/issues/list) the
  installer may bundle gettext in the future to provide localization
  support.

KNOWN ISSUES
============


Git GUI / gitk won't open - complain of missing Tcl / Tk Aqua libraries
-----------------------------------------------------------------------

If you don't already have Tcl/Tk Aqua installed on your computer (most
MacOS X installs have it), you will get this error message. To resolve
it, simply go to the website for Tcl / Tk Aqua and download the latest
version:

http://www.categorifiedcoder.info/tcltk/

If you have an older version of Tcl / Tk Aqua, you'll benefit from
upgrading.

More information:

http://code.google.com/p/git-osx-installer/issues/detail?id=41



Installer hangs during install (and I have iPhone developer tools installed)
----------------------------------------------------------------------------

The iPhone developer tools require some kind of gnarly system lock
that causes the MacOS X installer system to hang. Just quit the iPhone
SDK and try again.

More information:

http://code.google.com/p/git-osx-installer/issues/detail?id=35



"git-svn is missing"
--------------------
Mac OS X no longer ships with SVN, and this installer no longer ships
with git-svn support.

Complain about that here:

https://github.com/timcharper/git_osx_installer/issues

Handling of international characters in file is broken
------------------------------------------------------

If you would like some validation, read this: http://is.gd/5NAN9.
You're not alone.

This is not an issue with Git, not the installer. Apparently
subversion has it too.
