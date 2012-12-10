OpenID Example Code
-------------------

After you've installed this package (see ../README), you can use these
example packages to get started.  They'll show you what this package
can do, and you can use them as the basis for your own OpenID support.

consumer/: OpenID Example Consumer
==================================

NOTE: If you want to try the example consumer without installing this
package, just make sure you add the package's 'Auth' directory to your
PHP include path.

To try the example consumer implementation, just copy the consumer/
directory into a place on your web server and point your browser at
the new directory.

1. Check to be sure that /tmp is in your "open_basedir" configuration,
   if open_basedir is being used to restrict PHP's file I/O.  See
   http://us2.php.net/features.safe-mode for more information.  For
   example, in your php.ini, change

   open_basedir = "..."

   to

   open_basedir = "/tmp:..."

   (If you really don't want to add /tmp to your open_basedir, you can
   modify consumer/common.php and change $store_path so it doesn't
   create the store directory in /tmp.)

2. Copy or symlink the consumer/ directory into a part of your
   webserver's docroot.  For example, if your DocumentRoot is
   /var/www/, do this:

   # cd /var/www
   # ln -s /path/to/PHP-OpenID-X.Y.Z/examples/consumer

3. Navigate to http://www.example.com/consumer and enter an OpenID
   into the form presented there and click "Verify".

consumer/ Files
===============

The 'index.php' file will render a form and get you started.  These
are the example consumer files:

  consumer/index.php - Renders a form so you can begin the OpenID auth
process.  The form submits the OpenID to try_auth.php.

  consumer/try_auth.php - Starts the authentication with the OpenID
server that manages your OpenID and redirects your browser to the
server's login page.  Instructs the server to return to
finish_auth.php when you're done authenticating.

  consumer/finish_auth.php - Finishes the authentication by checking
the server's response.  Tells you if the authentication was
successful.

  consumer/common.php - Includes the setup code you'll need to create
a Consumer object and participate in an OpenID authentication.

server/: OpenID Example Server
==============================

To try the example server, follow these steps:

1. Copy or symlink the server/ directory into a part of your
   webserver's docroot.  For example, if your DocumentRoot is
   /var/www/, do this:

   # cd /var/www
   # ln -s /path/to/PHP-OpenID-X.Y.Z/examples/server

2. Navigate to the server example.  You'll be redirected to
   server/setup.php where you can choose some configuration options to
   generate a configuration.  Once finished, you can download a file
   "config.php."  Save that file in the example server directory.

The example server has the following features:

 - It serves its own identity pages, whose URLs are of the form

   http://.../server/server.php/idpage?user=USERNAME

 - It does not require passwords.

 - It does not support a "trusted sites" page, as you pointed out.

In general, the example server is NOT supposed to be treated as a
fully-equiped OpenID server (i.e., with user accounts and other
state).  It is supposed to demonstrate how to write PHP applications
that use the library.

Upgrading from the 1.X.X example server
=======================================

The 2.X.X library's example server is different from the 1.X.X example
server in the following ways:

 - The new example server does not support authenticating arbitrary
   URLs.  It serves its own URLs.  This makes it easier to set up and
   test.

 - The new example server does not support password authentication.
   This makes it easier to set up and is not necessary for
   illustrating the use of the library.

 - The new example server does not have a "trusted sites" page.

server/ Files
=============

These files make up the server example code:

  config.php - The configuration file you'll need to customize to run
the example server.

  server.php - The PHP rendering script that takes care of handling
server requests from both regular user agents and consumers.

  lib/actions.php - Handles the various types of requests that the
server supports.

  lib/common.php - Supplies functions that wrap the OpenID API calls
to make them easier to use.

  lib/render.php - Miscellaneous page rendering code.

  lib/session.php - Code to handle session data for user settings.

  lib/render/*.php - Files for each page presented by the server.
