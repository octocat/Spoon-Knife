# Add the directory containing this file to the start of the load path if it
# isn't there already.
$:.unshift(File.dirname(__FILE__)) unless
  $:.include?(File.dirname(__FILE__)) || $:.include?(File.expand_path(File.dirname(__FILE__)))

require 'rubygems'
# requires git >= 1.0.5
require 'git'
require 'ticgit/base'
require 'ticgit/ticket'
require 'ticgit/comment'
require 'ticgit/attachment'
require 'ticgit/cli'

# TicGit Library
#
# This library implements a git based ticketing system in a git repo
#
# Author::    Scott Chacon (mailto:schacon@gmail.com)
# License::   MIT License
#
module TicGit  
  # options
  #   :logger => Logger.new(STDOUT)
  def self.open(git_dir, options = {})
    Base.new(git_dir, options)
  end
end
