require 'rubygems'
Gem::manage_gems
require 'rake/gempackagetask'

spec = Gem::Specification.new do |s|
    s.platform  =   Gem::Platform::RUBY
    s.name      =   "ticgit"
    s.version   =   "0.1.0"
    s.author    =   "Scott Chacon"
    s.email     =   "schacon@gmail.com"
    s.summary   =   "A distributed ticketing system for Git projects."
    s.files     =   FileList['lib/**/*', 'bin/*'].to_a
    s.require_path  =   "lib"
end

Rake::GemPackageTask.new(spec) do |pkg|
    pkg.need_tar = true
end

task :default => "pkg/#{spec.name}-#{spec.version}.gem" do
    puts "generated latest version"
end

