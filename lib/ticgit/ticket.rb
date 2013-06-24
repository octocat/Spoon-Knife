module TicGit
  class Ticket
  
    attr_reader :base, :opts
    attr_accessor :ticket_id, :ticket_name
    attr_accessor :title, :state, :milestone, :assigned, :opened
    attr_accessor :comments, :tags, :attachments # arrays
    
    def initialize(base, options = {})
      options[:user_name] ||= base.git.config('user.name') 
      options[:user_email] ||= base.git.config('user.email')      
      
      @base = base
      @opts = options || {}
      
      @state = 'open' # by default
      @comments = []
      @tags = []
      @attachments = []
    end
  
    def self.create(base, title, options = {})
      t = Ticket.new(base, options)
      t.title = title
      t.ticket_name = self.create_ticket_name(title)
      t.save_new
      t
    end
    
    def self.open(base, ticket_name, ticket_hash, options = {})
      tid = nil

      t = Ticket.new(base, options)
      t.ticket_name = ticket_name
      
      title, date = self.parse_ticket_name(ticket_name)
      
      t.title = title
      t.opened = date
      
      ticket_hash['files'].each do |fname, value|
        if fname == 'TICKET_ID'
          tid = value
        else
          # matching
          data = fname.split('_')
          if data[0] == 'ASSIGNED'
            t.assigned = data[1]
          end
          if data[0] == 'ATTACHMENT'
            t.attachments << TicGit::Attachment.new(base,fname,value)
          end
          if data[0] == 'COMMENT'
            t.comments << TicGit::Comment.new(base, fname, value)
          end
          if data[0] == 'TAG'
            t.tags << data[1]
          end
          if data[0] == 'STATE'
            t.state = data[1]
          end          
        end
      end
      
      t.ticket_id = tid
      t
    end
    
    
    def self.parse_ticket_name(name)
      epoch, title, rand = name.split('_')
      title = title.gsub('-', ' ')
      return [title, Time.at(epoch.to_i)]
    end
    
    # write this ticket to the git database
    def save_new
      base.in_branch do |wd|
        base.logger.info "saving #{ticket_name}"
        
        Dir.mkdir(ticket_name)
        Dir.chdir(ticket_name) do
          base.new_file('TICKET_ID', ticket_name)
          base.new_file('ASSIGNED_' + email, email)
          base.new_file('STATE_' + state, state)

          # add initial comment
          #COMMENT_080315060503045__schacon_at_gmail
          base.new_file(comment_name(email), opts[:comment]) if opts[:comment]

          # add initial tags
          if opts[:tags] && opts[:tags].size > 0
            opts[:tags] = opts[:tags].map { |t| t.strip }.compact
            opts[:tags].each do |tag|
              if tag.size > 0
                tag_filename = 'TAG_' + Ticket.clean_string(tag)
                if !File.exists?(tag_filename)
                  base.new_file(tag_filename, tag_filename)
                end
              end
            end
          end            
        end
	      
        base.git.add
        base.git.commit("added ticket #{ticket_name}")
      end
      # ticket_id
    end
    
    def self.clean_string(string)
      string.downcase.gsub(/[^a-z0-9]+/i, '-')
    end
    
    def add_comment(comment)
      return false if !comment
      base.in_branch do |wd|
        Dir.chdir(ticket_name) do
          base.new_file(comment_name(email), comment) 
        end
        base.git.add
        base.git.commit("added comment to ticket #{ticket_name}")
      end
    end
    
    def add_attachment(file)  
      base.in_branch do |wd|
        Dir.chdir(ticket_name) do
          FileUtils.copy(file,attachment_name(email,File.basename(file)))
        end
        base.git.add
        base.git.commit("added attachment to ticket #{ticket_name}")
      end
    end

    def change_state(new_state)
      return false if !new_state
      return false if new_state == state
      
      base.in_branch do |wd|
        Dir.chdir(ticket_name) do
          base.new_file('STATE_' + new_state, new_state)
        end
        base.git.remove(File.join(ticket_name,'STATE_' + state))
        base.git.add
        base.git.commit("added state (#{new_state}) to ticket #{ticket_name}")
      end
    end

    def change_assigned(new_assigned)
      new_assigned ||= email
      return false if new_assigned == assigned

      base.in_branch do |wd|
        Dir.chdir(ticket_name) do
          base.new_file('ASSIGNED_' + new_assigned, new_assigned)
        end
        base.git.remove(File.join(ticket_name,'ASSIGNED_' + assigned))
        base.git.add
        base.git.commit("assigned #{new_assigned} to ticket #{ticket_name}")
      end
    end
    
    def add_tag(tag)
      return false if !tag
      added = false
      tags = tag.split(',').map { |t| t.strip }
      base.in_branch do |wd|
        Dir.chdir(ticket_name) do
          tags.each do |add_tag|
            if add_tag.size > 0
              tag_filename = 'TAG_' + Ticket.clean_string(add_tag)
              if !File.exists?(tag_filename)
                base.new_file(tag_filename, tag_filename)
                added = true
              end
            end
          end
        end
        if added
          base.git.add
          base.git.commit("added tags (#{tag}) to ticket #{ticket_name}")
        end
      end
    end
    
    def remove_tag(tag)
      return false if !tag
      removed = false
      tags = tag.split(',').map { |t| t.strip }
      base.in_branch do |wd|
        tags.each do |add_tag|
          tag_filename = File.join(ticket_name, 'TAG_' + Ticket.clean_string(add_tag))
          if File.exists?(tag_filename)
            base.git.remove(tag_filename)
            removed = true
          end
        end
        if removed
          base.git.commit("removed tags (#{tag}) from ticket #{ticket_name}")
        end
      end
    end
    
    def path
      File.join(state, ticket_name)
    end
    
    
    def attachment_name(email,filename)
      'ATTACHMENT_' + Time.now.to_i.to_s + '_' + email + "@@" + filename
    end
    def comment_name(email)
      'COMMENT_' + Time.now.to_i.to_s + '_' + email
    end
    
    
    def email
      opts[:user_email] || 'anon'
    end
    
    def assigned_name
      assigned.split('@').first rescue ''
    end
    
    def self.create_ticket_name(title)
      [Time.now.to_i.to_s, Ticket.clean_string(title), rand(999).to_i.to_s].join('_')
    end

    
  end
end
