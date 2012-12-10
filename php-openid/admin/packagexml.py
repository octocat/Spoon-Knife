#!/usr/bin/python

import os
import os.path

def makeMaintainerXML(leads):
    maintainer_template = """
  <maintainer>
   <user>%(user)s</user>
   <name>%(name)s</name>
   <email>%(email)s</email>
   <role>lead</role>
  </maintainer>
  """

    return "<maintainers>" + \
           "".join([maintainer_template % l for l in leads]) + \
           "</maintainers>"

def makeLeadXML(leads):
    lead_template = """
<lead>
  <name>%(name)s</name>
  <user>%(user)s</user>
  <email>%(email)s</email>
  <active>%(active)s</active>
</lead>
    """

    return "".join([lead_template % l for l in leads])

INDENT_STRING = "  "

def buildContentsXMLFordir(dir_or_file, roles, depth=0, dir_role=None,
                           all_files=False):
    """
    Returns a list of strings, each of which is either a <file> XML
    element for the given file or a <dir> element which contains other
    <file> elements.
    """

    try:
        entries = os.listdir(dir_or_file)
        dir_role_s = ''
        if dir_role:
            dir_role_s = ' role="%s"' % (dir_role)
        lines = ['%s<dir name="%s"%s>' % (INDENT_STRING * depth,
                                          os.path.basename(dir_or_file),
                                          dir_role_s)]

        for entry in entries:
            lines += buildContentsXMLFordir(dir_or_file + os.sep + entry, roles,
                                            depth + 1, dir_role, all_files)

        lines.append('%s</dir>' % (INDENT_STRING * depth))

        return lines
    except OSError:
        try:
            extension = dir_or_file.split(".")[-1]
        except:
            if not all_files:
                return []

        if all_files and dir_role:
            return ['%s<file name="%s" role="%s" />' %
                    (INDENT_STRING * depth, os.path.basename(dir_or_file), dir_role)]
        elif extension in roles: # Ends in an extension we care about
            return ['%s<file name="%s" role="%s" />' %
                    (INDENT_STRING * depth, os.path.basename(dir_or_file),
                     roles[extension])]
        else:
            return []

def buildContentsXML(roles, *dirs):
    lines = []

    for directory in dirs:
        lines.append("\n".join(buildContentsXMLFordir(directory, roles, 1)))

    return "\n".join(lines)

def buildDocsXML(*dirs):
    lines = []

    for directory in dirs:
        lines.append("\n".join(buildContentsXMLFordir(directory, {}, 1, 'doc',
                                                      all_files=True)))

    return "\n".join(lines)

if __name__ == "__main__":
    def usage(progname):
        print "Usage: %s <package version> <xml template file> <release notes file>" % (progname)

    import sys
    import time

    try:
        import xmlconfig
    except:
        print "Could not import XML configuration module xmlconfig"
        sys.exit(1)

    # Expect sys.argv[2] to be the name of the XML file template to
    # use for processing.
    try:
        template_f = open(sys.argv[2], 'r')
    except Exception, e:
        usage(sys.argv[0])
        print "Could not open template file:", str(e)
        sys.exit(1)

    # Expect sys.argv[1] to be the version number to include in the
    # package.xml file.
    try:
        version = sys.argv[1]
    except:
        usage(sys.argv[0])
        sys.exit(2)

    # Expect sys.argv[3] to be the name of the release notes file.
    try:
        release_file = sys.argv[3]
        release_file_h = open(release_file, 'r')
        release_notes = release_file_h.read().strip()
        release_file_h.close()
    except Exception, e:
        usage(sys.argv[0])
        print str(e)
        sys.exit(3)

    data = xmlconfig.__dict__.copy()

    contentsXml = buildContentsXML({'php': 'php'}, *xmlconfig.contents_dirs)
    docsXml = buildDocsXML(*xmlconfig.docs_dirs)

    contents = '<dir name="/">\n' + contentsXml + \
               "\n" + docsXml + '\n  </dir>'

    contents_v1 = '<filelist><dir name="/" baseinstalldir="Auth">\n' + contentsXml + \
                  "\n" + docsXml + '\n  </dir></filelist>'

    data['contents'] = contents
    data['contents_version_1'] = contents_v1
    data['leads'] = makeLeadXML(xmlconfig.leads)
    data['maintainers'] = makeMaintainerXML(xmlconfig.leads)
    data['date'] = time.strftime("%Y-%m-%d")
    data['version'] = version
    data['uri'] = "%s%s-%s.tgz" % (data['package_base_uri'], data['package_name'],
                                   version)
    data['release_notes'] = release_notes

    template_data = template_f.read()
    print template_data % data
