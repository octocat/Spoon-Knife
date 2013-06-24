require 'logger'
require 'fileutils'
require 'yaml'

module TicGit
  class NoRepoFound < StandardError;end
  class Base

    attr_reader :git, :logger
    attr_reader :tic_working, :tic_index
    attr_reader :tickets, :last_tickets, :current_ticket  # saved in state
    attr_reader :config
    attr_reader :state, :config_file
    
    def initialize(git_dir, opts = {})
      @git = Git.open(find_repo(git_dir))
      @logger = opts[:logger] || Logger.new(STDOUT)
      
      proj = Ticket.clean_string(@git.dir.path)
      
      @tic_dir = opts[:tic_dir] || '~/.ticgit'
      @tic_working = opts[:working_directory] || File.expand_path(File.join(@tic_dir, proj, 'working'))
      @tic_index = opts[:index_file] || File.expand_path(File.join(@tic_dir, proj, 'index'))

      # load config file
      @config_file = File.expand_path(File.join(@tic_dir, proj, 'config.yml'))
      if File.exists?(config_file)
        @config = YAML.load(File.read(config_file))
      else
        @config = {}
      end
      
      @state = File.expand_path(File.join(@tic_dir, proj, 'state'))
      
      if File.exists?(@state)
        load_state
      else
        reset_ticgit
      end
    end
    
    def find_repo(dir)
      full = File.expand_path(dir)
      ENV["GIT_WORKING_DIR"] || loop do
        return full if File.directory?(File.join(full, ".git"))
        raise NoRepoFound if full == full=File.dirname(full)
      end
    end
    
    def save_state
      # marshal dump the internals
      File.open(@state, 'w') { |f| Marshal.dump([@tickets, @last_tickets, @current_ticket], f) } rescue nil
      # save config file
      File.open(@config_file, 'w') { |f| f.write(config.to_yaml) }
    end
    
    def load_state
      # read in the internals
      if(File.exists?(@state))
        @tickets, @last_tickets, @current_ticket = File.open(@state) { |f| Marshal.load(f) } rescue nil
      end      
    end
    
    # returns new Ticket
    def ticket_new(title, options = {})
      t = TicGit::Ticket.create(self, title, options)
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
      @config['list_options'] ||= {}
      
      @tickets.to_a.each do |name, t|
        ts << TicGit::Ticket.open(self, name, t)
      end

      if name = options[:saved]
         if c = config['list_options'][name]
           options = c.merge(options)
         end
      end   
      
      if options[:list]
        # TODO : this is a hack and i need to fix it
        config['list_options'].each do |name, opts|
          puts name + "\t" + opts.inspect
        end
        return false
      end   

      # SORTING
      if field = options[:order]
        field, type = field.split('.')
        case field
        when 'assigned'
          ts = ts.sort { |a, b| a.assigned <=> b.assigned }
        when 'state'
          ts = ts.sort { |a, b| a.state <=> b.state }
        when 'date'
          ts = ts.sort { |a, b| a.opened <=> b.opened }
        end    
        ts = ts.reverse if type == 'desc'
      else
        # default list
        ts = ts.sort { |a, b| a.opened <=> b.opened }
      end

      if options.size == 0
        # default list
        options[:state] = 'open'
      end
      
      # :tag, :state, :assigned
      if t = options[:tag]
        ts = ts.select { |tag| tag.tags.include?(t) }
      end
      if s = options[:state]
        ts = ts.select { |tag| tag.state =~ /#{s}/ }
      end
      if a = options[:assigned]
        ts = ts.select { |tag| tag.assigned =~ /#{a}/ }
      end
      
      if save = options[:save]
        options.delete(:save)
        @config['list_options'][save] = options
      end
      
      @last_tickets = ts.map { |t| t.ticket_name }
      # :save

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
    
    # returns recent ticgit activity
    # uses the git logs for this
    def ticket_recent(ticket_id = nil)      
      if ticket_id
        t = ticket_revparse(ticket_id) 
        return git.log.object('ticgit').path(t)
      else 
        return git.log.object('ticgit')
      end
    end
    
    def ticket_revparse(ticket_id)
      if ticket_id
        if /^[0-9]*$/ =~ ticket_id
          if t = @last_tickets[ticket_id.to_i - 1]
            return t
          end
        else
          # partial or full sha
          if ch = @tickets.select { |name, t| t['files'].assoc('TICKET_ID')[1] =~ /^#{ticket_id}/ }
            return ch.first[0]
          end
        end
      elsif(@current_ticket)
        return @current_ticket
      end
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
        if tic_states.include?(new_state)
          ticket = TicGit::Ticket.open(self, t, @tickets[t])
          ticket.change_state(new_state)
          reset_ticgit
        end
      end
    end

    def ticket_assign(new_assigned = nil, ticket_id = nil)
      if t = ticket_revparse(ticket_id)
        ticket = TicGit::Ticket.open(self, t, @tickets[t])
        ticket.change_assigned(new_assigned)
        reset_ticgit
      end
    end
    
    def ticket_attach(file, ticket_id = nil)
      if t = ticket_revparse(ticket_id)
        ticket = TicGit::Ticket.open(self, t, @tickets[t])
        ticket.add_attachment(file)
        reset_ticgit
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
        
    def tic_states
      ['open', 'resolved', 'invalid', 'hold']
    end
        
    def load_tickets
      @tickets = {}

      bs = git.lib.branches_all.map { |b| b[0] }
      init_ticgit_branch(bs.include?('ticgit')) if !(bs.include?('ticgit') && File.directory?(@tic_working))
      
      tree = git.lib.full_tree('ticgit')
      tree.each do |t|
        data, file = t.split("\t")
        mode, type, sha = data.split(" ")
        tic = file.split('/')
        if tic.size == 2  # directory depth
          ticket, info = tic
          @tickets[ticket] ||= { 'files' => [] }
          @tickets[ticket]['files'] << [info, sha]
        end
      end
    end
    
    def init_ticgit_branch(ticgit_branch = false)
      @logger.info 'creating ticgit repo branch'
      
      in_branch(ticgit_branch) do          
        new_file('.hold', 'hold')
        if !ticgit_branch
          git.add
          git.commit('creating the ticgit branch')
        end
      end
    end
    
    # temporarlily switches to ticgit branch for tic work
    def in_branch(branch_exists = true)
      needs_checkout = false
      if !File.directory?(@tic_working)
        FileUtils.mkdir_p(@tic_working)
        needs_checkout = true
      end
      if !File.exists?('.hold')
        needs_checkout = true
      end
      
      old_current = git.lib.branch_current
      begin
        git.lib.change_head_branch('ticgit')
        git.with_index(@tic_index) do          
          git.with_working(@tic_working) do |wd|
            git.lib.checkout('ticgit') if needs_checkout && branch_exists
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
