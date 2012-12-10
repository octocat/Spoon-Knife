
"""
This is the package.xml data needed for the PHP OpenID PEAR
package.xml file.  Use the 'packagexml.py' program to generate a
package.xml file for a release of this library.
"""

# This is a list of dicts describing the project leads.  This will be
# used to generate <lead> XML elements.
leads = [
    {'name': 'Jonathan Daugherty',
     'user': 'cygnus',
     'email': 'cygnus@janrain.com',
     'active': 'yes'},
    {'name': 'Josh Hoyt',
     'user': 'jhoyt',
     'email': 'josh@janrain.com',
     'active': 'yes'}
    ]

# The package name.
package_name = 'Auth_OpenID'

# The package description.
package_description = 'An implementation of the OpenID single sign-on authentication protocol.'

# Package summary.
package_summary = 'PHP OpenID'

# License string.
license_name = 'Apache'

# License URI.
license_uri = 'http://www.apache.org/licenses/LICENSE-2.0'

# Director(ies) containing package source, relative to the admin/
# directory.  All .php files in these directories will be included in
# the <contents> element of the output XML and will be assigned the
# role 'php'.
contents_dirs = ['../Auth',]

# Director(ies) containing package documentation.  All files and
# subdirectories in these directories will be included in the
# <contents> element in the output XML and will be assigned the role
# 'doc'.
docs_dirs = ['../doc', '../examples']

# The HTTP package base URI.  This is the place on the web where the
# PEAR-installable tarballs will live, and this (plus the package
# tarball name) will be the URL that users pass to "pear install".
package_base_uri = 'http://www.openidenabled.com/resources/downloads/php-openid/pear/'

# The release stability.  Maybe this should be a commandline parameter
# since it might differ from release to release.
release_stability = 'stable'
