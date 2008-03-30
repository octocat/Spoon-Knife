require File.dirname(__FILE__) + "/spec_helper"

describe TicGit::CLI do 
  include TicGitSpecHelper
  
  before(:all) do 
    @path = setup_new_git_repo
    @orig_test_opts = test_opts
    @ticgit = TicGit.open(@path, @orig_test_opts)
  end

  it "should list the tickets"

  it "should show a ticket"
    
end
