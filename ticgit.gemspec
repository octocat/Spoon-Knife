Gem::Specification.new do |s|
    s.platform  =   Gem::Platform::RUBY
    s.name      =   "ticgit"
    s.version   =   "0.3.0"
    s.date      =   "2008-05-10"
    s.author    =   "Scott Chacon"
    s.email     =   "schacon@gmail.com"
    s.summary   =   "A distributed ticketing system for Git projects."
    s.files     =   FileList['lib/**/*', 'bin/*'].to_a

    s.bindir = 'bin'
    s.executables << "ti"
    s.executables << "ticgitweb"
    s.homepage = "http://github/schacon/ticgit"

    s.add_dependency('git', ["> 1.5"])

    s.require_path  =   "lib"
end
