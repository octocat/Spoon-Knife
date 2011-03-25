require File.dirname(__FILE__) + "/spec_helper"

describe TicGit do 
  include TicGitSpecHelper
  
  before(:all) do 
    @path = setup_new_git_repo
    @orig_test_opts = test_opts
    @ticgit = TicGit.open(@path, @orig_test_opts)
  end
  
  it "should create a new branch if it's not there" do
    br = @ticgit.git.branches.map { |b| b.name }
    br.should include('ticgit')
  end

  it "should find an existing ticgit branch if it's there" do
    tg = TicGit.open(@path, test_opts)
    @ticgit.git.branches.size.should eql(tg.git.branches.size)
  end

  it "should find the .git directory if it's there" do
    @ticgit.git.dir.path.should eql(@path)
  end

  it "should look for the .git directory until it finds it" do
    tg = TicGit.open(File.join(@path, 'subdir'), @orig_test_opts)
    tg.git.dir.path.should eql(@path)
  end
  
  it "should add a .hold file to a new branch"

end
