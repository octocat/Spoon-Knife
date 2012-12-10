
PHP OpenID
----------

This is the PHP OpenID library by JanRain, Inc.  You can visit our
website for more information about this package and other OpenID
implementations and tools:

  http://www.openidenabled.com/

GETTING STARTED
===============

First, run the 'examples/detect.php' script either from the command
line or via the web.  It will generate a report of any system
configuration changes necessary to run the library.

INSTALLATION
============

You will need PHP 4.3.0 or greater to use this library.  We have
tested the library Linux on PHP 4.3.0, 4.4.1, 5.0.5, and 5.1.1.  We
have tested the library on Windows XP on PHP 4.4.4.

Follow these steps:

1. Install dependencies.

   - Enable either the GMP extension or Bcmath extension. (GMP is
     STRONGLY recommended because it's MUCH faster!)  This is
     required.

   - Enable the CURL extension.

   - If you plan to use SQLite, PostgreSQL, or MySQL to store OpenID
     data, you'll need PEAR DB.  You can install this by running this
     as root:

     # pear install DB

     You'll also need to install and enable the appropriate PHP
     database extension.  Alternatively, you can store OpenID data on
     the filesystem instead of using a relational database.  Nothing
     special is required for using the filesystem method.

   - Install either the DOM or domxml PHP XML processing extension,
     but not both (they are incompatible).

2. Copy the Auth/ directory into your PHP include path.

TESTING YOUR SETUP
==================

You can use the example code to test your setup.  To run the example
consumer or server, follow the instructions in the examples/README
file.

USING THE API
=============

The best way to get started using the API is to take a look at the
example consumer and server in the examples/ directory.  See the
examples/README file for more details.

TROUBLESHOOTING
===============

* If you're unable to use an OpenID URL with the library, you may want
to try using the discover tool (examples/discover.php).  This tool
will perform OpenID discovery on the identifier and give a list of
discovered OpenID services and their types.

* On some systems, PHP basedir restrictions prevent web servers from
opening a source of randomness, such as /dev/urandom.  If your PHP
OpenID library has trouble getting a satisfactory source of
randomness, check your Apache and PHP configurations to be sure that
the randomness source is in the list of allowed paths for the
"open_basedir" option.

* In some cases, bugs in the GMP math library will result in signature
validation errors when using this library.  Since GMP is preferred
over bcmath (for performance), you will have to define
Auth_OpenID_BUGGY_GMP in your application *before* importing any of
the library code:

  define('Auth_OpenID_BUGGY_GMP', true);

* Not all PHP installations support SSL.  You can find out if yours
supports SSL by reading the "HTTP Fetching" section of the output of
"examples/detect.php."  If your installation does not support SSL,
then https:// identity URLs and server URLs will not be supported by
the library.  An attempt to use such an identity URL will be
equivalent to using an invalid OpenID.  To enable SSL support,
recompile PHP with OpenSSL support or install the appropriate OpenSSL
module for your platform.  If you are using CURL, CURL will need to be
built with OpenSSL support.

GETTING HELP
============

If you have any questions, recommendations, or patches, please tell
us!  Subscribe to our OpenID development discussion list at

  http://openid.net/developers/dev-mailing-lists/

DOCUMENTATION
=============

You can view the HTML library documentation in the doc/ directory.

This package's documentation is in PhpDoc format.  To generate the
documentation, install phpdoc and run the admin/makedoc.sh script.
Phpdoc lives at:

  http://www.phpdoc.org/

CONTRIBUTING
============

If you have a bugfix or feature you'd like to contribute, don't
hesitate to send it to us.  Post your patch to the development list at

  http://openid.net/developers/dev-mailing-lists/

For more detailed information on how to contribute, see

  http://openidenabled.com/contribute/

To run the test suite included with this package, install PHPUnit 1.x
and run

  php admin/texttest.php

PHPUnit 1.x can be found at

  http://pear.phpunit.de/get/
