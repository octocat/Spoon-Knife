<?php

$path_extra = dirname(dirname(__FILE__));
$path = ini_get('include_path');
$path = $path_extra . PATH_SEPARATOR . $path;
ini_set('include_path', $path);

define('IS_WINDOWS', strtoupper(substr(PHP_OS, 0, 3)) === 'WIN');

class PlainText {
    function start($title)
    {
        return '';
    }

    function tt($text)
    {
        return $text;
    }

    function link($href, $text=null)
    {
        if ($text) {
            return $text . ' <' . $href . '>';
        } else {
            return $href;
        }
    }

    function b($text)
    {
        return '*' . $text . '*';
    }

    function contentType()
    {
        return 'text/plain';
    }

    function p($text)
    {
        return wordwrap($text) . "\n\n";
    }

    function pre($text)
    {
        $out = '';
        $lines = array_map('trim', explode("\n", $text));
        foreach ($lines as $line) {
            $out .= '    ' . $line . "\n";
        }
        $out .= "\n";
        return $out;
    }

    function ol($items)
    {
        $out = '';
        $c = 1;
        foreach ($items as $item) {
            $item = wordwrap($item, 72);
            $lines = array_map('trim', explode("\n", $item));
            $out .= $c . '. ' . $lines[0] . "\n";
            unset($lines[0]);
            foreach ($lines as $line) {
                $out .= '   ' . $line . "\n";
            }
            $out .= "\n";
            $c += 1;
        }
        return $out;
    }

    function h2($text)
    {
        return $this->h($text, 2);
    }

    function h1($text)
    {
        return $this->h($text, 1);
    }

    function h($text, $n)
    {
        $chars = '#=+-.';
        $c = $chars[$n - 1];
        return "\n" . $text . "\n" . str_repeat($c, strlen($text)) . "\n\n";
    }

    function end()
    {
        return '';
    }
}

class HTML {
    function start($title)
    {
        return '<html><head><title>' . $title . '</title>' .
            $this->stylesheet().
            '</head><body>' . "\n";
    }

    function stylesheet()
    {
        return "<style type='text/css'>\n".
            "p {\n".
            "  width: 50em;\n".
            "}\n".
            '</style>';
    }

    function tt($text)
    {
        return '<code>' . $text . '</code>';
    }

    function contentType()
    {
        return 'text/html';
    }

    function b($text)
    {
        return '<strong>' . $text . '</strong>';
    }

    function p($text)
    {
        return '<p>' . wordwrap($text) . "</p>\n";
    }

    function pre($text)
    {
        return '<pre>' . $text . "</pre>\n";
    }

    function ol($items)
    {
        $out = '<ol>';
        foreach ($items as $item) {
            $out .= '<li>' . wordwrap($item) . "</li>\n";
        }
        $out .= "</ol>\n";
        return $out;
    }

    function h($text, $n)
    {
        return "<h$n>$text</h$n>\n";
    }

    function h2($text)
    {
        return $this->h($text, 2);
    }

    function h1($text)
    {
        return $this->h($text, 1);
    }

    function link($href, $text=null)
    {
        return '<a href="' . $href . '">' . ($text ? $text : $href) . '</a>';
    }

    function end()
    {
        return "</body>\n</html>\n";
    }
}

if (isset($_SERVER['REQUEST_METHOD'])) {
    $r = new HTML();
} else {
    $r = new PlainText();
}

