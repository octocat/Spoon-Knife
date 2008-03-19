module TicGit
  class Ticket
  
    attr_reader :base
    attr_accessor :ticket_id, :ticket_name
    attr_accessor :title, :milestone, :assigned, :comments, :tags, :attachments
    
    def initialize(base)
      @base = base
    end
  
    def self.create(base, title, options = {})
      t = Ticket.new(base)
      t.title = title
      t.ticket_name = self.create_ticket_name(title)
      t.save_new
      t
    end
    
    def self.open(base, ticket_id)
      t = Ticket.new(base)
      # load from git by ticket_id
      t
    end
    
    # write this ticket to the git database
    def save_new
      base.in_branch do |wd|
        puts "saving #{ticket_name}"
        
        puts `pwd`
        
        Dir.chdir('open') do
          Dir.mkdir(ticket_name)
          Dir.chdir(ticket_name) do
            base.new_file('TICKET_ID', ticket_name)
          end
        end
        base.git.add
        base.git.commit("added ticket #{ticket_name}")
      end
      # ticket_id
    end

    def self.create_ticket_name(title)
      [Time.now.to_i.to_s, title.downcase.gsub(/[^a-z0-9]+/i, '_'), rand(999).to_i.to_s].join('-')
    end

    
  end
end