====================
Générer les missions
====================
Remplissez le fichier des missions missions.csv et le fichier des taxons correspondants taxons.csv

Images
======

Images requises
---------------
- image miniature : 256x256 pixels, format carré
- image grandes formats : environ 900 px de large, format paysage 4/3


Générer les images
------------------

Exemple avec la bibliothèque Image Magic

:notes:

    Eviter les noms de fichiers avec espaces et accents. 
    Eviter les extensions de fichiers ex JPG et jpg


- Créez un dossier photos 
- Allez dans le dossier "photos" ou sont contenus les images en grand format

::

    mogrify -path ../photos-thumb/ -thumbnail 256x256^ -gravity center -extent 256x256 *.jpg