function detect_math($r, &$out)
{
    $out .= $r->h2('Math support');
    $ext = Auth_OpenID_detectMathLibrary(Auth_OpenID_math_extensions());
    if (!isset($ext['extension']) || !isset($ext['class'])) {
        $out .= $r->p(
            'Your PHP installation does not include big integer math ' .
            'support. This support is required if you wish to run a ' .
            'secure OpenID server without using SSL.');
        $out .= $r->p('To use this library, you have a few options:');

        $gmp_lnk = $r->link('http://www.php.net/manual/en/ref.gmp.php', 'GMP');
        $bc_lnk = $r->link('http://www.php.net/manual/en/ref.bc.php', 'bcmath');
        $out .= $r->ol(array(
            'Install the ' . $gmp_lnk . ' PHP extension',
            'Install the ' . $bc_lnk . ' PHP extension',
            'If your site is low-security, call ' .
            'Auth_OpenID_setNoMathSupport(), defined in Auth/OpenID/BigMath.php. ',
	    'The library will function, but ' .
            'the security of your OpenID server will depend on the ' .
            'security of the network links involved. If you are only ' .
            'using consumer support, you should still be able to operate ' .
            'securely when the users are communicating with a ' .
            'well-implemented server.'));
        return false;
    } else {
        switch ($ext['extension']) {
        case 'bcmath':
            $out .= $r->p('Your PHP installation has bcmath support. This is ' .
                  'adequate for small-scale use, but can be CPU-intensive. ' .
                  'You may want to look into installing the GMP extension.');
            $lnk = $r->link('http://www.php.net/manual/en/ref.gmp.php');
            $out .= $r->p('See ' . $lnk .' for more information ' .
                          'about the GMP extension.');
            break;
        case 'gmp':
            $out .= $r->p('Your PHP installation has gmp support. Good.');
            break;
        default:
            $class = $ext['class'];
            $lib = new $class();
            $one = $lib->init(1);
            $two = $lib->add($one, $one);
            $t = $lib->toString($two);
            $out .= $r->p('Uh-oh. I do not know about the ' .
                          $ext['extension'] . ' extension!');
            if ($t != '2') {
                $out .= $r->p('It looks like it is broken. 1 + 1 = ' .
                  var_export($t, false));
                return false;
            } else {
                $out .= $r->p('But it seems to be able to add one and one.');
            }
        }
        return true; // Math library is OK
    }
}

function detect_random($r, &$out)
{
    $out .= $r->h2('Cryptographic-quality randomness source');
    if (Auth_OpenID_RAND_SOURCE === null) {
        $out .= $r->p('Using (insecure) pseudorandom number source, because ' .
                      'Auth_OpenID_RAND_SOURCE has been defined as null.');
        return false;
    }

    $msg = 'The library will try to access ' . Auth_OpenID_RAND_SOURCE
        . ' as a source of random data. ';

    $numbytes = 6;

    $f = @fopen(Auth_OpenID_RAND_SOURCE, 'r');
    if ($f !== false) {
        $data = fread($f, $numbytes);
        $stat = fstat($f);
        $size = $stat['size'];
        fclose($f);
    } else {
        $data = null;
        $size = true;
    }

    if ($f !== false) {
        $dataok = (Auth_OpenID::bytes($data) == $numbytes);
        $ok = $dataok && !$size;
        $msg .= 'It seems to exist ';
        if ($dataok) {
            $msg .= 'and be readable. Here is some hex data: ' .
                bin2hex($data) . '.';
        } else {
            $msg .= 'but reading data failed.';
        }
        if ($size) {
            $msg .= ' This is a ' . $size . ' byte file. Unless you know ' .
                'what you are doing, it is likely that you are making a ' .
                'mistake by using a regular file as a randomness source.';
        }
    } else {
        $msg .= Auth_OpenID_RAND_SOURCE .
            ' could not be opened. This could be because of restrictions on' .
            ' your PHP environment or that randomness source may not exist' .
            ' on this platform.';
        if (IS_WINDOWS) {
            $msg .= ' You seem to be running Windows. This library does not' .
                ' have access to a good source of randomness on Windows.';
        }
        $ok = false;
    }

    $out .= $r->p($msg);

    if (!$ok) {
        $out .= $r->p(
            'To set a source of randomness, define Auth_OpenID_RAND_SOURCE ' .
            'to the path to the randomness source. If your platform does ' .
            'not provide a secure randomness source, the library can' .
            'operate in pseudorandom mode, but it is then vulnerable to ' .
            'theoretical attacks. If you wish to operate in pseudorandom ' .
            'mode, define Auth_OpenID_RAND_SOURCE to null.');
        $out .= $r->p('You are running on:');
        $out .= $r->pre(php_uname());
        $out .= $r->p('There does not seem to be an available source ' .
                      'of randomness. On a Unix-like platform ' .
                      '(including MacOS X), try /dev/random and ' .
                      '/dev/urandom.');
    }
    return $ok;
}

