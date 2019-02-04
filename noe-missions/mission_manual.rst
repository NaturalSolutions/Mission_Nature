====================
Générer les missions
====================
Remplissez le fichier des missions missions.csv et le fichier des taxons correspondants taxons.csv
Placez le fichier csv dans le même dossier que le script mission_tojson.php
Lancez le script dans votre terminal :
::

    php mission_tojson.php

Le fichier mission.json est créé dans le dossier où se trouve le script et le csv.

PLacez le fichier json dans le dossier :
::

    www/data



Images
======

Images requises
---------------
- thumb (images miniatures) : 256x256 pixels, format carré
- poster (images grandes formats) : environ 900 px de large, format paysage 4/3

Nom des images
---------------
Missions

Les images des missions, poster et thumb, sont nommées à partir de l'identifinat de la mission.

.. NOTE::

    Exemple pour la mission 1, l'image de présentation de cette mission sera : 01.jpg (Attention l'extension de fichier est en minuscule)
   


Taxons
Les images des taxons, poster et thumb, sont nommées à partir de l'identifiant de la mission.

.. NOTE::

    Exemple pour le taxon 1, l'image de présentation de ce taxon sera : 01.jpg (Attention l'extension de fichier doir être en minuscule)
   

Emplacement des images
----------------------
Mission
::

    www/images/mission_taxon/mission (/poster ou /thumb)

Taxons
::

    www/images/mission_taxon/taxon (/poster ou /thumb)



Générer les images
------------------

Exemple avec la bibliothèque Image Magic

.. NOTE::

    Eviter les noms de fichiers avec espaces et accents. 
    Eviter les extensions de fichiers ex JPG et jpg


- Créez un dossier photos et un dossier photos-thumb
- Allez dans le dossier "photos" ou sont contenus les images en grand format

::

    mogrify -path ../photos-thumb/ -thumbnail 256x256^ -gravity center -extent 256x256 *.jpg