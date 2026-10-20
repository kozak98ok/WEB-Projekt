<?php

echo "<h1>profil meho pocitace</h1>";

$nazevpocitace = "lenovo thnikpad"; //string
echo "<strong><p>$nazevpocitace</p></strong><br>";
$vyrobce = "lenovo";   //string
echo "<strong><p>$vyrobce</p></strong><br>";
$velikostram = "16";    //int
echo "<strong><p>$velikostram</p></strong><br>";
$velikostuloziste= "256";   //int
echo "<strong><p>$velikostuloziste</p></strong><br>";
$massd = "ano";    //boolean
echo "<strong></strong><p>$massd</p></strong><br>";
$ops = "linux debian";    //string
echo "<strong><p>$ops</p></strong><br>";

echo "<h1>Datove typy</h1>";

echo "<br>";
var_dump($nazevpocitace);
echo "<br>";
var_dump($vyrobce);
echo "<br>";
var_dump($velikostram);
echo "<br>";
var_dump($velikostuloziste);
echo "<br>";
var_dump($massd);
echo "<br>";
var_dump($ops);


