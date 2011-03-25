require File.expand_path(File.dirname(__FILE__) + "/../lib/ticgit")
require 'fileutils'
require 'logger'

module TicGitSpecHelper

  def setup_new_git_repo
    temp = Tempfile.new('ticgit')
    p = temp.path
    temp.unlink
    Dir.mkdir(p)
    Dir.chdir(p) do 
      g = Git.init
      new_file('test', 'content')
      Dir.mkdir('subdir')
      new_file('subdir/testfile', 'content2')
      g.add
      g.commit('first commit')
    end
    p
  end

  def setup_existing_ticgit_repo
  end

  def test_opts
    temp = Tempfile.new('ticdir')
    p = temp.path
    temp.unlink
    Dir.mkdir(p)
    logger = Logger.new(Tempfile.new('ticgit-log'))    
    { :tic_dir => p, :logger => logger }
  end


  def new_file(name, contents)
    File.open(name, 'w') do |f|
      f.puts contents
    end
  end

end

  

##
# rSpec Hash additions.
#
# From 
#   * http://wincent.com/knowledge-base/Fixtures_considered_harmful%3F
#   * Neil Rahilly

class Hash

  ##
  # Filter keys out of a Hash.
  #
  #   { :a => 1, :b => 2, :c => 3 }.except(:a)
  #   => { :b => 2, :c => 3 }

  def except(*keys)
    self.reject { |k,v| keys.include?(k || k.to_sym) }
  end

  ##
  # Override some keys.
  #
  #   { :a => 1, :b => 2, :c => 3 }.with(:a => 4)
  #   => { :a => 4, :b => 2, :c => 3 }
  
  def with(overrides = {})
    self.merge overrides
  end

  ##
  # Returns a Hash with only the pairs identified by +keys+.
  #
  #   { :a => 1, :b => 2, :c => 3 }.only(:a)
  #   => { :a => 1 }
  
  def only(*keys)
    self.reject { |k,v| !keys.include?(k || k.to_sym) }
  end

end
