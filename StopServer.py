import os,sys,glob,re

username = r'{tool.UserName}'
password = r'{tool.PassWord}'
url = r'{tool.AdminURL}'
our_str = r"{ServerName}"

if not (username):
	print '!!!! Error...UserName cannot be empty !!!!'
	sys.exit(1)

if not (password):
	print '!!!! Error...PassWord cannot be empty !!!!'
	sys.exit(1)

if not (url):
	print '!!!! Error...AdminURL cannot be empty !!!!'
	sys.exit(1)

if not (our_str):
	print '!!!! Error...ServerName cannot be empty !!!!'
	sys.exit(1)	

print 'connecting to server....'

connect( '{tool.UserName}', '{tool.PassWord}', '{tool.AdminURL}')


our_str = r"{ServerName}"

sers= []

#Splitting by |
ser_all = our_str.split("|")

#Getting the true values
for val in ser_all:
	if '[true]' in val:
		newstr = val.replace("[true]","",1)
		sers.extend([newstr])

if not sers:
	print '!!!! Error...ServerName cannot be empty !!!!'
	sys.exit(1)			

print('\n')
print ('=============================================================')


for c in sers:
	try:
		print('\n')
		print ('!!!!!!!!!!!!Stopping Server '+c+' !!!!!!!!!!!!!!!')
		shutdown(c, 'Server')
		print '===================================================='
		print '===> Server stopped ', c, '  <==='
		print '====================================================='
		print('\n')
			
	except Exception, e:
		print('\n')
		print 'Error while stopping the server '+c+'..',e
		
print('\n\n')
print ('=============================================================')
print('\n')
disconnect()
exit()