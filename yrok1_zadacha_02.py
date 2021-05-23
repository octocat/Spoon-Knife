our_time=int(input('duration = '))
hour=str(our_time//3600)
minut=(our_time//60)%60
sek=our_time%60
if minut<10:
    minut='0'+str(minut)
else:
    minut=str(minut)
if sek<10:
    sek='0'+str(sek)
else:
    s=str(sek)
print("час"+hour+"мин"+minut+"сек"+sek)