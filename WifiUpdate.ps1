$file = "C:/"
$me = whoami
$me = $me.replace("na\", "")

#create custom user filepath in Downloads 
$file = $file + "Users/" + $me + "/Downloads/" +  "Wi-Fi-RHGuest.xml"

#download wlan profile with new password 
wget "http://www.nickchlam.com/Wi-Fi-RHGuest.xml" -outfile $file

#wait while file downloads
Start-Sleep -s 2

#add new profile on RHGuest network 
netsh wlan add profile filename=$file


Start-Sleep -s 5


















