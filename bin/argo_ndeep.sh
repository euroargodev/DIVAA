#!/bin/sh
#K.BALEM
#2017
################
LA='ar_index_global_prof.txt'
################
#repertoire temporaire unique
tempdir="temp_"`date +%H%M%S`
mkdir $tempdir
#dates
dati=".nc,"`date -d"0 days ago" +%Y%m%d`
NN=30 #30 DAYS
for ((o=1; o<=$NN; o++))
do
dati=$dati"|.nc,"`date -d"$o days ago" +%Y%m%d`
done
echo $dati
#
NAME='ARGO'$NN'DEEP'
outf=$NAME.js
###### GLOBAL ########
#Selection du type de données dans le fichier source
grep "/profiles/" $LA | grep -E $dati > $tempdir/temp1
#On ne garde que les DEEP
#On recupere lat,lon, le nom de la platform, date de la data, institution
awk -F"," '{if($6==838 || $6==849 || $6==862 || $6==864 || $6==874)   print $3","$4","substr($1,match($1,"/profiles/")-7,7)","$2","$7}' $tempdir/temp1 > $tempdir/temp2
#On trie fonction du temps
sort $tempdir/temp2 -k4 -t, > $tempdir/temp3
#On commence le .js
echo "var Data_$NAME = [" > $outf
#On vire les quotes
sed -i 's/"//g' $tempdir/temp3
#On construit les variables .js (la dernière ligne peut contenir une virgule c'est pas génant)
awk -v SELEC=$NAME -F"," '{
printf("{\"latitude\":%f,\"longitude\":%f,\"mtype\":\"%s\",\"Platform\":\"%s\",\"Institution\":\"%s\",\"Time\":\"%s\"}, \n",$1,$2,SELEC,$3,$5,$4)
}' $tempdir/temp3 >> $outf
#fermeture du .js
echo "];" >> $outf
#supression du repertoire temporaire
rm -rf $tempdir
#move to final destination
mv $outf ../data/
