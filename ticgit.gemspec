Gem::Specification.new do |s|
    s.platform  =   Gem::Platform::RUBY
    s.name      =   "ticgit"
    s.version   =   "0.3.6"
    s.date      =   "2008-05-10"
    s.author    =   "Scott Chacon"
    s.email     =   "schacon@gmail.com"
    s.summary   =   "A distributed ticketing system for Git projects."
    s.files     =   ["lib/ticgit/base.rb", "lib/ticgit/cli.rb", "lib/ticgit/comment.rb", "lib/ticgit/ticket.rb", "lib/ticgit.rb", "bin/ti", "bin/ticgitweb"]

    s.bindir = 'bin'
    s.executables = ["ti", "ticgitweb"]
    s.default_executable = %q{ti}
    s.homepage = "http://github/schacon/ticgit"

    s.require_paths = ["lib", "bin"]
    s.specification_version = 2 if s.respond_to? :specification_version=
end
