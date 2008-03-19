require 'ticgit'
require 'optparse'

# used Cap as a model for this - thanks Jamis

module TicGit
  class CLI
    # The array of (unparsed) command-line options
    attr_reader :action, :options, :args

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
      @tic = TicGit.open('.')
      $stdout.sync = true # so that Net::SSH prompts show up
    end    
    
    def execute!
      case action
      when 'list':
        handle_ticket_list
      when 'find'
        puts 'find'
      when 'show'
        puts 'show'
      when 'new'
        handle_ticket_new
      else
        puts 'not a command'
      end
    end
    
    def handle_ticket_list
      puts @tic.ticket_list.values.join("\n")
    end
    
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
        puts @tic.ticket_new(t, options)        
      end
    end
    
    def parse_options! #:nodoc:      
      if args.empty?
        warn "Please specify at least one action to execute."
        exit
      end

      @action = args.first

      puts "run [#{action}]"
    end
    
  end
end