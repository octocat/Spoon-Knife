require 'logger'
require 'fileutils'

module TicGit
  class Base

    attr_reader :git, :logger
    attr_reader :tickets, :tic_working, :tic_index
    
    def initialize(git_dir, opts = {})
      @git = Git.open(git_dir)
      @logger = opts[:logger] || Logger.new(STDOUT)
      
      @tic_working = opts[:working_directory] || File.expand_path('~/.ticgit/working')
      @tic_index = opts[:index_file] || File.expand_path('~/.ticgit/index')
      
      load_ticgits
    end
    
    # returns new Ticket
    def ticket_new(title, options = {})
      TicGit::Ticket.create(self, title, options)
    end

    # returns array of Tickets 
    def ticket_list(options = {})
      ts = []
      @tickets.each do |name, t|
        ts << TicGit::Ticket.open(self, name, t)
      end
      ts
    end
    
    # returns single Ticket
    def ticket_show(ticket_id)
    end    
    
    # returns array of Tickets
    def ticket_find(search_array)
    end
    
    def ticket_change(ticket_id, new_state = 'open')
    end

    
    def comment_add(ticket_id, comment, options = {})
    end

    def comment_list(ticket_id)
    end
    
    
    def checkout(ticket)
    end
    
    def tic_states
      ['open', 'resolved', 'invalid', 'hold']
    end
        
    def load_ticgits
      @tickets = {}

      bs = git.lib.branches_all.map { |b| b[0] }
      init_ticgit_branch if !bs.include?('ticgit')
      tree = git.lib.full_tree('ticgit')
      tree.each do |t|
        data, file = t.split("\t")
        mode, type, sha = data.split(" ")
        tic = file.split('/')
        if tic.size == 3  # directory depth
          state, ticket, info = tic
          @tickets[ticket] ||= {'files' => [], 'state' => state}
          @tickets[ticket]['files'] << [info, sha]
        end
      end
    end
    
    def init_ticgit_branch
      puts 'creating ticgit repo branch'
      FileUtils.mkdir_p(@tic_working) if !File.directory?(@tic_working)
      
      in_branch do          
        new_file('.hold', 'hold')
        tic_states.each do |d|
          Dir.mkdir(d)
          new_file("#{d}/.hold", 'hold')
        end
        git.add
        git.commit('creating the ticgit branch')
      end
    end
    
    # temporarlily switches to ticgit branch for tic work
    def in_branch
      needs_checkout = false
      if !File.directory?(@tic_working)
        FileUtils.mkdir_p(@tic_working)
        needs_checkout = true
      end
      
      old_current = git.lib.branch_current
      git.lib.change_head_branch('ticgit')
      git.with_index(@tic_index) do          
        git.with_working(@tic_working) do |wd|
          git.lib.checkout('ticgit') if needs_checkout
          yield wd
        end
      end
      git.lib.change_head_branch(old_current)
    end
          
    def new_file(name, contents)
      File.open(name, 'w') do |f|
        f.puts contents
      end
    end
   
  end
end