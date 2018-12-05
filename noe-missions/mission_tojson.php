<?php
$missions_rows = file_get_contents('./missions.csv');
$missions_rows = explode("\r\n", $missions_rows);
array_shift($missions_rows);
$ouput = array();
// Set your CSV feed
$feed = './taxons.csv';
// Function to convert CSV into associative array with right species
function csvtoarray($id_especes, $file, $delimiter) 
{
  if (($handle = fopen($file, 'r')) !== FALSE) {
    $k = 0;
    $i = 0; 
      while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) {
        if (($id_especes[$k] == $lineArray[0]) || $lineArray[0] == "id") {
          for ($j = 0; $j < count($lineArray); $j++) { 
            $arr[$i][$j] = $lineArray[$j];
          } 
          if ($lineArray[0] != "id")
            $k++; 
          $i++;
       }
    }
    fclose($handle);
  }
  return $arr;
}

foreach ($missions_rows as $key => $mission_row) {
  $mission_row = explode(";", $mission_row);
  $id = (int) $mission_row[0];
  if ( $id ) {
    $id_especes = explode(',', $mission_row[7]);
    sort($id_especes);
    $seasons = explode('-', $mission_row[5]);
    $introduction = trim($mission_row[6], '"');
    $title = trim($mission_row[2], '"');
    // Arrays use every new missions
    $keys = array();
    $newArray = array();
    // Do the function 
    $data = csvtoarray($id_especes, $feed, ';');
    // Set number of elements (minus 1 because we shift off the first row)
    $count = count($data) - 1;
    //Use first row for names
    $labels = array_shift($data);
    foreach ($labels as $label) {
      $keys[] = $label;
    }
    // Bring it all together
    for ($j = 0; $j < $count; $j++) {
      $d = array_combine($keys, $data[$j]);
      $newArray[$j] = $d;
    }    
    $mission_row = array(
      'id' => $id,
      'num' => $mission_row[1],
      'title' => $title,
      'plural' => (int) $mission_row[3],
      'difficulty' => (int) $mission_row[4],
      'seasons' => array(
        array(
          'startAt' => $seasons[0],
          'endAt' => $seasons[1],
        ),
      ),
      'introduction' => $introduction,
      'id_taxons' => $id_especes,
      'taxon' => $newArray,
    );
    $ouput[] = $mission_row;
  }
}

print_r($ouput);
file_put_contents('./missions.json', json_encode($ouput, JSON_PRETTY_PRINT));

?>