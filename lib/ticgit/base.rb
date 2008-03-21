require 'logger'
require 'fileutils'

module TicGit
  class Base

    attr_reader :git, :logger
    attr_reader :tic_working, :tic_index
    attr_reader :tickets, :last_tickets, :current_ticket  # saved in state
    attr_reader :state
    
    def initialize(git_dir, opts = {})
      @git = Git.open(git_dir)
      @logger = opts[:logger] || Logger.new(STDOUT)
      
      @tic_dir = opts[:tic_dir] || '~/.ticgit'
      @tic_working = opts[:working_directory] || File.expand_path(File.join(@tic_dir, 'working'))
      @tic_index = opts[:index_file] || File.expand_path(File.join(@tic_dir, 'index'))
      
      @state = File.expand_path(File.join(@tic_dir, 'state'))
      
      if File.exists?(@state)
        load_state
      else
        reset_ticgit
      end
    end
    
    def save_state
      # marshal dump the internals
      File.open(@state, 'w') { |f| Marshal.dump([@tickets, @last_tickets, @current_ticket], f) }
    end
    
    def load_state
      # read in the internals
      if(File.exists?(@state))
        @tickets, @last_tickets, @current_ticket = File.open(@state) { |f| Marshal.load(f) }
      end      
    end
    
    # returns new Ticket
    def ticket_new(title, options = {})
      t = TicGit::Ticket.create(self, title, options)
      @current_ticket = t.ticket_name
      reset_ticgit
      TicGit::Ticket.open(self, t.ticket_name, @tickets[t.ticket_name])
    end

    def reset_ticgit
      load_tickets
      save_state
    end
    
    # returns new Ticket
    def ticket_comment(comment, ticket_id = nil)
      if t = ticket_revparse(ticket_id)        
        ticket = TicGit::Ticket.open(self, t, @tickets[t])
        ticket.add_comment(comment)
        reset_ticgit
      end
    end
    
    # returns array of Tickets 
    def ticket_list(options = {})
      ts = []
      @last_tickets = []
      
      tix = @tickets.to_a.sort
      tix.each do |name, t|
        ts << TicGit::Ticket.open(self, name, t)
        @last_tickets << name
      end
      save_state
      ts
    end
    
    # returns single Ticket
    def ticket_show(ticket_id = nil)      
      # ticket_id can be index of last_tickets, partial sha or nil => last ticket
      if t = ticket_revparse(ticket_id)
        return TicGit::Ticket.open(self, t, @tickets[t])
      end
    end
    
    def ticket_revparse(ticket_id)
      if ticket_id
        if t = @last_tickets[ticket_id.to_i - 1]
          return t
        else
          # !! TODO: check for (partial) sha in @tickets
        end
      elsif(@current_ticket)
        return @current_ticket
      end
    end    
    
    # returns array of Tickets
    def ticket_find(search_array)
    end

    def ticket_tag(tag, ticket_id = nil, options = {})
      if t = ticket_revparse(ticket_id)    
        ticket = TicGit::Ticket.open(self, t, @tickets[t])
        if options[:remove]
          ticket.remove_tag(tag)
        else
          ticket.add_tag(tag)
        end
        reset_ticgit
      end
    end
        
    def ticket_change(new_state, ticket_id = nil)
      if t = ticket_revparse(ticket_id)
        ticket = TicGit::Ticket.open(self, t, @tickets[t])
        in_branch do 
          file1 = ticket.path
          file2 = File.join(new_state, ticket.ticket_name)
          if file1 != file2
            git.lib.mv(file1, file2)
            git.commit('changed the state of ' + ticket.ticket_name + ' to ' + new_state)
            reset_ticgit
          end
        end
      end
    end
    
    def ticket_checkout(ticket_id)
      if t = ticket_revparse(ticket_id)
        ticket = TicGit::Ticket.open(self, t, @tickets[t])
        @current_ticket = ticket.ticket_name
        save_state
      end
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
        
    def load_tickets
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
      begin
        git.lib.change_head_branch('ticgit')
        git.with_index(@tic_index) do          
          git.with_working(@tic_working) do |wd|
            git.lib.checkout('ticgit') if needs_checkout
            yield wd
          end
        end
      ensure
        git.lib.change_head_branch(old_current)
      end
    end
          
    def new_file(name, contents)
      File.open(name, 'w') do |f|
        f.puts contents
      end
    end
   
  end
end