<?php


echo "<h1>hodnoceni testu Jana Novaka</h1>";
$studentname = "Jan Novák";
$test1 =  101;
$test2 = 101;
$test3 = 101;

echo "<h2>Celkovy pocet bodu</h2>";

$celkovypocetbodu = $test1 + $test2 + $test3;
echo "$celkovypocetbodu<br>";

echo "<h2>prumer body</h2>";

$prumerbodu = $celkovypocetbodu/3;
echo "$prumerbodu<br>";

echo "<h2>Procenta testu</h2>";

echo "Prvni test: $test1%<br>";
echo "<br>Druhy test: $test2%<br>";
echo "<br>Treti test: $test3%<br>";

echo "<h2>Znamka testu</h2>";

echo "<h3>Znamka 1 testu</h3>";

if ($test1 >= 90) {
    echo "<br>Za 1";
}elseif ($test1 <= 89 && $test1 >= 75) {
    echo "<br>Za 2";
}elseif ($test1 <= 74 && $test1 >= 60) {
    echo "<br>Za 3";
}elseif ($test1 <= 59 && $test1 >= 40) {
    echo "<br>Za 4";
}elseif ($test1 <= 39) {
    echo "<br>Za 5";
}

echo "<h3>Znamka 2 testu</h3>";

if ($test2 >= 90) {
    echo "<br>Za 1";
}elseif ($test2 <= 89 && $test2 >= 75) {
    echo "<br>Za 2";
}elseif ($test2 <= 74 && $test2 >= 60) {
    echo "<br>Za 3";
}elseif ($test2 <= 59 && $test2 >= 40) {
    echo "<br>Za 4";
}elseif ($test2 <= 39) {
    echo "<br>Za 5";
}

echo "<h3>Znamka 3 testu</h3>";

if ($test3 >= 90) {
    echo "<br>Za 1";
}elseif ($test3 <= 89 && $test3 >= 75) {
    echo "<br>Za 2";
}elseif ($test3 <= 74 && $test3 >= 60) {
    echo "<br>Za 3";
}elseif ($test3 <= 59 && $test3 >= 40) {
    echo "<br>Za 4";
}elseif ($test3 <= 39) {
    echo "<br>Za 5";
}

