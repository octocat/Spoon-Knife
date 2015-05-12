require 'zlib'

def grep(option = '', str = '', *file)
  case option
    # input nearest string
    when '-A'
      file.each do |file_name|
        # read line from all files
        line_array = File.readlines("#{file_name}")

        line_array.each_with_index do |line, index|
          if line.include? str
            puts line_array[index - 1]  if (index - 1) >= 0
            puts line_array[index]
            puts line_array[index + 1]  if (index + 1) < line_array.size
          end
        end
      end
    # regular exprassion
    when '-e'
      file.each do |file_name|
        File.readlines("#{file_name}").each do |line| 
          if line.slice(Regexp.new "#{str}") != nil
            puts line
          end
        end
      end
    # read files from zlib
    when '-z'
      Zlib::GzipReader.open("#{file[0]}").each_line do |line|
        if line.include? str
          puts line
        end
      end
    # input all directory with .txt files
    when '-R'
      file_name_array = Dir['**/*.txt']

      file_name_array.each do |file_name|
        File.readlines("#{file_name}").each do |line|
          if line.include? str
            puts line
          end
        end
      end
    # other case
    else
      # if options doesn't exist
      if (option[0] != '-')
        file << str
        str = option
      end

      file.each do |file_name|
        File.readlines("#{file_name}").each do |line|
          if line.include? str
            puts line
          end
        end
      end

    end
end

# example call grep
# grep '-e', 'a[^b]', "test1.txt"
# grep '-R', 'GTA'
# grep '-z', 'GTA', 'test.tar.gz'
# grep '-A', 'a', 'test2.txt'
# grep 'a', 'test1.txt', 'test2.txt'
