# coding=utf-8
import os
import signal
import subprocess
import json
import re


class CommandCall:
    def __init__(self, timeout, command, agentConfig, checksLogger, rawConfig):
        self.agentConfig = agentConfig
        self.checksLogger = checksLogger
        self.rawConfig = rawConfig
        self.timeout = timeout
        self.command = command

    def parseResponse(self, data):
        # consider this method as an abstract method which should be
        raise NotImplementedError("Implement this method to parse the output of the command")

    def handler(self, signalNumber, interruptedStackFrame):
        # this handler will be called if the command could not return results in self.timeout seconds
        raise IOError("Could not execute command {0} in {1} seconds".format(str(self.command), str(self.timeout)))

    def run(self):
        # define/reset data dictionary, define exception key,
        # this key will be set if there will be an exception
        data = {'exception': None, 'result': None, 'error': None}

        try:
            # self.command is the command that will be executed at the forked child process
            # preexec_fn=os.setsid will add a session id to forked process tree's root process this id will be
            # used to kill all the processes in the tree if the root process of tree received a kill call/signal
            commandProcess = subprocess.Popen(self.command, stdout=subprocess.PIPE,
                                              shell=True, preexec_fn=os.setsid)

            # create an alarm signal on method handler
            signal.signal(signal.SIGALRM, self.handler)
            # this will arrange an alarm signal to arrive after the given number of seconds
            signal.alarm(self.timeout)

            # communicate() will read data from stdout and stderr, until end-of-file is reached
            # and it will wait for process to terminate, this may be a problem for some cases like OS level or
            # driver errors, ex. corrupt or not responding remote mounted filesystems may took very long time for
            # commands like df, ls or they may block altogether, so the signal.alarm() is used for a timeout.
            (result, error) = commandProcess.communicate()

            # set result and error values to data dictionary
            data['result'] = result
            data['error'] = error

            # should reset the alarm,
            # if time is zero, no alarm is scheduled, and any scheduled alarm is canceled.
            signal.alarm(0)

            try:
                # Popen.communicate() should read data until
                # the end-of-file is reached and wait for process to
                # terminate, here the kill should raise an OSError
                # indicating 'No such process' exists.
                # On the other hand, if the process somehow stuck
                # calling kill() method might be a good idea, and it may work
                commandProcess.kill()
            except OSError, e:
                # this exception is expected, exception set to OSError,
                # so we can monitor this from Server Density's dashboard
                # uncomment below line if you would like to see this at dashboard
                # data['exception'] = 'OSError, process already terminated, probably communicate() ' \
                #                    'method ended the process, this is OK'
                pass
            except Exception, e:
                # this exception is not expected, it might be important if the forked child processes do not terminate
                # as expected and accumulate in time, they might consume resources
                data['exception'] = 'Exception at process kill() call: {0} {1}'.format(str(e), str(type(e)))

        except IOError, e:
            # this exception raised from handler method which indicates the command could not finish its job
            # within the self.timeout seconds
            data['exception'] = 'Exception, Alarm raised IOError: {0}'.format(str(e))

        except Exception, e:
            # this exception could be anything along the execution stack
            data['exception'] = 'Exception: {0} {1}'.format(str(e), str(type(e)))

        # let the derived class handle the response
        return self.parseResponse(data)


class INode(CommandCall):
    def __init__(self, agentConfig, checksLogger, rawConfig):
        # sd-agent will call this constructor for this plugins creation, constructor will be called only once
        # first parameter is the timeout seconds
        self.timeout = 5
        # second one is the command to be called
        self.command = 'df -i'
        # this indicates if to return the all results or just the percentage
        self.allOrPercentage = True
        # pass the rest of the parameters to super as they are
        CommandCall.__init__(self, self.timeout, self.command, agentConfig, checksLogger, rawConfig)

    def run(self):
        # run method will be called for every execution of this plugin
        # call super's run method to execute the command
        return CommandCall.run(self)

    def parseResponse(self, data):
        """ expecting 'result' in data dictionary, result might be like;
        Filesystem     Inodes  IUsed  IFree IUse% Mounted on
        /dev/sda1      655360 104565 550795   16% /
        none            30475      2  30473    1% /sys/fs/cgroup
        udev            29420    398  29022    2% /dev
        tmpfs           30475    324  30151    2% /run
        none            30475      2  30473    1% /run/lock
        none            30475      1  30474    1% /run/shm
        none            30475      2  30473    1% /run/user
        """
        try:
            if data['result'] is not None:
                # result lines of the df -i command
                lines = data['result'].split('\n')

                # df has first row as the headers like Filesystem, Inodes, IUsed etc.
                headers = None
                for index in range(len(lines)):
                    line = lines[index]

                    # after stripping each line should have some content
                    # will remove the empty lines
                    line = line.strip()
                    if len(line) == 0:
                        continue

                    # there will be only one header row, and it is the first line
                    if headers is None:
                        # replacing empty string in header keyword
                        line = line.replace('Mounted on', 'Mounted_on')
                        headers = line.split()
                        continue

                    # replacing empty string, this is a quick fix for Mac
                    line = line.replace('map ', 'map')
                    values = line.split()
                    # this row(dictionary) will hold the key values for each line
                    row = {}
                    for headerIndex in range(len(headers)):
                        #Filesystem, Inodes, IUsed, IFree, IUse%, Mounted on
                        #['/dev/sda1', '655360', '104565', '550795', '16%', '/']
                        header = headers[headerIndex]
                        value = values[headerIndex]
                        if self.allOrPercentage and "%" in header:
                            # if only the percentage is asked for,
                            # return the last value as key which is something like /, /dev, /home etc.
                            # remove all non numeric values from value,
                            # for some rows the percentage value is not available, use 0 for them
                            removeNonNumeric = re.compile(r'[^\d.]+')
                            value = removeNonNumeric.sub('', value)
                            if value == "":
                                value = "0"
                            data[values[-1]] = value
                            # break the loop since no need to iterate the rest of the headers
                            break
                        else:
                            try:
                                # set each header's value for this row
                                row[header] = value
                                if headerIndex == len(headers) - 1:
                                    # add this row to data dictionary for the latest value
                                    # which is unique, like /, /dev, /home etc.
                                    data[value] = row
                            except IndexError, e:
                                pass

        except Exception, e:
            # this exception is added to the previous exception if available
            data['exception'] = "%s, Exception in INode: %s %s" % (data['exception'], str(e), str(type(e)))

        # return the data dictionary as the sd-agent expected
        # first delete the raw data read from the command output
        del data['result']

        # uncomment below line to see the returning data
        # print json.dumps(data)

        # sd-agent expects this data(dictionary)
        return data


def main():
    agentConfig, checksLogger, rawConfig = None, None, None
    iNode = INode(agentConfig, checksLogger, rawConfig)
    iNode.run()


if __name__ == '__main__': main()