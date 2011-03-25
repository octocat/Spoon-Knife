require 'ticgit'
require 'optparse'

# used Cap as a model for this - thanks Jamis

module TicGit
  class CLI
    # The array of (unparsed) command-line options
    attr_reader :action, :options, :args, :tic

    def self.execute
      parse(ARGV).execute!
    end
    
    def self.parse(args)
      cli = new(args)
      cli.parse_options!
      cli
    end

    def initialize(args)
      @args = args.dup
      @tic = TicGit.open('.', :keep_state => true)
      $stdout.sync = true # so that Net::SSH prompts show up
    rescue NoRepoFound
      puts "No repo found"
      exit
    end    
    
    def execute!
      case action
      when 'list':
        handle_ticket_list
      when 'state'
        handle_ticket_state
      when 'attach'
        handle_ticket_attach      
      when 'assign'
        handle_ticket_assign
      when 'show'
        handle_ticket_show
      when 'new'
        handle_ticket_new
      when 'checkout', 'co'
        handle_ticket_checkout
      when 'comment'
        handle_ticket_comment
      when 'tag'
        handle_ticket_tag
      when 'recent'
        handle_ticket_recent
      when 'milestone'
        handle_ticket_milestone
      else
        puts 'not a command'
      end
    end

    # tic milestone
    # tic milestone migration1 (list tickets)
    # tic milestone -n migration1 3/4/08 (new milestone)
    # tic milestone -a {1} (add ticket to milestone)
    # tic milestone -d migration1 (delete)
    def parse_ticket_milestone
      @options = {}
      OptionParser.new do |opts|
        opts.banner = "Usage: ti milestone [milestone_name] [options] [date]"
        opts.on("-n MILESTONE", "--new MILESTONE", "Add a new milestone to this project") do |v|
          @options[:new] = v
        end
        opts.on("-a TICKET", "--new TICKET", "Add a ticket to this milestone") do |v|
          @options[:add] = v
        end
        opts.on("-d MILESTONE", "--delete MILESTONE", "Remove a milestone") do |v|
          @options[:remove] = v
        end
      end.parse!
    end

    def handle_ticket_recent
      tic.ticket_recent(ARGV[1]).each do |commit|
        puts commit.sha[0, 7] + "  " + commit.date.strftime("%m/%d %H:%M") + "\t" + commit.message
      end
    end
    
    def parse_ticket_tag
      @options = {}
      OptionParser.new do |opts|
        opts.banner = "Usage: ti tag [tic_id] [options] [tag_name] "
        opts.on("-d", "Remove this tag from the ticket") do |v|
          @options[:remove] = v
        end
      end.parse!
    end
    
    def handle_ticket_tag
      parse_ticket_tag
      
      if options[:remove]
        puts 'remove'
      end
      
      tid = nil
      if ARGV.size > 2
        tid = ARGV[1].chomp
        tic.ticket_tag(ARGV[2].chomp, tid, options)
      elsif ARGV.size > 1
        tic.ticket_tag(ARGV[1], nil, options)
      else  
        puts 'You need to at least specify one tag to add'
      end
    end
    
    def parse_ticket_comment
      @options = {}
      OptionParser.new do |opts|
        opts.banner = "Usage: ti comment [tic_id] [options]"
        opts.on("-m MESSAGE", "--message MESSAGE", "Message you would like to add as a comment") do |v|
          @options[:message] = v
        end
        opts.on("-f FILE", "--file FILE", "A file that contains the comment you would like to add") do |v|
          raise ArgumentError, "Only 1 of -f/--file and -m/--message can be specified" if @options[:message]
          raise ArgumentError, "File #{v} doesn't exist" unless File.file?(v) 
          raise ArgumentError, "File #{v} must be <= 2048 bytes" unless File.size(v) <= 2048
          @options[:file] = v
        end
      end.parse!
    end

    def handle_ticket_comment
      parse_ticket_comment
      
      tid = nil
      tid = ARGV[1].chomp if ARGV[1]
      
      if(m = options[:message])
        tic.ticket_comment(m, tid)
      elsif(f = options[:file])
        tic.ticket_comment(File.read(options[:file]), tid)
      else
        if message = get_editor_message
          tic.ticket_comment(message.join(''), tid)
        end
      end
    end

    
    def handle_ticket_checkout
      tid = ARGV[1].chomp
      tic.ticket_checkout(tid)
    end
    
    def handle_ticket_state
      if ARGV.size > 2
        tid = ARGV[1].chomp
        new_state = ARGV[2].chomp
        if valid_state(new_state)
          tic.ticket_change(new_state, tid)
        else
          puts 'Invalid State - please choose from : ' + tic.tic_states.join(", ")
        end
      elsif ARGV.size > 1
        # new state
        new_state = ARGV[1].chomp
        if valid_state(new_state)
          tic.ticket_change(new_state)
        else
          puts 'Invalid State - please choose from : ' + tic.tic_states.join(", ")
        end
      else  
        puts 'You need to at least specify a new state for the current ticket'
      end
    end
    
    def valid_state(state)
      tic.tic_states.include?(state)
    end
    
    def parse_ticket_assign
      @options = {}
      OptionParser.new do |opts|
        opts.banner = "Usage: ti assign [options] [ticket_id]"
        opts.on("-u USER", "--user USER", "Assign the ticket to this user") do |v|
          @options[:user] = v
        end
        opts.on("-c TICKET", "--checkout TICKET", "Checkout this ticket") do |v|
          @options[:checkout] = v
        end
      end.parse!
    end

    # Assigns a ticket to someone
    #
    # Usage:
    # ti assign             (assign checked out ticket to current user)
    # ti assign {1}         (assign ticket to current user)
    # ti assign -c {1}      (assign ticket to current user and checkout the ticket)
    # ti assign -u {name}   (assign ticket to specified user)
    def handle_ticket_assign
      parse_ticket_assign

      tic.ticket_checkout(options[:checkout]) if options[:checkout]

      tic_id = ARGV.size > 1 ? ARGV[1].chomp : nil
      tic.ticket_assign(options[:user], tic_id)
    end
    
    
    
   

    # Attaches a file to the ticket
    #
    # Usage:
    # ti attach [tid] [file]
    def handle_ticket_attach
      if ARGV.size == 1
        puts "Usage: ti attach [tid] [filename]"
        return
      end
      
      if ARGV.size > 2
        tic_id = ARGV[1].chomp
        file_path = ARGV[2].chomp
      else 
        file_path = ARGV[1].chomp
        tic_id = nil
      end
      
      file_path = File.expand_path(file_path)
      
      if (! File.exists?(file_path))
        puts "File #{file_path} does not exist."
        return
      elsif (! File.file?(file_path))
        puts "File must be a file (can't be a directory)"
        return;
      end
      
      tic.ticket_attach(file_path, tic_id)
      
    end


    ## LIST TICKETS ##
    def parse_ticket_list
      @options = {}
      OptionParser.new do |opts|
        opts.banner = "Usage: ti list [options]"
        opts.on("-o ORDER", "--order ORDER", "Field to order by - one of : assigned,state,date") do |v|
          @options[:order] = v
        end
        opts.on("-t TAG", "--tag TAG", "List only tickets with specific tag") do |v|
          @options[:tag] = v
        end
        opts.on("-s STATE", "--state STATE", "List only tickets in a specific state") do |v|
          @options[:state] = v
        end
        opts.on("-a ASSIGNED", "--assigned ASSIGNED", "List only tickets assigned to someone") do |v|
          @options[:assigned] = v
        end
        opts.on("-S SAVENAME", "--saveas SAVENAME", "Save this list as a saved name") do |v|
          @options[:save] = v
        end
        opts.on("-l", "--list", "Show the saved queries") do |v|
          @options[:list] = true
        end
      end.parse!
    end
    
    def handle_ticket_list
      parse_ticket_list
      
      options[:saved] = ARGV[1] if ARGV[1]
      
      if tickets = tic.ticket_list(options)
        counter = 0
      
        puts
        puts [' ', just('#', 4, 'r'), 
              just('TicId', 6),
              just('Title', 25), 
              just('State', 5),
              just('Date', 5),
              just('Assgn', 8),
              just('Tags', 20) ].join(" ")
            
        a = []
        80.times { a << '-'}
        puts a.join('')

        tickets.each do |t|
          counter += 1
          tic.current_ticket == t.ticket_name ? add = '*' : add = ' '
          puts [add, just(counter, 4, 'r'), 
                t.ticket_id[0,6], 
                just(t.title, 25), 
                just(t.state, 5),
                t.opened.strftime("%m/%d"), 
                just(t.assigned_name, 8),
                just(t.tags.join(','), 20) ].join(" ")
        end
        puts
      end
      
    end
    
    ## SHOW TICKETS ##
    
    def handle_ticket_show
      if t = @tic.ticket_show(ARGV[1])
        ticket_show(t)
      end
    end
    
    def ticket_show(t)
      days_ago = ((Time.now - t.opened) / (60 * 60 * 24)).round.to_s
      puts
      puts just('Title', 10) + ': ' + t.title
      puts just('TicId', 10) + ': ' + t.ticket_id
      puts
      puts just('Assigned', 10) + ': ' + t.assigned.to_s 
      puts just('Opened', 10) + ': ' + t.opened.to_s + ' (' + days_ago + ' days)'
      puts just('State', 10) + ': ' + t.state.upcase
      if !t.tags.empty?
        puts just('Tags', 10) + ': ' + t.tags.join(', ')
      end
      puts
      if !t.comments.empty?
        puts 'Comments (' + t.comments.size.to_s + '):'
        t.comments.reverse.each do |c|
          puts '  * Added ' + c.added.strftime("%m/%d %H:%M") + ' by ' + c.user
          
          wrapped = c.comment.split("\n").collect do |line|
            line.length > 80 ? line.gsub(/(.{1,80})(\s+|$)/, "\\1\n").strip : line
          end * "\n"
          
          wrapped = wrapped.split("\n").map { |line| "\t" + line }
          if wrapped.size > 6
            puts wrapped[0, 6].join("\n")
            puts "\t** more... **"
          else
            puts wrapped.join("\n")
          end
          puts
        end
      end
      if !t.attachments.empty?
        puts "Attachments (#{t.attachments.size})"
        t.attachments.reverse.each do |c| 
          puts '  * Added ' + c.added.strftime("%m/%d %H:%M") + ' by ' + c.user          
          puts "    #{c.filename}"
        end
      end
    end
    
    ## NEW TICKETS ##
    
    def parse_ticket_new
      @options = {}
      OptionParser.new do |opts|
        opts.banner = "Usage: ti new [options]"
        opts.on("-t TITLE", "--title TITLE", "Title to use for the name of the new ticket") do |v|
          @options[:title] = v
        end
      end.parse!
    end
    
    def handle_ticket_new
      parse_ticket_new
      if(t = options[:title])
        ticket_show(@tic.ticket_new(t, options))
      else
        # interactive
        message_file = Tempfile.new('ticgit_message').path
        File.open(message_file, 'w') do |f|
          f.puts "\n# ---"
          f.puts "tags:"
          f.puts "# first line will be the title of the tic, the rest will be the first comment"
          f.puts "# if you would like to add initial tags, put them on the 'tags:' line, comma delim"
        end
        if message = get_editor_message(message_file)
          title = message.shift
          if title && title.chomp.length > 0
            title = title.chomp
            if message.last[0, 5] == 'tags:'
              tags = message.pop
              tags = tags.gsub('tags:', '')
              tags = tags.split(',').map { |t| t.strip }
            end
            if message.size > 0
              comment = message.join("")
            end
            ticket_show(@tic.ticket_new(title, :comment => comment, :tags => tags))
          else
            puts "You need to at least enter a title"
          end
        else
          puts "It seems you wrote nothing"
        end
      end
    end
    
    def get_editor_message(message_file = nil)
      message_file = Tempfile.new('ticgit_message').path if !message_file
      
      editor = ENV["EDITOR"] || 'vim'
      system("#{editor} #{message_file}");
      message = File.readlines(message_file)
      message = message.select { |line| line[0, 1] != '#' } # removing comments   
      if message.empty?
        return false
      else
        return message
      end   
    end
    
    def parse_options! #:nodoc:      
      if args.empty?
        warn "Please specify at least one action to execute."
        puts " list state show new checkout comment tag assign attach "
        exit
      end

      @action = args.first
    end
    
    
    def just(value, size, side = 'l')
      value = value.to_s
      if value.size > size
        value = value[0, size]
      end
      if side == 'r'
        return value.rjust(size)
      else
        return value.ljust(size)
      end
    end
    
  end
end
