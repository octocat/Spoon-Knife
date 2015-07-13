#!/bin/bash

USERNAME=$(whoami)

INPUT=$(zenity --entry)

updatedb --require-visibility 0 -o ~/.locate.db

FILEMATCHES=$(locate --database ~/.locate.db -i -b -c "$INPUT")

if [ $FILEMATCHES == 0 ]; then
	#echo "no file matches found"
	zenity --info --text "No matches found" --timeout 2
	exit 1
else
	zenity --info --text "$FILEMATCHES matches found" --timeout 1
fi

FOUNDFILES=($(locate --database ~/.locate.db -i -b "$INPUT"))

x=0

while [ $x -lt $FILEMATCHES ]
do
	if [ $x == 0 ]
		then
		echo -n "--list --title FILE-SELECTOR --column serialno. --column file --width 1000 --height 600 --radiolist TRUE ${FOUNDFILES[$x]}" >> /home/$USERNAME/tempzen.txt
		x=$((x+1))
	else
		echo " FALSE ${FOUNDFILES[$x]}" >> /home/$USERNAME/tempzen.txt
		x=$((x+1))
	fi
done

ZEN="$(cat /home/$USERNAME/tempzen.txt)"
#echo $ZEN

SELECTEDFILE=$(zenity $ZEN)
if [ $? -eq 0 ] 
then
	zenity --progress --pulsate --timeout 2
fi

EXTENSION=$(file --mime-type $SELECTEDFILE)

if [ "$SELECTEDFILE" == "" ]
	then
		zenity --info --text "You didn't select any file to open..." --timeout 1
		rm /home/$USERNAME/tempzen.txt
		exit 1
fi

if [ "$SELECTEDFILE" != "" ] && [ "$EXTENSION" == "$SELECTEDFILE: inode/x-empty" ] || [ "$EXTENSION" == "$SELECTEDFILE: text/plain" ] || [ "$EXTENSION" == "$SELECTEDFILE: application/xml" ]
	then
		gedit $SELECTEDFILE
elif [ "$SELECTEDFILE" != "" ] && [ "$EXTENSION" == "$SELECTEDFILE: image/jpg" ] || [ "$EXTENSION" == "$SELECTEDFILE: image/jpeg" ] || [ "$EXTENSION" == "$SELECTEDFILE: image/gif" ] || [ "$EXTENSION" == "$SELECTEDFILE: image/png" ] || [ "$EXTENSION" == "$SELECTEDFILE: image/bmp" ]
	then
		xdg-open $SELECTEDFILE
elif [ "$SELECTEDFILE" != "" ] && [ "$EXTENSION" == "$SELECTEDFILE: text/html" ]
	then
		firefox $SELECTEDFILE
elif [ "$SELECTEDFILE" != "" ] && [ "$EXTENSION" == "$SELECTEDFILE: application/pdf" ]
	then
		gnome-open $SELECTEDFILE
elif [ "$SELECTEDFILE" != "" ] && [ "$EXTENSION" == "$SELECTEDFILE: text/html" ]
	then
		gnome-www-browser $SELECTEDFILE
fi

rm /home/$USERNAME/tempzen.txt
