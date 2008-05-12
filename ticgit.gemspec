Gem::Specification.new do |s|
    s.platform  =   Gem::Platform::RUBY
    s.name      =   "ticgit"
    s.version   =   "0.3.2"
    s.date      =   "2008-05-10"
    s.author    =   "Scott Chacon"
    s.email     =   "schacon@gmail.com"
    s.summary   =   "A distributed ticketing system for Git projects."
    s.files     =   ["lib/ticgit/base.rb", "lib/ticgit/cli.rb", "lib/ticgit/comment.rb", "lib/ticgit/ticket.rb", "lib/ticgit.rb", "bin/ti", "bin/ticgitweb"]

    s.bindir = 'bin'
    s.executables << "ti"
    s.executables << "ticgitweb"
    s.homepage = "http://github/schacon/ticgit"

    s.add_dependency('git', [">= 1.0.5"])

    s.require_path  =   "lib"
end