function detect_stores($r, &$out)
{
    $out .= $r->h2('Data storage');

    $found = array();
    foreach (array('sqlite', 'mysql', 'pgsql') as $dbext) {
        if (extension_loaded($dbext) || (function_exists('dl') && @dl($dbext . '.' . PHP_SHLIB_SUFFIX))) {
            $found[] = $dbext;
        }
    }
    if (count($found) == 0) {
        $text = 'No SQL database support was found in this PHP ' .
            'installation. See the PHP manual if you need to ' .
            'use an SQL database.';
    } else {
        $text = 'Support was found for ';
        if (count($found) == 1) {
            $text .= $found[0] . '.';
        } else {
            $last = array_pop($found);
            $text .= implode(', ', $found) . ' and ' . $last . '.';
        }
	$text = $r->b($text);
    }
    $text .= ' The library supports the MySQL, PostgreSQL, and SQLite ' .
        'database engines, as well as filesystem-based storage.  In ' .
        'addition, PEAR DB is required to use databases.';
    $out .= $r->p($text);

    if (function_exists('posix_getpwuid') &&
        function_exists('posix_geteuid')) {
        $processUser = posix_getpwuid(posix_geteuid());
        $web_user = $r->b($r->tt($processUser['name']));
    } else {
        $web_user = 'the PHP process';
    }

    if (in_array('sqlite', $found)) {
        $out .= $r->p('If you are using SQLite, your database must be ' .
                      'writable by ' . $web_user . ' and not available over' .
                      ' the web.');
    }

    $basedir_str = ini_get('open_basedir');
    if (gettype($basedir_str) == 'string') {
        $url = 'http://www.php.net/manual/en/features.safe-mode.php' .
            '#ini.open-basedir';
        $lnk = $r->link($url, 'open_basedir');
        $out .= $r->p('If you are using a filesystem-based store or SQLite, ' .
                      'be aware that ' . $lnk . ' is in effect. This means ' .
                      'that your data will have to be stored in one of the ' .
                      'following locations:');
        $out .= $r->pre(var_export($basedir_str, true));
    } else {
        $out .= $r->p('The ' . $r->b($r->tt('open_basedir')) . ' configuration restriction ' .
		      'is not in effect.');
    }

    $out .= $r->p('If you are using the filesystem store, your ' .
                  'data directory must be readable and writable by ' .
                  $web_user . ' and not available over the Web.');
    return true;
}

function detect_xml($r, &$out)
{
    global $__Auth_Yadis_xml_extensions;

    $out .= $r->h2('XML Support');

    // Try to get an XML extension.
    $ext = Auth_Yadis_getXMLParser();

    if ($ext !== null) {
        $out .= $r->p('XML parsing support is present using the '.
                      $r->b(get_class($ext)).' interface.');
        return true;
    } else {
        $out .= $r->p('XML parsing support is absent; please install one '.
                      'of the following PHP extensions:');
        foreach ($__Auth_Yadis_xml_extensions as $name => $cls) {
            $out .= "<li>" . $r->b($name) . "</li>";
        }
        return false;
    }
}

function detect_query_corruption($r, &$out)
{
    $out .= $r->h2('Query Corruption');
    if ($_SERVER["QUERY_STRING"]!="test_query=a%26b")
    {
        $out.=$r->p("Your web server seems to corrupt queries.  Received ".$_SERVER["QUERY_STRING"].", expected a=%26b. Check for mod_encoding.");
	    return false;
    }
    else
    {
        $out.=$r->p("Your web server does not corrupt queries.  Good.");
	    return true;
    }
}

