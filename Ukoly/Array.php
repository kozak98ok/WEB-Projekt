<?php
/*$predmet1 = "jabka";
$predmet2 = "hrusky";
$predmet3 = "ananas";
$predmet4 = "palky";
$predmet5 = "kokos";
$predmet6 = "hranolky";
$predmet7 = "mekac";
$predmet8 = "granat";
$predmet9 = "sirovodik";
$predmet10 = "roboti";


$hodnoty = ["palky","carky","lopaty","cinsky nudle","prasek","boty","kradeny","parky","hrasek","kopr"];*/

echo "<h1>Ukoly 3</h1>";

echo "<h2>Ukol A</h2>";
$movies = ["sharktornado1","sharktornado2","sharktornado3","sharktornado4"];

echo $movies[0] . "<br>";
echo $movies[3] . "<br>";

$movies[] = "sharktornado5";

echo "Počet měst v poli: " . count($movies);

echo "<h2>Ukol B</h2>";
echo "<ul>";
foreach ($movies as $movie) {
    echo "<li>$movie</li>";
}
echo "</ul>";

echo "<h2>Ukol C</h2>";
$sum = 0;
$grades = [1,2,1,3,2,1,4];
foreach ($grades as $grade) {
    $sum += $grade;
}
echo $sum;



$average = $sum / count($grades)  ;
$prumer =round($average,2);
echo "<br>" . $prumer;

echo "<h2>Ukol D</h2>";
$pocetdnu = 0;
$Temperatures = [18, 22, 25, 19, 27, 24, 16];
foreach ($Temperatures as $temperature) {
    if ($temperature >= 23) {
        echo "<br>" . $temperature;
        $pocetdnu++;
    }
}
echo "<br>" . $pocetdnu;
