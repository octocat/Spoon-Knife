require 'logger'
require 'fileutils'

module TicGit
  class Base

    attr_reader :git, :logger
    
    def initialize(git_dir, opts = {})
      @git = Git.open(git_dir)
      @logger = Logger.new(STDOUT) || opts[:logger]
      load_ticgits
    end
    
    # returns new Ticket
    def ticket_new(title, options = {})
      t = TicGit::Ticket.create(self, title, options)
    end

    # returns array of Tickets 
    def ticket_list(options = {})
      @git.ls_files
    end
    
    # returns single Ticket
    def ticket_show(ticket_id)
    end    
    
    # returns array of Tickets
    def ticket_find(search_array)
    end
    
    
    def comment_add(ticket_id, comment, options = {})
    end

    def comment_list(ticket_id)
    end
    
    
    def checkout(ticket)
    end
    
    def load_ticgits
      bs = git.lib.branches_all.map { |b| b[0] }
      
      if !bs.include?('ticgit')
        old_current = git.lib.branch_current
        puts 'no branch'

        git.lib.new_clean_branch('ticgit')
        git.with_temp_index do          
          git.with_temp_working do |wd|
            new_file('.hold', 'hold')
            ['open', 'resolved', 'invalid', 'hold'].each do |d|
              Dir.mkdir(d)
              new_file("#{d}/.hold", 'hold')
            end
            git.add
            git.commit('creating the branch')
          end
        end
        git.checkout(old_current)
      end
    end
    
    def in_branch
      old_current = git.lib.branch_current
      git.with_temp_working do |wd|
        git.checkout('ticgit')
        yield wd
        git.checkout(old_current)
      end
    end
          
    def new_file(name, contents)
      File.open(name, 'w') do |f|
        f.puts contents
      end
    end
   
  end
end