function detect_fetcher($r, &$out)
{
    $out .= $r->h2('HTTP Fetching');

    $result = @include 'Auth/Yadis/Yadis.php';

    if (!$result) {
        $out .= $r->p('Yadis code unavailable; could not test fetcher support.');
	return false;
    }

    if (Auth_Yadis_Yadis::curlPresent()) {
        $out .= $r->p('This PHP installation has support for libcurl. Good.');
    } else {
        $out .= $r->p('This PHP installation does not have support for ' .
                      'libcurl. CURL is not required but is recommended. '.
                      'The OpenID library will use an fsockopen()-based fetcher.');
        $lnk = $r->link('http://us3.php.net/manual/en/ref.curl.php');
        $out .= $r->p('See ' . $lnk . ' about enabling the libcurl support ' .
                      'for PHP.');
    }

    $ok = true;
    $fetcher = Auth_Yadis_Yadis::getHTTPFetcher();
    $fetch_url = 'https://raw.github.com/gist/465630/c57eff55ebc0c54973903af5f72bac72762cf4f4/helloworld';
    $expected_url = $fetch_url;// . '.txt';
    $result = $fetcher->get($fetch_url);

    if (isset($result)) {
        $parts = array('An HTTP request was completed.');
        // list ($code, $url, $data) = $result;
        if ($result->status != '200' && $result->status != '206') {
            $ok = false;
            $parts[] = $r->b(
                sprintf(
                    'Got %s instead of the expected HTTP status ' .
                    'code (200 or 206).', $result->status));
        }

        $url = $result->final_url;
        if ($url != $expected_url) {
            $ok = false;
            if ($url == $fetch_url) {
                $msg = 'The redirected URL was not returned.';
            } else {
                $msg = 'An unexpected URL was returned: ' . $url . '.';
            }
            $parts[] = $r->b($msg);
        }

        $data = $result->body;
        if ($data != 'Hello World!') {
            $ok = false;
            $parts[] = $r->b('Unexpected data was returned.');
        }
        $out .= $r->p(implode(' ', $parts));
    } else {
        $ok = false;
        $out .= $r->p('Fetching URL ' . $lnk . ' failed!');
    }

    if ($fetcher->supportsSSL()) {
        $out .= $r->p('Your PHP installation appears to support SSL, so it ' .
                      'will be able to process HTTPS identity URLs and server URLs.');
    } else {
        $out .= $r->p('Your PHP installation does not support SSL, so it ' .
                      'will NOT be able to process HTTPS identity URLs and server URLs.');
    }

    return $ok;
}

header('Content-Type: ' . $r->contentType() . '; charset=us-ascii');
if (empty($_GET["test_query"]))
{
    header("Location: ".$_SERVER['PHP_SELF']."?test_query=a%26b");
}

    $title = 'OpenID Library Support Report';
$out = $r->start($title) .
    $r->h1($title) .
    $r->p('This script checks your PHP installation to determine if you ' .
          'are set up to use the JanRain PHP OpenID library.');

$body = '';

$_include = include 'Auth/OpenID.php';

if (!$_include) {
    $path = ini_get('include_path');
    $body .= $r->p(
        'Cannot find the OpenID library. It must be in your PHP include ' .
        'path. Your PHP include path is currently:');
    $body .= $r->pre($path);
} else {
    $status = array();

    $status[] = detect_math($r, $body);
    $status[] = detect_random($r, $body);
    $status[] = detect_stores($r, $body);
    $status[] = detect_fetcher($r, $body);
    $status[] = detect_xml($r, $body);

    if (isset($_SERVER['REQUEST_METHOD'])) {
        $status[] = detect_query_corruption($r, $body);
    }

    $result = true;

    foreach ($status as $v) {
        if (!$v) {
            $result = false;
            break;
        }
    }

    if ($result) {
        $out .= $r->h2('Setup Complete!');
	$out .= $r->p('Your system should be ready to run the OpenID library.');
    } else {
        $out .= $r->h2('Setup Incomplete');
	$out .= $r->p('Your system needs a few changes before it will be ready to run the OpenID library.');
    }
}

$out .= $body . $r->end();
print $out;
?>
