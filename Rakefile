require 'rubygems'
Gem::manage_gems
require 'rake/gempackagetask'
require 'spec/rake/spectask'

spec = Gem::Specification.new do |s|
    s.platform  =   Gem::Platform::RUBY
    s.name      =   "ticgit"
    s.version   =   "0.2.0"
    s.author    =   "Scott Chacon"
    s.email     =   "schacon@gmail.com"
    s.summary   =   "A distributed ticketing system for Git projects."
    s.files     =   FileList['lib/**/*', 'bin/*'].to_a

    s.bindir = 'bin'
    s.executables << "ti"
    s.homepage = "http://github/schacon/ticgit"

    s.add_dependency 'git'

    s.require_path  =   "lib"
end

Rake::GemPackageTask.new(spec) do |pkg|
    pkg.need_tar = true
end

desc "Run all specs in spec directory"
Spec::Rake::SpecTask.new(:spec) do |t|
  t.spec_files = FileList['spec/**/*_spec.rb']
  t.spec_opts = ['--color']
end

namespace :spec do

  desc "Run rcov on the spec files"
  Spec::Rake::SpecTask.new(:coverage) do |t|
    t.spec_files = FileList['spec/**/*_spec.rb']
    t.spec_opts = ['--color']
    t.rcov = true
    t.rcov_opts = ['--exclude', 'spec\/spec,bin\/spec,examples,\/var\/lib\/gems,\/Library\/Ruby,\.autotest']
  end

end

desc "Clean out the coverage and pkg directories"
task :clean do
  rm_rf 'coverage'
  rm_rf 'pkg'
end

task :default => "pkg/#{spec.name}-#{spec.version}.gem" do
    puts "generated latest version"
end
